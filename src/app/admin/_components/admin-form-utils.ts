export function formatDiffValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value === undefined || value === null || value === "") return "—";
  return String(value);
}

export function isDraftNewerThanContent(savedAt?: string, updatedAt?: string) {
  if (!savedAt || !updatedAt) return true;
  const savedMs = Date.parse(savedAt);
  const updatedMs = Date.parse(`${updatedAt}T23:59:59.999Z`);
  if (Number.isNaN(savedMs) || Number.isNaN(updatedMs)) return true;
  return savedMs > updatedMs;
}

export function toAdminSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
