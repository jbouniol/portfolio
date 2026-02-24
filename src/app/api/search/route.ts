import { NextRequest, NextResponse } from "next/server";
import { projects } from "@/data/projects";
import { experiences } from "@/data/experiences";

// Build the full context from all projects and experience data
function buildPortfolioContext(): string {
  const projectChunks = projects.map((p) => {
    return `## ${p.company} — ${p.title}
Slug: ${p.slug}
Tags: ${p.tags.join(", ")}
Duration: ${p.duration} | Year: ${p.year}${p.badge ? ` | Badge: ${p.badge}` : ""}${p.isNDA ? " | NDA" : ""}
Tagline: ${p.tagline}
Context: ${p.context}
Problem: ${p.problem}
Data: ${p.data}
Method: ${p.method}
Result: ${p.result}
Impact: ${p.impact}`;
  });

  const experienceChunks = experiences.map((e) => {
    return `## ${e.company} — ${e.role}
Period: ${e.period} | Location: ${e.location}
Tagline: ${e.tagline}
Description: ${e.description}
Missions: ${e.isConfidential ? "Classified — cannot be disclosed" : e.missions.join("; ")}${e.tools ? `\nTools: ${e.tools.join(", ")}` : ""}`;
  });

  return `# Jonathan Bouniol — Portfolio Data

## Profile
- Student at Albert School x Mines Paris PSL (MSc Data & AI for Business)
- 14 Business Deep Dives across BCG, Louis Vuitton, CMA-CGM, BNP Paribas, Carrefour, SNCF, Henkel, and more
- 1 ML School Project: Finovera (AI Stock Portfolio Advisor)
- 4x BDD Winner, 4x Finalist/Podium
- Skills: Python, SQL, Scikit-learn, PyTorch, Qlik Sense, Power BI, Excel/VBA, Make, Zapier, Notion, GenAI
- Email: jbouniol@albertschool.com
- Education: MSc Mines Paris PSL x Albert School (2025-2027), Bachelor Albert School x Mines Paris PSL (2023-2025), Baccalaureat Ecole Pascal (2020-2023)

## Work Experience & Leadership

${experienceChunks.join("\n\n")}

## Other Leadership
- Notion Campus Leader (Sep 2025 — Present): Selected for Notion's international program. Developing the Notion community at Albert School.
- Student Representative at Albert School (Sep 2023 — Present): Student fairs across Paris, Marseille, Lyon, Geneva. Hosted workshop for 200 students in Luxembourg.
- Capgemini Ambassador (2024-2025): Representing Capgemini on campus at Albert School.

## Projects (Business Deep Dives & School Projects)

${projectChunks.join("\n\n")}`;
}

const PORTFOLIO_CONTEXT = buildPortfolioContext();

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.MISTRAL_API_KEY;

    if (!apiKey || apiKey === "your_mistral_api_key_here") {
      return NextResponse.json(
        { error: "MISTRAL_API_KEY not configured" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant embedded in Jonathan Bouniol's portfolio website. Your job is to answer questions about his projects, skills, experience, and background using ONLY the information provided below.

Rules:
- Answer in the same language as the question (French or English)
- Be concise and precise — 2-4 sentences max per answer
- When referencing a project, always include the company name and project title
- When referencing work experience, include company name, role, and period
- If a project has a badge (Winner, Finalist, 2nd Place), mention it
- If asked about something not in the data, say you don't have that information
- For the CND (Commissariat du Numerique de Defense), missions are classified — only share what is publicly available
- IMPORTANT: Distinguish between PROJECTS (Business Deep Dives, School Projects) and WORK EXPERIENCE (internships, jobs, leadership roles). They are NOT the same thing.
- Format your response as JSON with this structure:
  {
    "answer": "Your text answer here",
    "relatedProjects": ["slug1", "slug2"],
    "type": "project" | "experience" | "skill" | "general"
  }

Portfolio data:
${PORTFOLIO_CONTEXT}`,
          },
          {
            role: "user",
            content: query,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Mistral API error:", errorData);
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

    // Parse the JSON response from Mistral
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      // If JSON parsing fails, return as plain text
      parsed = {
        answer: content,
        relatedProjects: [],
        type: "general",
      };
    }

    // Enrich with project data
    const relatedProjectData = (parsed.relatedProjects || [])
      .map((slug: string) => projects.find((p) => p.slug === slug))
      .filter(Boolean)
      .map((p: (typeof projects)[number]) => ({
        slug: p.slug,
        title: p.title,
        company: p.company,
        tagline: p.tagline,
        badge: p.badge,
        tags: p.tags,
      }));

    return NextResponse.json({
      answer: parsed.answer,
      relatedProjects: relatedProjectData,
      type: parsed.type || "general",
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
