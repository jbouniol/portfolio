import type { Experience } from "@/data/experiences";
import type { Project, ProjectCategory } from "@/data/projects";

type ValidationResult<T> = { ok: true; data: T } | { ok: false; error: string };

const PROJECT_CATEGORIES = new Set<ProjectCategory>([
  "bdd",
  "hackathon",
  "consulting",
  "school",
]);

const EXPERIENCE_TYPES = new Set<Experience["type"]>(["work", "leadership"]);
const CONTENT_STATUSES = new Set(["draft", "published"]);

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeString(value: unknown, maxLength = 5000): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.slice(0, maxLength);
}

function sanitizeOptionalString(value: unknown, maxLength = 5000) {
  if (value === undefined || value === null) return undefined;
  const sanitized = sanitizeString(value, maxLength);
  return sanitized ?? undefined;
}

function sanitizeSlug(value: unknown): string | null {
  const candidate = sanitizeString(value, 120);
  if (!candidate) return null;

  const normalized = candidate
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  if (!normalized || !/^[a-z0-9-]+$/.test(normalized)) return null;
  return normalized;
}

function sanitizeStringArray(value: unknown, maxItems: number, maxItemLength = 200) {
  if (!Array.isArray(value)) return undefined;

  const cleaned = value
    .map((item) => sanitizeString(item, maxItemLength))
    .filter((item): item is string => typeof item === "string" && item.length > 0);

  return cleaned.length > 0 ? Array.from(new Set(cleaned)).slice(0, maxItems) : [];
}

function sanitizeBoolean(value: unknown): boolean | undefined {
  if (typeof value !== "boolean") return undefined;
  return value;
}

function sanitizeStatus(value: unknown): "draft" | "published" | undefined {
  if (typeof value !== "string") return undefined;
  if (CONTENT_STATUSES.has(value)) return value as "draft" | "published";
  return undefined;
}

export function validateProjectPayload(
  payload: unknown,
  mode: "create" | "update"
): ValidationResult<Partial<Project>> {
  if (!isObject(payload)) {
    return { ok: false, error: "Invalid payload" };
  }

  const data: Partial<Project> = {};

  if (mode === "create" || "slug" in payload) {
    const slug = sanitizeSlug(payload.slug);
    if (!slug) {
      return { ok: false, error: "Invalid slug" };
    }
    data.slug = slug;
  }

  if (mode === "create" || "title" in payload) {
    const title = sanitizeString(payload.title, 200);
    if (!title) return { ok: false, error: "Title is required" };
    data.title = title;
  }

  if (mode === "create" || "company" in payload) {
    const company = sanitizeString(payload.company, 200);
    if (!company) return { ok: false, error: "Company is required" };
    data.company = company;
  }

  if (mode === "create" || "category" in payload) {
    const category = payload.category;
    if (typeof category !== "string" || !PROJECT_CATEGORIES.has(category as ProjectCategory)) {
      return { ok: false, error: "Invalid category" };
    }
    data.category = category as ProjectCategory;
  }

  if ("tags" in payload) {
    if (!Array.isArray(payload.tags)) {
      return { ok: false, error: "Tags must be an array" };
    }
    const tags = sanitizeStringArray(payload.tags, 25, 40);
    data.tags = tags ?? [];
  }

  if ("tagline" in payload) data.tagline = sanitizeOptionalString(payload.tagline, 400);
  if ("context" in payload) data.context = sanitizeOptionalString(payload.context, 4000);
  if ("problem" in payload) data.problem = sanitizeOptionalString(payload.problem, 4000);
  if ("data" in payload) data.data = sanitizeOptionalString(payload.data, 4000);
  if ("method" in payload) data.method = sanitizeOptionalString(payload.method, 4000);
  if ("result" in payload) data.result = sanitizeOptionalString(payload.result, 4000);
  if ("impact" in payload) data.impact = sanitizeOptionalString(payload.impact, 4000);
  if ("year" in payload) data.year = sanitizeOptionalString(payload.year, 80);
  if ("duration" in payload) data.duration = sanitizeOptionalString(payload.duration, 120);
  if ("badge" in payload) data.badge = sanitizeOptionalString(payload.badge, 80);
  if ("canvaEmbedUrl" in payload) data.canvaEmbedUrl = sanitizeOptionalString(payload.canvaEmbedUrl, 500);
  if ("githubUrl" in payload) data.githubUrl = sanitizeOptionalString(payload.githubUrl, 500);

  if ("isPrivate" in payload) data.isPrivate = sanitizeBoolean(payload.isPrivate);
  if ("isNDA" in payload) data.isNDA = sanitizeBoolean(payload.isNDA);

  if ("contributors" in payload) {
    const contributors = sanitizeStringArray(payload.contributors, 10, 80);
    if (contributors) {
      data.contributors = contributors;
    }
  }

  if ("status" in payload) {
    const status = sanitizeStatus(payload.status);
    if (!status) {
      return { ok: false, error: "Invalid status" };
    }
    data.status = status;
  } else if (mode === "create") {
    data.status = "draft";
  }

  return { ok: true, data };
}

export function validateExperiencePayload(
  payload: unknown,
  mode: "create" | "update"
): ValidationResult<Partial<Experience>> {
  if (!isObject(payload)) {
    return { ok: false, error: "Invalid payload" };
  }

  const data: Partial<Experience> = {};

  if (mode === "create" || "slug" in payload) {
    const slug = sanitizeSlug(payload.slug);
    if (!slug) return { ok: false, error: "Invalid slug" };
    data.slug = slug;
  }

  if (mode === "create" || "role" in payload) {
    const role = sanitizeString(payload.role, 200);
    if (!role) return { ok: false, error: "Role is required" };
    data.role = role;
  }

  if (mode === "create" || "company" in payload) {
    const company = sanitizeString(payload.company, 200);
    if (!company) return { ok: false, error: "Company is required" };
    data.company = company;
  }

  if (mode === "create" || "type" in payload) {
    const type = payload.type;
    if (typeof type !== "string" || !EXPERIENCE_TYPES.has(type as Experience["type"])) {
      return { ok: false, error: "Invalid type" };
    }
    data.type = type as Experience["type"];
  }

  if ("period" in payload) data.period = sanitizeOptionalString(payload.period, 120);
  if ("location" in payload) data.location = sanitizeOptionalString(payload.location, 120);
  if ("tagline" in payload) data.tagline = sanitizeOptionalString(payload.tagline, 400);
  if ("description" in payload) data.description = sanitizeOptionalString(payload.description, 4000);
  if ("isConfidential" in payload) data.isConfidential = sanitizeBoolean(payload.isConfidential);

  if ("missions" in payload) {
    const missions = sanitizeStringArray(payload.missions, 20, 300);
    if (missions) {
      data.missions = missions;
    }
  }

  if ("tools" in payload) {
    const tools = sanitizeStringArray(payload.tools, 25, 80);
    if (tools) {
      data.tools = tools;
    }
  }

  if ("status" in payload) {
    const status = sanitizeStatus(payload.status);
    if (!status) {
      return { ok: false, error: "Invalid status" };
    }
    data.status = status;
  } else if (mode === "create") {
    data.status = "draft";
  }

  return { ok: true, data };
}
