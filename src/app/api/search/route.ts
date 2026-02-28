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
    const missionsList = e.isConfidential
      ? "Classified — cannot be disclosed"
      : e.missions.map((m, i) => `  ${i + 1}. ${m}`).join("\n");
    return `## ${e.company} — ${e.role}
Slug: ${e.slug}
Type: ${e.type === "work" ? "Work Experience" : "Leadership"}
Period: ${e.period} | Location: ${e.location}
Tagline: ${e.tagline}
About the Role: ${e.description}
Key Missions:
${missionsList}${e.tools ? `\nTools & Stack: ${e.tools.join(", ")}` : ""}${e.isConfidential ? "\nNote: This is a classified military position. Missions cannot be publicly disclosed." : ""}`;
  });

  return `# Jonathan Bouniol — Portfolio Data

## Profile
- Student at Albert School × Mines Paris PSL (MSc Data & AI for Business)
- 19 projects total: 12 Business Deep Dives, 2 Hackathons, 2 Consulting Missions, 3 School Projects
- Companies: Louis Vuitton, CMA-CGM, BNP Paribas, Carrefour, SNCF, Henkel, Asmodee, Generali, Edmond de Rothschild, La French Tech, Linkpick, Ministere des Armees, Capgemini, X-HEC, Villablu (Robertet)
- 4 Wins, 12 Podiums (finalists, 2nd places, honorable mentions)
- 3 Work Experiences: Generali France (Data & IT Intern), Sunver (Right-Hand to CEO), CND (Reserviste)
- 1 Leadership Role: Albert Junior Consulting (VP & CTO — doubled revenue)
- Skills: Python, SQL, Scikit-learn, PyTorch, Qlik Sense, Power BI, Streamlit, Excel/VBA, Make, Zapier, Notion, Power Platform, GenAI, RAG Systems
- Email: jbouniol@albertschool.com
- Education: MSc Mines Paris PSL × Albert School (2025-2027), Bachelor Albert School × Mines Paris PSL (2023-2025), Baccalaureat Ecole Pascal (2020-2023)

## Work Experience & Leadership

${experienceChunks.join("\n\n")}

## Other Leadership
- Slug: notion-campus-leader | Notion Campus Leader (Sep 2025 — Present): Selected for Notion's international program. Developing the Notion community at Albert School.
- Slug: student-representative | Student Representative at Albert School (Sep 2023 — Present): Student fairs across Paris, Marseille, Lyon, Geneva. Hosted workshop for 200 students in Luxembourg.
- Slug: capgemini-ambassador | Capgemini Ambassador (2024-2025): Representing Capgemini on campus at Albert School.

## Education
- Slug: msc-mines-paris | MSc Data & AI for Business at Mines Paris PSL × Albert School (2025-2027): Advanced joint diploma program combining data science, AI engineering, and business strategy at France's #2 engineering school.
- Slug: bachelor-albert-school | Bachelor Business & Data at Albert School × Mines Paris PSL (2023-2025): Europe's first data-centric business school. 12 Business Deep Dives. Joint diploma with Mines Paris PSL.
- Slug: baccalaureat-ecole-pascal | Baccalaureat High Honors at Ecole Pascal (2020-2023): Specialization in Mathematics and SES, with Maths Expertes option.

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
    "relatedProjects": ["project-slug1", "project-slug2"],
    "relatedExperiences": ["experience-slug1"],
    "type": "project" | "experience" | "skill" | "general"
  }
- relatedProjects: use project slugs from the Business Deep Dives / School Projects sections
- relatedExperiences: use experience slugs: "generali", "sunver", "cnd", "albert-junior-consulting", "notion-campus-leader", "student-representative", "capgemini-ambassador", "msc-mines-paris", "bachelor-albert-school", "baccalaureat-ecole-pascal"
- Always include relevant related items. If the question is about experience, include relatedExperiences. If about projects, include relatedProjects. You can include both when relevant.

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
    allExperienceItems["notion-campus-leader"] = {
      slug: "notion-campus-leader",
      role: "Campus Leader",
      company: "Notion",
      period: "Sep 2025 — Present",
      tagline: "Selected for Notion's international Campus Leader program. Developing the Notion community at Albert School.",
      category: "Leadership",
      hasPage: false,
    };
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
