import { NextRequest, NextResponse } from "next/server";
import { getPublishedProjects, getPublishedExperiences } from "@/lib/db";
import { buildPortfolioContext } from "@/lib/portfolio-context";
import type { Project } from "@/data/projects";
import { fetchWithTimeout } from "@/lib/fetch";
import { SUPPLEMENTAL_EXPERIENCE_ITEMS } from "@/data/profile";
import { buildDisambiguationContext } from "@/lib/ai-disambiguation";

export async function POST(req: NextRequest) {
  try {
    const { query, pageContext } = await req.json();

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

    // Fetch live data from KV (with fallback to static)
    const [projects, experiences] = await Promise.all([
      getPublishedProjects(),
      getPublishedExperiences(),
    ]);
    const allExperienceSlugs = Array.from(
      new Set([
        ...experiences.map((item) => item.slug),
        ...SUPPLEMENTAL_EXPERIENCE_ITEMS.map((item) => item.slug),
      ])
    ).join('", "');

    const portfolioContext = buildPortfolioContext(projects, experiences);
    const disambiguationContext = buildDisambiguationContext({
      query,
      projects,
      experiences,
    });

    const response = await fetchWithTimeout("https://api.mistral.ai/v1/chat/completions", {
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
${pageContext ? `\nCurrent user context: The visitor is currently viewing ${pageContext}. Prioritize content relevant to this context when applicable.\n` : ""}
Rules:
- Answer in the same language as the question (French or English)
- Be concise and precise — 3-5 sentences max per answer
- When referencing a project, always include the company name and project title
- When referencing work experience, include company name, role, and period
- If a project has a badge (Winner, Finalist, 2nd Place), mention it
- If asked about something not in the data, say you don't have that information
- For the CND (Commissariat du Numerique de Defense), missions are classified — only share what is publicly available
- IMPORTANT: Distinguish between PROJECTS (Business Deep Dives, School Projects) and WORK EXPERIENCE (internships, jobs, leadership roles). They are NOT the same thing.
- CRITICAL: If the same company appears in both a project and an experience, never merge their details. Keep separate facts.
- If query is ambiguous for a shared company, answer with 2 explicit sections: "Work Experience" and "Project Case Study".
- Format your response as JSON with this structure:
  {
    "answer": "Your text answer here",
    "followUpQuestions": ["Follow-up question 1?", "Follow-up question 2?"],
    "relatedProjects": ["project-slug1", "project-slug2"],
    "relatedExperiences": ["experience-slug1"],
    "type": "project" | "experience" | "skill" | "general"
  }
- followUpQuestions: always include 2-3 short, natural follow-up questions in the same language as the answer. They should invite the visitor to explore further (e.g. "What tools did Jonathan use for this?", "Which projects involve machine learning?"). Keep them concise and genuinely useful.
- relatedProjects: use project slugs from the Business Deep Dives / School Projects sections
- relatedExperiences: use experience slugs: "${allExperienceSlugs}"
- Always include relevant related items. If the question is about experience, include relatedExperiences. If about projects, include relatedProjects. You can include both when relevant.

Portfolio data:
${portfolioContext}

${disambiguationContext ? `Disambiguation guardrails:\n${disambiguationContext}` : ""}`,
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
      timeoutMs: 25_000,
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
      .map((slug: string) => projects.find((p: Project) => p.slug === slug))
      .filter(Boolean)
      .map((p: Project) => ({
        slug: p.slug,
        title: p.title,
        company: p.company,
        tagline: p.tagline,
        badge: p.badge,
        tags: p.tags,
      }));

    const allExperienceItems: Record<
      string,
      {
        slug: string;
        role: string;
        company: string;
        period: string;
        tagline: string;
        category: string;
        hasPage: boolean;
      }
    > = {};

    // Clickable experiences (have detail pages)
    for (const e of experiences) {
      allExperienceItems[e.slug] = {
        slug: e.slug,
        role: e.role,
        company: e.company,
        period: e.period,
        tagline: e.tagline,
        category: e.type === "work" ? "Work Experience" : "Leadership",
        hasPage: true,
      };
    }

    for (const item of SUPPLEMENTAL_EXPERIENCE_ITEMS) {
      allExperienceItems[item.slug] = {
        ...item,
      };
    }

    // Enrich experience data
    const relatedExperienceData = (parsed.relatedExperiences || [])
      .map((slug: string) => allExperienceItems[slug])
      .filter(Boolean);

    return NextResponse.json({
      answer: parsed.answer,
      followUpQuestions: Array.isArray(parsed.followUpQuestions)
        ? parsed.followUpQuestions.slice(0, 3)
        : [],
      relatedProjects: relatedProjectData,
      relatedExperiences: relatedExperienceData,
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
