import { NextRequest, NextResponse } from "next/server";
import {
  generateAdminChatCompletion,
  resolveAdminChatModel,
  type AdminChatModel,
} from "@/lib/ai";

const ACTIONS = new Set(["improve", "shorten", "star"]);

function getPolishModelCandidates(preferred?: AdminChatModel): AdminChatModel[] {
  if (preferred) return [preferred];

  const candidates: AdminChatModel[] = [];
  if (process.env.GEMINI_API_KEY) {
    candidates.push("gemini-2.0-flash", "gemini-1.5-pro");
  }
  if (process.env.MISTRAL_API_KEY) {
    candidates.push("mistral-small-latest", "mistral-large-latest");
  }

  if (candidates.length === 0) {
    candidates.push("gemini-2.0-flash");
  }

  return Array.from(new Set(candidates));
}

function extractActionableError(error: unknown): string {
  if (!(error instanceof Error)) return "Internal server error";
  const message = (error.message || "").trim();
  if (!message) return "Internal server error";

  if (/_API_KEY/.test(message)) return message;
  if (/Gemini error:|Mistral error:/.test(message)) {
    return message.slice(0, 320);
  }

  if (/fetch failed|network|ECONN|ENOTFOUND|ETIMEDOUT/i.test(message)) {
    return "AI provider unavailable right now. Check network access and API key restrictions.";
  }

  return message.slice(0, 240);
}

function buildInstruction(action: string, context?: string) {
  const contextLine = context ? `Contexte du champ: ${context}` : "";

  if (action === "shorten") {
    return `Tu es un éditeur de contenu portfolio.
${contextLine}
Raccourcis le texte sans perdre les informations clés. Ton professionnel, concret.
Retourne uniquement le texte final, sans markdown ni commentaires.`;
  }

  if (action === "star") {
    return `Tu es un coach entretien.
${contextLine}
Réécris le texte selon une logique STAR claire (Situation, Task, Action, Result) avec des transitions naturelles.
Retourne uniquement le texte final, sans markdown ni commentaires.`;
  }

  return `Tu es un éditeur expert de portfolio tech.
${contextLine}
Améliore le texte: plus clair, plus impactant, plus précis, sans inventer d'information.
Retourne uniquement le texte final, sans markdown ni commentaires.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    const action = typeof body?.action === "string" ? body.action : "improve";
    const context = typeof body?.context === "string" ? body.context : undefined;

    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    if (!ACTIONS.has(action)) {
      return NextResponse.json({ error: "invalid action" }, { status: 400 });
    }

    if (text.length > 7000) {
      return NextResponse.json(
        { error: "text is too long (max 7000 chars)" },
        { status: 400 }
      );
    }

    const preferredModel = body?.model
      ? resolveAdminChatModel(body.model)
      : undefined;
    const modelCandidates = getPolishModelCandidates(preferredModel);

    let rewritten: string | null = null;
    let usedModel: AdminChatModel | null = null;
    let lastError: unknown = null;

    for (const model of modelCandidates) {
      try {
        rewritten = await generateAdminChatCompletion({
          model,
          turns: [{ role: "user", content: text }],
          systemPrompt: buildInstruction(action, context),
          temperature: 0.25,
          maxTokens: 1000,
        });
        usedModel = model;
        break;
      } catch (error) {
        lastError = error;
      }
    }

    if (!rewritten || !usedModel) {
      throw lastError ?? new Error("No available model for AI polish");
    }

    return NextResponse.json({ text: rewritten, model: usedModel });
  } catch (error) {
    console.error("[ai-polish] Error:", error);
    const message = extractActionableError(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
