import { NextRequest, NextResponse } from "next/server";
import { fetchWithTimeout } from "@/lib/fetch";

export async function POST(req: NextRequest) {
  try {
    const { description, type } = await req.json();

    if (!description || !type) {
      return NextResponse.json(
        { error: "description and type are required" },
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

    const projectSchema = `{
  "slug": "kebab-case-slug",
  "title": "Project Title",
  "company": "Company Name",
  "tagline": "One-paragraph summary",
  "tags": ["AI", "Data", ...], // from: AI, ML, Data, NLP, Consulting, Strategy, Finance, Retail, Luxury, Defense, Transport, Logistics, Automation, SaaS
  "context": "Background context paragraph",
  "problem": "Problem statement",
  "data": "Description of data used",
  "method": "Methodology description",
  "result": "Results achieved",
  "impact": "Business impact",
  "year": "Bachelor 2 / 2025 / etc",
  "duration": "3 weeks / Consulting Mission / etc",
  "category": "bdd" | "hackathon" | "consulting" | "school",
  "badge": "" | "Winner" | "Finalist" | "2nd Place" | "Honorable Mention",
  "contributors": ["Name 1", "Name 2"],
  "canvaEmbedUrl": "",
  "githubUrl": ""
}`;

    const experienceSchema = `{
  "slug": "kebab-case-slug",
  "role": "Job Title",
  "company": "Company Name",
  "period": "Start — End",
  "location": "City, Region",
  "type": "work" | "leadership",
  "tagline": "One-paragraph summary",
  "description": "Detailed role description",
  "missions": ["Mission 1", "Mission 2", ...],
  "tools": ["Tool 1", "Tool 2", ...],
  "isConfidential": false
}`;

    const systemPrompt = `You are an AI assistant that generates structured portfolio data from free-form descriptions.

Given a user's description, generate a complete JSON object for a ${type === "project" ? "project" : "experience"} entry.

Expected JSON schema:
${type === "project" ? projectSchema : experienceSchema}

Rules:
- Generate professional, concise content in English
- For slugs, use kebab-case derived from the company/title
- For projects: write detailed but focused context, problem, data, method, result, and impact sections
- For experiences: write professional mission descriptions as individual bullet points
- Choose appropriate tags from the available list
- Be realistic — don't overstate results
- Return ONLY the JSON object, no markdown, no code blocks`;

    const response = await fetchWithTimeout(
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
            { role: "user", content: description },
          ],
          temperature: 0.4,
          max_tokens: 2000,
          response_format: { type: "json_object" },
        }),
        timeoutMs: 30_000,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[ai-prefill] Mistral error:", errorText);
      return NextResponse.json(
        { error: "AI service error" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 502 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response", raw: content },
        { status: 502 }
      );
    }

    return NextResponse.json({ data: parsed });
  } catch (error) {
    console.error("[ai-prefill] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
