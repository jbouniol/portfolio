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

// ── Read ────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  try {
    const client = getRedis();
    if (!client) return staticProjects;
    const data = await client.get<Project[]>(KEYS.projects);
    return data && data.length > 0 ? data : staticProjects;
  } catch (error) {
    console.error("[db] Failed to read projects from Redis:", error);
    return staticProjects;
  }
}

export async function getExperiences(): Promise<Experience[]> {
  try {
    const client = getRedis();
    if (!client) return staticExperiences;
    const data = await client.get<Experience[]>(KEYS.experiences);
    return data && data.length > 0 ? data : staticExperiences;
  } catch (error) {
    console.error("[db] Failed to read experiences from Redis:", error);
    return staticExperiences;
  }
}

export function getAllTags() {
  return staticAllTags;
}

// ── Write ───────────────────────────────────────────────────────

export async function setProjects(data: Project[]): Promise<void> {
  const client = getRedis();
  if (!client) throw new Error("Redis is not configured");
  await client.set(KEYS.projects, JSON.stringify(data));
}

export async function setExperiences(data: Experience[]): Promise<void> {
  const client = getRedis();
  if (!client) throw new Error("Redis is not configured");
  await client.set(KEYS.experiences, JSON.stringify(data));
}

// ── Seed ────────────────────────────────────────────────────────

export async function seedDatabase(): Promise<{
  projects: number;
  experiences: number;
}> {
  const client = getRedis();
  if (!client) throw new Error("Redis is not configured");
  await client.set(KEYS.projects, JSON.stringify(staticProjects));
  await client.set(KEYS.experiences, JSON.stringify(staticExperiences));
  return {
    projects: staticProjects.length,
    experiences: staticExperiences.length,
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
