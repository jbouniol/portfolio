import { NextRequest, NextResponse } from "next/server";
import { getProjects, getExperiences } from "@/lib/db";
import {
  generateAdminChatCompletion,
  resolveAdminChatModel,
} from "@/lib/ai";
import {
  buildCompactContext,
  buildTargetedContext,
  extractMentionSlugs,
  resolveResponseStyle,
  sanitizeTurns,
  stripMentions,
} from "@/lib/admin-chatbot/context";
import { buildDisambiguationContext } from "@/lib/ai-disambiguation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const turns = sanitizeTurns(body?.messages);
    if (!turns) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      );
    }

    const model = resolveAdminChatModel(body?.model);
    const responseStyle = resolveResponseStyle(body?.responseStyle);

    const [projects, experiences] = await Promise.all([
      getProjects(),
      getExperiences(),
    ]);

    const rawMentionSlugs: unknown[] = Array.isArray(body?.mentionSlugs)
      ? (body.mentionSlugs as unknown[])
      : [];
    const mentionSlugsFromBody: string[] = Array.from(
      new Set(
        rawMentionSlugs
          .filter((value): value is string => typeof value === "string")
          .map((value: string) => value.trim().toLowerCase())
          .filter((value: string) => /^[a-z0-9][a-z0-9-]{1,80}$/.test(value))
      )
    );

    const latestUserTurn = [...turns].reverse().find((turn) => turn.role === "user");
    const mentionedSlugs =
      mentionSlugsFromBody.length > 0
        ? mentionSlugsFromBody
        : latestUserTurn
          ? extractMentionSlugs(latestUserTurn.content)
          : [];
    const targetedContext = buildTargetedContext(
      mentionedSlugs,
      projects,
      experiences
    );

    const turnsWithoutMentions = turns
      .map((turn) => {
        if (turn.role !== "user") return turn;
        return { ...turn, content: stripMentions(turn.content) };
      })
      .filter((turn) => Boolean(turn.content.trim()));
    const effectiveTurns = turnsWithoutMentions.length > 0 ? turnsWithoutMentions : turns;

    const latestUserQuery = [...effectiveTurns]
      .reverse()
      .find((turn) => turn.role === "user")?.content ?? "";
    const compactContext = buildCompactContext({
      latestUserQuery,
      projects,
      experiences,
      mentionedSlugs,
      targetedContext,
    });
    const disambiguationContext = buildDisambiguationContext({
      query: latestUserQuery,
      projects,
      experiences,
    });

    const recentTurns = effectiveTurns.slice(-10);
    const systemPrompt = `Tu es Bob, l'assistant personnel de Jonathan Bouniol.
Tu l'aides à se préparer pour des entretiens, à réfléchir sur ses projets, et à formuler ses réponses.

Contexte portfolio sélectionné pour cette requête :

${compactContext}

${
  disambiguationContext
    ? `\nAmbiguity guardrails (critical):\n${disambiguationContext}\n`
    : ""
}

Règles :
- Réponds dans la langue de la question (français ou anglais)
- Sois direct, concret et utile
- Si Jonathan a utilisé des @mentions, priorise d'abord ces contextes dans ta réponse
- Ne fusionne jamais un projet et une expérience même si l'entreprise est la même (ex: Generali)
- Si la question est ambiguë sur une entreprise commune, sépare la réponse en 2 blocs: "Experience" et "Project"
- Quand Jonathan te demande de le préparer à un entretien, pose des questions ciblées et structure les réponses avec la méthode STAR (Situation, Task, Action, Result)
- Cite des projets et expériences spécifiques
- Si on te demande un résumé, sois synthétique et impactant
- Tu peux suggérer des angles de présentation, points forts, et réponses aux questions d'entretien
- Sois honnête : pas de survente
- Tu es un sparring partner, pas un flatteur
- Style de réponse demandé: ${responseStyle === "deep" ? "Deep (plus détaillé, structuré, actionnable)" : "Concise (court, direct, priorisé)"}`;

    const content = await generateAdminChatCompletion({
      model,
      turns: recentTurns,
      systemPrompt,
      temperature: responseStyle === "deep" ? 0.45 : 0.35,
      maxTokens: responseStyle === "deep" ? 1200 : 850,
    });

    return NextResponse.json({ content, model, responseStyle });
  } catch (error) {
    console.error("[chatbot] Error:", error);
    const message =
      error instanceof Error && /_API_KEY/.test(error.message)
        ? error.message
        : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
