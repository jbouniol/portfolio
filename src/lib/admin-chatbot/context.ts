import type { Project } from "@/data/projects";
import type { Experience } from "@/data/experiences";
import type { ChatTurn } from "@/lib/ai";

export function sanitizeTurns(input: unknown): ChatTurn[] | null {
  if (!Array.isArray(input)) return null;

  const turns = input
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const turn = item as { role?: unknown; content?: unknown };
      if (
        (turn.role !== "user" && turn.role !== "assistant") ||
        typeof turn.content !== "string"
      ) {
        return null;
      }

      const content = turn.content.trim();
      if (!content) return null;
      return { role: turn.role, content };
    })
    .filter((turn): turn is ChatTurn => turn !== null);

  if (turns.length === 0) return null;
  return turns.slice(-16);
}

export function resolveResponseStyle(value: unknown): "concise" | "deep" {
  if (value === "deep") return "deep";
  return "concise";
}

export function extractMentionSlugs(text: string): string[] {
  const found = new Set<string>();
  const regex = /(^|\s)@([a-z0-9][a-z0-9-]{1,80})/gi;
  let match: RegExpExecArray | null = regex.exec(text);

  while (match) {
    found.add(match[2].toLowerCase());
    match = regex.exec(text);
  }

  return Array.from(found);
}

export function stripMentions(text: string): string {
  return text
    .replace(/(^|\s)@([a-z0-9][a-z0-9-]{1,80})/gi, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function clip(text: string | undefined, max = 220) {
  if (!text) return "";
  const compact = text.replace(/\s+/g, " ").trim();
  if (compact.length <= max) return compact;
  return `${compact.slice(0, max)}…`;
}

export function buildTargetedContext(
  mentionedSlugs: string[],
  projects: Project[],
  experiences: Experience[]
) {
  if (mentionedSlugs.length === 0) return "";

  const projectMap = new Map(
    projects.map((project) => [project.slug.toLowerCase(), project])
  );
  const experienceMap = new Map(
    experiences.map((experience) => [experience.slug.toLowerCase(), experience])
  );

  const projectLines: string[] = [];
  const experienceLines: string[] = [];
  const unknown: string[] = [];

  for (const slug of mentionedSlugs) {
    const project = projectMap.get(slug);
    if (project) {
      projectLines.push(
        `- [PROJECT] @${project.slug} — ${project.title} | ${project.company} | ${clip(
          project.tagline
        )} | Category: ${project.category} | Duration: ${project.duration} | Result: ${clip(
          project.result,
          180
        )} | Impact: ${clip(project.impact, 180)}`
      );
      continue;
    }

    const experience = experienceMap.get(slug);
    if (experience) {
      experienceLines.push(
        `- [EXPERIENCE] @${experience.slug} — ${experience.role} @ ${
          experience.company
        } | Period: ${experience.period} | ${clip(experience.tagline)} | Key missions: ${clip(
          experience.missions?.slice(0, 2).join(" / "),
          190
        )}`
      );
      continue;
    }

    unknown.push(`@${slug}`);
  }

  const sections: string[] = [];
  if (projectLines.length > 0) {
    sections.push("Projets mentionnés explicitement:\n" + projectLines.join("\n"));
  }
  if (experienceLines.length > 0) {
    sections.push(
      "Expériences mentionnées explicitement:\n" + experienceLines.join("\n")
    );
  }
  if (unknown.length > 0) {
    sections.push(`Mentions sans correspondance exacte: ${unknown.join(", ")}`);
  }

  return sections.join("\n\n");
}

interface IndexedProjectDoc {
  project: Project;
  searchable: string;
  termWeights: Map<string, number>;
}

interface IndexedExperienceDoc {
  experience: Experience;
  searchable: string;
  termWeights: Map<string, number>;
}

interface SemanticIndex {
  stamp: string;
  createdAt: number;
  projectDocs: IndexedProjectDoc[];
  experienceDocs: IndexedExperienceDoc[];
  projectInverted: Map<string, number[]>;
  experienceInverted: Map<string, number[]>;
}

let semanticIndexCache: SemanticIndex | null = null;

function tokenize(text: string, minLen = 2) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .map((token) => token.trim())
    .filter((token) => token.length >= minLen);
}

function getQueryTokens(text: string) {
  return Array.from(new Set(tokenize(text, 3))).slice(0, 20);
}

function buildWeightedTerms(parts: Array<{ text: string; weight: number }>) {
  const weights = new Map<string, number>();
  for (const part of parts) {
    const tokens = tokenize(part.text, 2);
    for (const token of tokens) {
      weights.set(token, (weights.get(token) ?? 0) + part.weight);
    }
  }
  return weights;
}

function addPosting(inverted: Map<string, number[]>, token: string, id: number) {
  const existing = inverted.get(token);
  if (existing) {
    existing.push(id);
    return;
  }
  inverted.set(token, [id]);
}

function buildIndexStamp(projects: Project[], experiences: Experience[]) {
  const projectStamp = projects
    .map((project) => `${project.slug}:${project.updatedAt}:${project.title.length}`)
    .join("|");
  const experienceStamp = experiences
    .map(
      (experience) =>
        `${experience.slug}:${experience.updatedAt}:${experience.role.length}`
    )
    .join("|");
  return `${projects.length}#${experiences.length}#${projectStamp}#${experienceStamp}`;
}

function buildSemanticIndex(projects: Project[], experiences: Experience[]): SemanticIndex {
  const projectInverted = new Map<string, number[]>();
  const experienceInverted = new Map<string, number[]>();

  const projectDocs: IndexedProjectDoc[] = projects.map((project, index) => {
    const searchable = [
      project.slug,
      project.title,
      project.company,
      project.tagline,
      project.result,
      project.impact,
      project.tags.join(" "),
    ]
      .join(" ")
      .toLowerCase();
    const termWeights = buildWeightedTerms([
      { text: project.slug, weight: 3.2 },
      { text: project.title, weight: 3.6 },
      { text: project.company, weight: 2.6 },
      { text: project.tagline, weight: 2.2 },
      { text: project.tags.join(" "), weight: 2.3 },
      { text: project.result, weight: 1.4 },
      { text: project.impact, weight: 1.2 },
    ]);

    for (const token of termWeights.keys()) {
      addPosting(projectInverted, token, index);
    }

    return { project, searchable, termWeights };
  });

  const experienceDocs: IndexedExperienceDoc[] = experiences.map(
    (experience, index) => {
      const searchable = [
        experience.slug,
        experience.role,
        experience.company,
        experience.tagline,
        experience.description,
        experience.missions.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      const termWeights = buildWeightedTerms([
        { text: experience.slug, weight: 3.1 },
        { text: experience.role, weight: 3.7 },
        { text: experience.company, weight: 2.8 },
        { text: experience.tagline, weight: 2 },
        { text: experience.description, weight: 1.2 },
        { text: experience.missions.join(" "), weight: 1.3 },
      ]);

      for (const token of termWeights.keys()) {
        addPosting(experienceInverted, token, index);
      }

      return { experience, searchable, termWeights };
    }
  );

  return {
    stamp: buildIndexStamp(projects, experiences),
    createdAt: Date.now(),
    projectDocs,
    experienceDocs,
    projectInverted,
    experienceInverted,
  };
}

function getSemanticIndex(projects: Project[], experiences: Experience[]) {
  const stamp = buildIndexStamp(projects, experiences);
  if (semanticIndexCache && semanticIndexCache.stamp === stamp) {
    return semanticIndexCache;
  }

  const nextIndex = buildSemanticIndex(projects, experiences);
  semanticIndexCache = nextIndex;
  return nextIndex;
}

function rankProjectDocs({
  index,
  tokens,
  exclude,
  limit,
}: {
  index: SemanticIndex;
  tokens: string[];
  exclude: Set<string>;
  limit: number;
}) {
  const docs = index.projectDocs;
  if (tokens.length === 0) {
    return [...docs]
      .filter((doc) => !exclude.has(doc.project.slug.toLowerCase()))
      .sort((a, b) => b.project.updatedAt.localeCompare(a.project.updatedAt))
      .slice(0, limit)
      .map((doc) => doc.project);
  }

  const candidateIds = new Set<number>();
  for (const token of tokens) {
    for (const id of index.projectInverted.get(token) ?? []) {
      candidateIds.add(id);
    }
  }

  if (candidateIds.size === 0) {
    for (let id = 0; id < docs.length; id++) {
      candidateIds.add(id);
    }
  }

  const scored: Array<{ project: Project; score: number }> = [];
  for (const id of candidateIds) {
    const doc = docs[id];
    if (!doc || exclude.has(doc.project.slug.toLowerCase())) continue;

    let score = 0;
    let matchedCount = 0;
    for (const token of tokens) {
      const weight = doc.termWeights.get(token);
      if (!weight) continue;
      matchedCount += 1;
      score += weight * (token.length >= 7 ? 1.35 : 1.1);
    }

    if (matchedCount === 0) continue;

    const queryPhrase = tokens.join(" ");
    if (queryPhrase.length > 5 && doc.searchable.includes(queryPhrase)) {
      score += 4.2;
    }
    score += (matchedCount / tokens.length) * 2.1;

    scored.push({ project: doc.project, score });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.project);
}

function rankExperienceDocs({
  index,
  tokens,
  exclude,
  limit,
}: {
  index: SemanticIndex;
  tokens: string[];
  exclude: Set<string>;
  limit: number;
}) {
  const docs = index.experienceDocs;
  if (tokens.length === 0) {
    return [...docs]
      .filter((doc) => !exclude.has(doc.experience.slug.toLowerCase()))
      .sort((a, b) => b.experience.updatedAt.localeCompare(a.experience.updatedAt))
      .slice(0, limit)
      .map((doc) => doc.experience);
  }

  const candidateIds = new Set<number>();
  for (const token of tokens) {
    for (const id of index.experienceInverted.get(token) ?? []) {
      candidateIds.add(id);
    }
  }

  if (candidateIds.size === 0) {
    for (let id = 0; id < docs.length; id++) {
      candidateIds.add(id);
    }
  }

  const scored: Array<{ experience: Experience; score: number }> = [];
  for (const id of candidateIds) {
    const doc = docs[id];
    if (!doc || exclude.has(doc.experience.slug.toLowerCase())) continue;

    let score = 0;
    let matchedCount = 0;
    for (const token of tokens) {
      const weight = doc.termWeights.get(token);
      if (!weight) continue;
      matchedCount += 1;
      score += weight * (token.length >= 7 ? 1.35 : 1.1);
    }

    if (matchedCount === 0) continue;

    const queryPhrase = tokens.join(" ");
    if (queryPhrase.length > 5 && doc.searchable.includes(queryPhrase)) {
      score += 4;
    }
    score += (matchedCount / tokens.length) * 2;

    scored.push({ experience: doc.experience, score });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.experience);
}

function summarizeProjects(projects: Project[]) {
  if (projects.length === 0) return "";
  return projects
    .map(
      (project) =>
        `- [PROJECT] @${project.slug} — ${project.title} | ${project.company} | Category: ${
          project.category
        } | Duration: ${project.duration} | ${clip(
          project.tagline
        )} | Impact: ${clip(project.impact, 170)}`
    )
    .join("\n");
}

function summarizeExperiences(experiences: Experience[]) {
  if (experiences.length === 0) return "";
  return experiences
    .map(
      (experience) =>
        `- [EXPERIENCE] @${experience.slug} — ${experience.role} @ ${
          experience.company
        } | Period: ${experience.period} | ${clip(
          experience.tagline
        )} | Key missions: ${clip(
          experience.missions?.slice(0, 2).join(" / "),
          170
        )}`
    )
    .join("\n");
}

export function buildCompactContext({
  latestUserQuery,
  projects,
  experiences,
  mentionedSlugs,
  targetedContext,
}: {
  latestUserQuery: string;
  projects: Project[];
  experiences: Experience[];
  mentionedSlugs: string[];
  targetedContext: string;
}) {
  const index = getSemanticIndex(projects, experiences);
  const tokens = getQueryTokens(latestUserQuery);
  const mentionedSet = new Set(mentionedSlugs.map((slug) => slug.toLowerCase()));

  const relevantProjects = rankProjectDocs({
    index,
    tokens,
    exclude: mentionedSet,
    limit: mentionedSlugs.length > 0 ? 3 : 6,
  });
  const relevantExperiences = rankExperienceDocs({
    index,
    tokens,
    exclude: mentionedSet,
    limit: mentionedSlugs.length > 0 ? 2 : 4,
  });

  const sections: string[] = [];
  sections.push(
    `Vue rapide portfolio: ${projects.length} projects, ${experiences.length} experiences.`
  );

  if (targetedContext) {
    sections.push(`Contexte ciblé @mentions:\n${targetedContext}`);
  }
  if (relevantProjects.length > 0) {
    sections.push(
      `Projets les plus pertinents pour la question:\n${summarizeProjects(relevantProjects)}`
    );
  }
  if (relevantExperiences.length > 0) {
    sections.push(
      `Expériences les plus pertinentes pour la question:\n${summarizeExperiences(
        relevantExperiences
      )}`
    );
  }

  return sections.join("\n\n");
}
