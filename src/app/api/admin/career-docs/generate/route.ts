import { NextRequest, NextResponse } from "next/server";
import { getExperiences, getProjects } from "@/lib/db";
import {
  generateAdminChatCompletion,
  resolveAdminChatModel,
  type AdminChatModel,
} from "@/lib/ai";
import { buildPortfolioContext } from "@/lib/portfolio-context";
import {
  GENERIC_COVER_LETTER_TEMPLATE,
  GENERIC_CV_LATEX_TEMPLATE,
} from "@/lib/career-docs";

export const runtime = "nodejs";

type CareerDocType = "cv" | "cover-letter";
type CareerDocLanguage = "fr" | "en";

interface GeneratePayload {
  documentType: CareerDocType;
  jobTitle: string;
  company: string;
  jobDescription: string;
  language?: CareerDocLanguage;
  extraInstructions?: string;
  model?: string;
}

function getDefaultModel(): AdminChatModel {
  if (process.env.GEMINI_API_KEY) return "gemini-2.0-flash";
  return "mistral-large-latest";
}

function sanitizeText(value: unknown, maxLength = 6000): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function extractLatexDocument(raw: string): string | null {
  const withoutFences = raw
    .replace(/```latex/gi, "")
    .replace(/```tex/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = withoutFences.indexOf("\\documentclass");
  const end = withoutFences.lastIndexOf("\\end{document}");
  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  return withoutFences
    .slice(start, end + "\\end{document}".length)
    .trim();
}

function buildSystemPrompt({
  documentType,
  language,
}: {
  documentType: CareerDocType;
  language: CareerDocLanguage;
}) {
  const docLabel = documentType === "cv" ? "CV" : "cover letter";

  return `You are an elite career writer and LaTeX editor for tech candidates.
Your goal is to generate a highly tailored ${docLabel} in ${language === "fr" ? "French" : "English"}.

Hard constraints:
- Return ONLY raw LaTeX (no markdown, no code fences, no explanations).
- Return a complete standalone .tex document from \\documentclass to \\end{document}.
- Ensure the file compiles with pdflatex (if using fontspec, guard it behind iftex).
- Keep every claim truthful and anchored in the provided portfolio context.
- Do not invent confidential details.
- Keep tone concrete, outcome-oriented, and recruiter-friendly.

Formatting constraints:
- Escape LaTeX special characters in inserted text.
- Keep clean line breaks and readable structure.
- For CV: keep one page style and prioritize relevance to the target role.
- For cover letter: 230 to 340 words, no fluff, directly tied to role and company.`;
}

function buildUserPrompt({
  payload,
  portfolioContext,
}: {
  payload: GeneratePayload;
  portfolioContext: string;
}) {
  const template =
    payload.documentType === "cv"
      ? GENERIC_CV_LATEX_TEMPLATE
      : GENERIC_COVER_LETTER_TEMPLATE;

  return `Target role context:
- Role title: ${payload.jobTitle}
- Company: ${payload.company}
- Job description:
${payload.jobDescription}

Extra instructions:
${payload.extraInstructions || "None"}

Candidate portfolio context:
${portfolioContext}

Base template to adapt:
${template}

Output requirement:
- Produce the final tailored ${payload.documentType === "cv" ? "CV" : "cover letter"} as a complete LaTeX document.
- Keep NDA-safe wording where details are sensitive.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<GeneratePayload>;

    const documentType = body.documentType;
    if (documentType !== "cv" && documentType !== "cover-letter") {
      return NextResponse.json(
        { error: "documentType must be 'cv' or 'cover-letter'" },
        { status: 400 }
      );
    }

    const jobTitle = sanitizeText(body.jobTitle, 200);
    const company = sanitizeText(body.company, 200);
    const jobDescription = sanitizeText(body.jobDescription, 8000);
    const language =
      body.language === "fr" || body.language === "en" ? body.language : "en";
    const extraInstructions = sanitizeText(body.extraInstructions, 3000);

    if (!jobTitle || !company || !jobDescription) {
      return NextResponse.json(
        { error: "jobTitle, company and jobDescription are required" },
        { status: 400 }
      );
    }

    const model = body.model
      ? resolveAdminChatModel(body.model)
      : getDefaultModel();

    const [projects, experiences] = await Promise.all([
      getProjects(),
      getExperiences(),
    ]);
    const portfolioContext = buildPortfolioContext(projects, experiences);

    const latexRaw = await generateAdminChatCompletion({
      model,
      turns: [
        {
          role: "user",
          content: buildUserPrompt({
            payload: {
              documentType,
              jobTitle,
              company,
              jobDescription,
              language,
              extraInstructions,
            },
            portfolioContext,
          }),
        },
      ],
      systemPrompt: buildSystemPrompt({ documentType, language }),
      temperature: 0.3,
      maxTokens: documentType === "cv" ? 3200 : 2200,
    });

    const latex = extractLatexDocument(latexRaw);
    if (!latex) {
      return NextResponse.json(
        {
          error:
            "AI returned an invalid LaTeX document. Please retry with a shorter job description.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ latex, model, documentType });
  } catch (error) {
    console.error("[career-docs/generate] Error:", error);
    const message =
      error instanceof Error && /_API_KEY/.test(error.message)
        ? error.message
        : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
