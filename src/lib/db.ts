import { Redis } from "@upstash/redis";
import { projects as staticProjects, allTags as staticAllTags } from "@/data/projects";
import { experiences as staticExperiences } from "@/data/experiences";
import type { Project } from "@/data/projects";
import type { Experience } from "@/data/experiences";

// ── Redis Client ────────────────────────────────────────────────
// Lazy-initialized so pages that don't need Redis still work (dev, build, etc.)
let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (
    !url ||
    !token ||
    url === "your_upstash_redis_url_here" ||
    token === "your_upstash_redis_token_here"
  ) {
    return null;
  }
  redis = new Redis({ url, token });
  return redis;
}

// ── Keys ────────────────────────────────────────────────────────
const KEYS = {
  projects: "portfolio:projects",
  experiences: "portfolio:experiences",
} as const;

function parseStoredArray<T>(input: unknown): T[] | null {
  if (Array.isArray(input)) return input as T[];
  if (typeof input !== "string") return null;
  try {
    const parsed = JSON.parse(input);
    return Array.isArray(parsed) ? (parsed as T[]) : null;
  } catch {
    return null;
  }
}

function normalizeStatus(
  status: unknown
): "draft" | "published" | undefined {
  if (status === "draft" || status === "published") return status;
  return undefined;
}

function normalizeProjects(items: Project[]) {
  return items.map((project) => ({
    ...project,
    status: normalizeStatus(project.status),
  }));
}

function normalizeExperiences(items: Experience[]) {
  return items.map((experience) => ({
    ...experience,
    status: normalizeStatus(experience.status),
  }));
}

// ── Read ────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  try {
    const client = getRedis();
    if (!client) return staticProjects;
    const raw = await client.get<unknown>(KEYS.projects);
    const parsed = parseStoredArray<Project>(raw);
    return parsed && parsed.length > 0 ? normalizeProjects(parsed) : staticProjects;
  } catch (error) {
    console.error("[db] Failed to read projects from Redis:", error);
    return staticProjects;
  }
}

export async function getExperiences(): Promise<Experience[]> {
  try {
    const client = getRedis();
    if (!client) return staticExperiences;
    const raw = await client.get<unknown>(KEYS.experiences);
    const parsed = parseStoredArray<Experience>(raw);
    return parsed && parsed.length > 0
      ? normalizeExperiences(parsed)
      : staticExperiences;
  } catch (error) {
    console.error("[db] Failed to read experiences from Redis:", error);
    return staticExperiences;
  }
}

export async function getPublishedProjects(): Promise<Project[]> {
  const all = await getProjects();
  return all.filter((project) => project.status !== "draft");
}

export async function getPublishedExperiences(): Promise<Experience[]> {
  const all = await getExperiences();
  return all.filter((experience) => experience.status !== "draft");
}

export async function getAllTags() {
  const projects = await getPublishedProjects();
  const dynamicTags = projects.flatMap((project) => project.tags || []);
  return Array.from(new Set([...staticAllTags, ...dynamicTags])).sort((a, b) =>
    a.localeCompare(b)
  );
}

// ── Write ───────────────────────────────────────────────────────

export async function setProjects(data: Project[]): Promise<void> {
  const client = getRedis();
  if (!client) throw new Error("Redis is not configured");
  await client.set(KEYS.projects, data);
}

export async function setExperiences(data: Experience[]): Promise<void> {
  const client = getRedis();
  if (!client) throw new Error("Redis is not configured");
  await client.set(KEYS.experiences, data);
}

// ── Seed ────────────────────────────────────────────────────────

export async function seedDatabase(): Promise<{
  mode: "merge" | "reset";
  projects: number;
  experiences: number;
  addedProjects: number;
  addedExperiences: number;
  preservedProjects: number;
  preservedExperiences: number;
}> {
  return seedDatabaseWithMode({ mode: "merge" });
}

export async function seedDatabaseWithMode(options?: {
  mode?: "merge" | "reset";
}): Promise<{
  mode: "merge" | "reset";
  projects: number;
  experiences: number;
  addedProjects: number;
  addedExperiences: number;
  preservedProjects: number;
  preservedExperiences: number;
}> {
  const client = getRedis();
  if (!client) throw new Error("Redis is not configured");
  const mode = options?.mode ?? "merge";

  if (mode === "reset") {
    await client.set(KEYS.projects, staticProjects);
    await client.set(KEYS.experiences, staticExperiences);
    return {
      mode,
      projects: staticProjects.length,
      experiences: staticExperiences.length,
      addedProjects: staticProjects.length,
      addedExperiences: staticExperiences.length,
      preservedProjects: 0,
      preservedExperiences: 0,
    };
  }

  const [rawProjects, rawExperiences] = await Promise.all([
    client.get<unknown>(KEYS.projects),
    client.get<unknown>(KEYS.experiences),
  ]);

  const existingProjects = parseStoredArray<Project>(rawProjects) ?? [];
  const existingExperiences = parseStoredArray<Experience>(rawExperiences) ?? [];

  const projectMap = new Map(existingProjects.map((project) => [project.slug, project]));
  for (const staticProject of staticProjects) {
    if (!projectMap.has(staticProject.slug)) {
      projectMap.set(staticProject.slug, staticProject);
    }
  }

  const experienceMap = new Map(
    existingExperiences.map((experience) => [experience.slug, experience])
  );
  for (const staticExperience of staticExperiences) {
    if (!experienceMap.has(staticExperience.slug)) {
      experienceMap.set(staticExperience.slug, staticExperience);
    }
  }

  const mergedProjects = Array.from(projectMap.values());
  const mergedExperiences = Array.from(experienceMap.values());
  await Promise.all([
    client.set(KEYS.projects, mergedProjects),
    client.set(KEYS.experiences, mergedExperiences),
  ]);

  return {
    mode,
    projects: mergedProjects.length,
    experiences: mergedExperiences.length,
    addedProjects: mergedProjects.length - existingProjects.length,
    addedExperiences: mergedExperiences.length - existingExperiences.length,
    preservedProjects: existingProjects.length,
    preservedExperiences: existingExperiences.length,
  };
}

// ── Helpers ─────────────────────────────────────────────────────

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const all = await getProjects();
  return all.find((p) => p.slug === slug);
}

export async function getExperienceBySlug(slug: string): Promise<Experience | undefined> {
  const all = await getExperiences();
  return all.find((e) => e.slug === slug);
}

export async function getPublishedProjectBySlug(
  slug: string
): Promise<Project | undefined> {
  const all = await getPublishedProjects();
  return all.find((project) => project.slug === slug);
}

export async function getPublishedExperienceBySlug(
  slug: string
): Promise<Experience | undefined> {
  const all = await getPublishedExperiences();
  return all.find((experience) => experience.slug === slug);
}

export async function addProject(project: Project): Promise<void> {
  const all = await getProjects();
  all.push(project);
  await setProjects(all);
}

export async function updateProject(slug: string, updates: Partial<Project>): Promise<Project | null> {
  const all = await getProjects();
  const idx = all.findIndex((p) => p.slug === slug);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString().split("T")[0] };
  await setProjects(all);
  return all[idx];
}

export async function deleteProject(slug: string): Promise<boolean> {
  const all = await getProjects();
  const filtered = all.filter((p) => p.slug !== slug);
  if (filtered.length === all.length) return false;
  await setProjects(filtered);
  return true;
}

export async function addExperience(experience: Experience): Promise<void> {
  const all = await getExperiences();
  all.push(experience);
  await setExperiences(all);
}

export async function updateExperience(slug: string, updates: Partial<Experience>): Promise<Experience | null> {
  const all = await getExperiences();
  const idx = all.findIndex((e) => e.slug === slug);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString().split("T")[0] };
  await setExperiences(all);
  return all[idx];
}

export async function deleteExperience(slug: string): Promise<boolean> {
  const all = await getExperiences();
  const filtered = all.filter((e) => e.slug !== slug);
  if (filtered.length === all.length) return false;
  await setExperiences(filtered);
  return true;
}
