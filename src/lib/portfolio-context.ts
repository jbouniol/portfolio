import type { Project } from "@/data/projects";
import type { Experience } from "@/data/experiences";

/**
 * Builds a comprehensive text context from all portfolio data.
 * Shared between:
 * - /api/search (public AI search)
 * - /api/admin/chatbot (personal chatbot)
 */
export function buildPortfolioContext(
  projects: Project[],
  experiences: Experience[]
): string {
  const totalProjects = projects.length;
  const bddCount = projects.filter((p) => p.category === "bdd").length;
  const hackathonCount = projects.filter((p) => p.category === "hackathon").length;
  const consultingCount = projects.filter((p) => p.category === "consulting").length;
  const schoolCount = projects.filter((p) => p.category === "school").length;
  const winnerCount = projects.filter((p) => p.badge === "Winner").length;
  const podiumCount = projects.filter((p) => Boolean(p.badge)).length;

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
- ${totalProjects} projects total: ${bddCount} Business Deep Dives, ${hackathonCount} Hackathons, ${consultingCount} Consulting Missions, ${schoolCount} School Projects
- Companies: Louis Vuitton, CMA-CGM, BNP Paribas, Carrefour, SNCF, Henkel, Asmodee, Generali, Edmond de Rothschild, La French Tech, Linkpick, Ministere des Armees, Capgemini, X-HEC, Villablu (Robertet)
- ${winnerCount} Wins, ${podiumCount} Podiums (finalists, 2nd places, honorable mentions)
- 3 Work Experiences: Generali France (Data & IT Intern), Sunver (Right-Hand to CEO), CND (Reserviste)
- 1 Leadership Role: Albert Junior Consulting (VP & CTO — doubled revenue)
- Skills: Python, SQL, Scikit-learn, PyTorch, Qlik Sense, Power BI, Streamlit, Excel/VBA, Make, Zapier, Notion, Power Platform, GenAI, RAG Systems
- Email: jbouniol@albertschool.com
- Education: MSc Mines Paris PSL × Albert School (2025-2027), Bachelor Albert School × Mines Paris PSL (2023-2025), Baccalaureat Ecole Pascal (2020-2023)

## Work Experience & Leadership

${experienceChunks.join("\n\n")}

## Other Leadership
- Slug: student-representative | Student Representative at Albert School (Sep 2023 — Present): Student fairs across Paris, Marseille, Lyon, Geneva. Hosted workshop for 200 students in Luxembourg.
- Slug: capgemini-ambassador | Capgemini Ambassador (2024-2025): Representing Capgemini on campus at Albert School.

## Education
- Slug: msc-mines-paris | MSc Data & AI for Business at Mines Paris PSL × Albert School (2025-2027): Advanced joint diploma program combining data science, AI engineering, and business strategy at France's #2 engineering school.
- Slug: bachelor-albert-school | Bachelor Business & Data at Albert School × Mines Paris PSL (2023-2025): Europe's first data-centric business school. 12 Business Deep Dives. Joint diploma with Mines Paris PSL.
- Slug: baccalaureat-ecole-pascal | Baccalaureat High Honors at Ecole Pascal (2020-2023): Specialization in Mathematics and SES, with Maths Expertes option.

## Projects (Business Deep Dives & School Projects)

${projectChunks.join("\n\n")}`;
}
