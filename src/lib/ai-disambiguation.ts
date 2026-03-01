import type { Experience } from "@/data/experiences";
import type { Project } from "@/data/projects";

const COMPANY_STOPWORDS = new Set([
  "france",
  "group",
  "groupe",
  "sa",
  "sas",
  "inc",
  "ltd",
  "corp",
  "company",
]);

function normalizeCompany(company: string) {
  const tokens = company
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0 && !COMPANY_STOPWORDS.has(token));

  return tokens.join(" ").trim();
}

function includesQueryHint(query: string, values: string[]) {
  const normalizedQuery = query.toLowerCase();
  return values.some((value) => value && normalizedQuery.includes(value.toLowerCase()));
}

interface CompanyCollision {
  key: string;
  projects: Project[];
  experiences: Experience[];
}

function detectCompanyCollisions(
  projects: Project[],
  experiences: Experience[]
): CompanyCollision[] {
  const map = new Map<
    string,
    { projects: Project[]; experiences: Experience[]; labels: Set<string> }
  >();

  for (const project of projects) {
    const key = normalizeCompany(project.company);
    if (!key) continue;
    const entry = map.get(key) ?? {
      projects: [],
      experiences: [],
      labels: new Set<string>(),
    };
    entry.projects.push(project);
    entry.labels.add(project.company);
    map.set(key, entry);
  }

  for (const experience of experiences) {
    const key = normalizeCompany(experience.company);
    if (!key) continue;
    const entry = map.get(key) ?? {
      projects: [],
      experiences: [],
      labels: new Set<string>(),
    };
    entry.experiences.push(experience);
    entry.labels.add(experience.company);
    map.set(key, entry);
  }

  const collisions: CompanyCollision[] = [];
  for (const [key, value] of map.entries()) {
    if (value.projects.length === 0 || value.experiences.length === 0) continue;
    collisions.push({
      key,
      projects: value.projects,
      experiences: value.experiences,
    });
  }

  return collisions;
}

export function buildDisambiguationContext({
  query,
  projects,
  experiences,
  maxCompanies = 3,
}: {
  query: string;
  projects: Project[];
  experiences: Experience[];
  maxCompanies?: number;
}) {
  const collisions = detectCompanyCollisions(projects, experiences);
  if (collisions.length === 0) return "";

  const prioritized = [...collisions]
    .map((collision) => {
      const labels = [
        ...collision.projects.map((item) => item.company),
        ...collision.experiences.map((item) => item.company),
      ];
      const score =
        query && includesQueryHint(query, [collision.key, ...labels]) ? 10 : 0;

      return {
        ...collision,
        score,
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.projects.length + b.experiences.length - (a.projects.length + a.experiences.length);
    })
    .slice(0, maxCompanies);

  return prioritized
    .map((collision) => {
      const experienceLines = collision.experiences
        .slice(0, 3)
        .map(
          (item) =>
            `  - [EXPERIENCE] @${item.slug}: ${item.role} at ${item.company} (${item.period})`
        )
        .join("\n");
      const projectLines = collision.projects
        .slice(0, 3)
        .map(
          (item) =>
            `  - [PROJECT] @${item.slug}: ${item.title} at ${item.company} (${item.category}, ${item.duration})`
        )
        .join("\n");

      return `Company overlap "${collision.key}":
${experienceLines}
${projectLines}
  - Rule: never mix project outcomes with experience responsibilities for this company.`;
    })
    .join("\n\n");
}
