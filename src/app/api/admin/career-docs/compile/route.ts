import { NextRequest, NextResponse } from "next/server";
import { fetchWithTimeout } from "@/lib/fetch";

export const runtime = "nodejs";

const LATEX_ONLINE_DATA_URL = "https://latexonline.cc/data";
const MAX_LATEX_CHARS = 90_000;
const LATEX_COMPILE_TIMEOUT_MS = 45_000;
const LATEX_COMPILE_RETRIES = 1;

function sanitizeLatex(input: unknown): string {
  if (typeof input !== "string") return "";
  return input.trim();
}

function sanitizeFilename(input: unknown): string {
  if (typeof input !== "string") return "document";
  const cleaned = input
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return cleaned || "document";
}

async function parsePdfPayload(response: Response): Promise<ArrayBuffer> {
  const contentType = response.headers.get("content-type") || "";
  const buffer = await response.arrayBuffer();
  const isPdfLike =
    contentType.includes("application/pdf") ||
    contentType.includes("application/octet-stream");

  if (!isPdfLike || buffer.byteLength < 1000) {
    const preview = new TextDecoder()
      .decode(new Uint8Array(buffer).slice(0, 360))
      .replace(/\s+/g, " ")
      .trim();
    throw new Error(
      `LaTeX service returned invalid PDF payload (${contentType || "unknown"}). ${preview}`
    );
  }

  return buffer;
}

function writeString(target: Buffer, value: string, offset: number, maxLength: number) {
  const encoded = Buffer.from(value.slice(0, maxLength), "utf8");
  encoded.copy(target, offset, 0, Math.min(encoded.length, maxLength));
}

function writeOctal(
  target: Buffer,
  value: number,
  offset: number,
  length: number,
  withTrailingSpace = false
) {
  const octal = Math.max(0, value).toString(8);
  if (withTrailingSpace) {
    const content = octal.padStart(length - 2, "0") + "\0 ";
    writeString(target, content, offset, length);
    return;
  }
  const content = octal.padStart(length - 1, "0") + "\0";
  writeString(target, content, offset, length);
}

function createTarArchive(fileName: string, fileContent: string): Buffer {
  const content = Buffer.from(fileContent, "utf8");
  const header = Buffer.alloc(512, 0);

  writeString(header, fileName, 0, 100);
  writeOctal(header, 0o644, 100, 8);
  writeOctal(header, 0, 108, 8);
  writeOctal(header, 0, 116, 8);
  writeOctal(header, content.length, 124, 12);
  writeOctal(header, Math.floor(Date.now() / 1000), 136, 12);
  header.fill(0x20, 148, 156); // Checksum must be spaces while computing
  writeString(header, "0", 156, 1); // Regular file
  writeString(header, "ustar", 257, 5);
  writeString(header, "00", 263, 2);

  let checksum = 0;
  for (let i = 0; i < 512; i++) checksum += header[i];
  writeOctal(header, checksum, 148, 8, true);

  const contentPadding = (512 - (content.length % 512)) % 512;
  const padding = Buffer.alloc(contentPadding, 0);
  const end = Buffer.alloc(1024, 0); // Two zero blocks

  return Buffer.concat([header, content, padding, end]);
}

async function compileViaTarball(latex: string): Promise<ArrayBuffer> {
  let lastError: unknown = null;

  for (let attempt = 0; attempt <= LATEX_COMPILE_RETRIES; attempt++) {
    try {
      const tar = createTarArchive("main.tex", latex);
      const tarBytes = Uint8Array.from(tar);
      const formData = new FormData();
      formData.append(
        "file",
        new Blob([tarBytes], { type: "application/x-tar" }),
        "source.tar"
      );

      const response = await fetchWithTimeout(
        `${LATEX_ONLINE_DATA_URL}?target=main.tex&command=lualatex`,
        {
          method: "POST",
          body: formData,
          cache: "no-store",
          timeoutMs: LATEX_COMPILE_TIMEOUT_MS,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`LaTeX compile failed: ${errorText.slice(0, 400)}`);
      }

      return parsePdfPayload(response);
    } catch (error) {
      lastError = error;
    }
  }

  if (
    lastError instanceof Error &&
    /timed out/i.test(lastError.message)
  ) {
    throw new Error(
      "LaTeX compiler timed out. Please retry or download .tex for local compile."
    );
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("LaTeX compile failed");
}

async function compileLatexToPdf(latex: string): Promise<ArrayBuffer> {
  return compileViaTarball(latex);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const latex = sanitizeLatex(body?.latex);
    const filename = sanitizeFilename(body?.filename);

    if (!latex) {
      return NextResponse.json({ error: "latex is required" }, { status: 400 });
    }

    if (latex.length > MAX_LATEX_CHARS) {
      return NextResponse.json(
        {
          error: `latex is too long (max ${MAX_LATEX_CHARS} chars). Download .tex for local compile.`,
        },
        { status: 400 }
      );
    }

    const pdf = await compileLatexToPdf(latex);
    return new NextResponse(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[career-docs/compile] Error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Unable to compile LaTeX into PDF";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
