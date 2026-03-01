import { NextRequest, NextResponse } from "next/server";
import { getProjects, getExperiences } from "@/lib/db";
import { buildPortfolioContext } from "@/lib/portfolio-context";
import type { Project } from "@/data/projects";
import type { Experience } from "@/data/experiences";

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
      getProjects(),
      getExperiences(),
    ]);

    const portfolioContext = buildPortfolioContext(projects, experiences);

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
- relatedExperiences: use experience slugs: "generali", "sunver", "cnd", "albert-junior-consulting", "notion-campus-leader", "student-representative", "capgemini-ambassador", "msc-mines-paris", "bachelor-albert-school", "baccalaureat-ecole-pascal"
- Always include relevant related items. If the question is about experience, include relatedExperiences. If about projects, include relatedProjects. You can include both when relevant.

Portfolio data:
${portfolioContext}`,
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

    // Static data for non-clickable experience/education items
    const allExperienceItems: Record<
      string,
      { slug: string; role: string; company: string; period: string; tagline: string; category: string; hasPage: boolean }
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

    // Non-clickable leadership
    allExperienceItems["student-representative"] = {
      slug: "student-representative",
      role: "Student Representative",
      company: "Albert School",
      period: "Sep 2023 — Present",
      tagline: "Student fairs across Paris, Marseille, Lyon, Geneva. Hosted a workshop for 200 students in Luxembourg.",
      category: "Leadership",
      hasPage: false,
    };
    allExperienceItems["capgemini-ambassador"] = {
      slug: "capgemini-ambassador",
      role: "Ambassador",
      company: "Capgemini",
      period: "2024 — 2025",
      tagline: "Representing Capgemini on campus at Albert School.",
      category: "Leadership",
      hasPage: false,
    };

    // Education
    allExperienceItems["msc-mines-paris"] = {
      slug: "msc-mines-paris",
      role: "MSc Data & AI for Business",
      company: "Mines Paris PSL × Albert School",
      period: "2025 — 2027",
      tagline: "Advanced joint diploma program combining data science, AI engineering, and business strategy at France's #2 engineering school.",
      category: "Education",
      hasPage: false,
    };
    allExperienceItems["bachelor-albert-school"] = {
      slug: "bachelor-albert-school",
      role: "Bachelor Business & Data",
      company: "Albert School × Mines Paris PSL",
      period: "2023 — 2025",
      tagline: "Europe's first data-centric business school. 12 Business Deep Dives. Joint diploma with Mines Paris PSL.",
      category: "Education",
      hasPage: false,
    };
    allExperienceItems["baccalaureat-ecole-pascal"] = {
      slug: "baccalaureat-ecole-pascal",
      role: "Baccalaureat — High Honors",
      company: "Ecole Pascal",
      period: "2020 — 2023",
      tagline: "Specialization in Mathematics and SES, with Maths Expertes option.",
      category: "Education",
      hasPage: false,
    };

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
