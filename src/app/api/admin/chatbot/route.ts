import { NextRequest, NextResponse } from "next/server";
import { getProjects, getExperiences } from "@/lib/db";
import { buildPortfolioContext } from "@/lib/portfolio-context";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "MISTRAL_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Build context from current data
    const projects = await getProjects();
    const experiences = await getExperiences();
    const context = buildPortfolioContext(projects, experiences);

    const systemPrompt = `Tu es l'assistant personnel de Jonathan Bouniol. Tu l'aides à se préparer pour des entretiens, à réfléchir sur ses projets, et à formuler ses réponses.

Tu as accès à TOUTES les données de son portfolio :

${context}

Règles :
- Réponds dans la langue de la question (français ou anglais)
- Sois direct, concret et utile
- Quand Jonathan te demande de le préparer à un entretien, pose-lui des questions ciblées et aide-le à structurer ses réponses avec la méthode STAR (Situation, Task, Action, Result)
- Cite des projets et expériences spécifiques pour appuyer tes suggestions
- Si on te demande de résumer son parcours, sois synthétique et impactant
- Tu peux suggérer des angles de présentation, des points forts à mettre en avant, ou des réponses à des questions classiques d'entretien
- Sois honnête — ne survendons pas, mais mettons en valeur ce qui est vraiment bien
- Tu es un sparring partner, pas un flatteur`;

    const response = await fetch(
      "https://api.mistral.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "mistral-large-latest",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          temperature: 0.5,
          max_tokens: 2000,
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[chatbot] Mistral error:", errorText);
      return NextResponse.json(
        { error: "AI service error" },
        { status: 502 }
      );
    }

    // Stream response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n").filter((line) => line.trim());

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") {
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                  break;
                }
                try {
                  const json = JSON.parse(data);
                  const content = json.choices?.[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({ content })}\n\n`
                      )
                    );
                  }
                } catch {
                  // Skip malformed chunks
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("[chatbot] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
