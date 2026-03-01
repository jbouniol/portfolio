import type { Project } from "@/data/projects";
import type { Experience } from "@/data/experiences";
import {
  PROFILE_BASICS,
  PROFILE_COMPANIES,
  PROFILE_SKILLS,
  SUPPLEMENTAL_EXPERIENCE_ITEMS,
} from "@/data/profile";

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

  const supplementalLeadership = SUPPLEMENTAL_EXPERIENCE_ITEMS.filter(
    (item) => item.category === "Leadership"
  );
  const supplementalEducation = SUPPLEMENTAL_EXPERIENCE_ITEMS.filter(
    (item) => item.category === "Education"
  );

  const projectChunks = projects.map((p) => {
    return `## [PROJECT] ${p.company} — ${p.title}
EntityType: project
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
    return `## [EXPERIENCE] ${e.company} — ${e.role}
EntityType: experience
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
- Companies: ${PROFILE_COMPANIES.join(", ")}
- ${winnerCount} Wins, ${podiumCount} Podiums (finalists, 2nd places, honorable mentions)
- 3 Work Experiences: Generali France (Data & IT Intern), Sunver (Right-Hand to CEO), CND (Reserviste)
- 1 Leadership Role: Albert Junior Consulting (VP & CTO — doubled revenue)
- Skills: ${PROFILE_SKILLS.join(", ")}
- Email: ${PROFILE_BASICS.email}
- Education: MSc Mines Paris PSL × Albert School (2025-2027), Bachelor Albert School × Mines Paris PSL (2023-2025), Baccalaureat Ecole Pascal (2020-2023)

## Work Experience & Leadership

${experienceChunks.join("\n\n")}

## Other Leadership
${supplementalLeadership
  .map(
    (item) =>
      `- Slug: ${item.slug} | ${item.role} at ${item.company} (${item.period}): ${item.tagline}`
  )
  .join("\n")}

## Education
${supplementalEducation
  .map(
    (item) =>
      `- Slug: ${item.slug} | ${item.role} at ${item.company} (${item.period}): ${item.tagline}`
  )
  .join("\n")}

## Projects (Business Deep Dives & School Projects)

${projectChunks.join("\n\n")}`;
}
