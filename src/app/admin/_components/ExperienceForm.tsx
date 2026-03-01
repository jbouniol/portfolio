"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Loader2,
  Trash2,
  ArrowLeft,
  Plus,
  X,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import type { Experience } from "@/data/experiences";
import AIPrefillModal from "./AIPrefillModal";
import {
  formatDiffValue,
  toAdminSlug,
} from "./admin-form-utils";
import { AdminTextField, AiPolishTextArea } from "./AdminFormFields";
import { useAdminLocalDraft } from "./useAdminLocalDraft";

const STATUS_OPTIONS: Array<{ value: "draft" | "published"; label: string }> = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

const EXPERIENCE_DIFF_LABELS: Record<string, string> = {
  slug: "Slug",
  role: "Role",
  company: "Company",
  period: "Period",
  location: "Location",
  type: "Type",
  tagline: "Tagline",
  description: "Description",
  missions: "Missions",
  tools: "Tools",
  isConfidential: "Confidential",
  status: "Status",
};

interface Props {
  experience?: Experience;
  mode: "create" | "edit";
}

export default function ExperienceForm({ experience, mode }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [slug, setSlug] = useState(experience?.slug || "");
  const [role, setRole] = useState(experience?.role || "");
  const [company, setCompany] = useState(experience?.company || "");
  const [period, setPeriod] = useState(experience?.period || "");
  const [location, setLocation] = useState(experience?.location || "");
  const [type, setType] = useState<"work" | "leadership">(experience?.type || "work");
  const [tagline, setTagline] = useState(experience?.tagline || "");
  const [description, setDescription] = useState(experience?.description || "");
  const [missions, setMissions] = useState<string[]>(experience?.missions || [""]);
  const [tools, setTools] = useState<string[]>(experience?.tools || []);
  const [isConfidential, setIsConfidential] = useState(
    experience?.isConfidential || false
  );
  const [status, setStatus] = useState<"draft" | "published">(
    mode === "create" ? "draft" : experience?.status ?? "published"
  );
  const [newTool, setNewTool] = useState("");
  const [prefillOpen, setPrefillOpen] = useState(false);

  const draftStorageKey = useMemo(
    () => `admin:experience:draft:${mode}:${experience?.slug ?? "new"}`,
    [mode, experience?.slug]
  );

  const formSnapshot = useMemo(
    () => ({
      slug,
      role,
      company,
      period,
      location,
      type,
      tagline,
      description,
      missions,
      tools,
      isConfidential,
      status,
    }),
    [
      slug,
      role,
      company,
      period,
      location,
      type,
      tagline,
      description,
      missions,
      tools,
      isConfidential,
      status,
    ]
  );

  const initialSnapshot = useMemo(() => {
    if (mode !== "edit" || !experience) return null;
    return {
      slug: experience.slug ?? "",
      role: experience.role ?? "",
      company: experience.company ?? "",
      period: experience.period ?? "",
      location: experience.location ?? "",
      type: experience.type ?? "work",
      tagline: experience.tagline ?? "",
      description: experience.description ?? "",
      missions: experience.missions ?? [],
      tools: experience.tools ?? [],
      isConfidential: experience.isConfidential ?? false,
      status: experience.status ?? "published",
    };
  }, [experience, mode]);

  const changePreview = useMemo(() => {
    if (!initialSnapshot) return [];

    return Object.entries(formSnapshot)
      .filter(([key, value]) => {
        const before = initialSnapshot[key as keyof typeof initialSnapshot];
        return JSON.stringify(before) !== JSON.stringify(value);
      })
      .map(([key, value]) => ({
        key,
        label: EXPERIENCE_DIFF_LABELS[key] || key,
        before: formatDiffValue(
          initialSnapshot[key as keyof typeof initialSnapshot]
        ),
        after: formatDiffValue(value),
      }));
  }, [formSnapshot, initialSnapshot]);

  function updateMission(index: number, value: string) {
    const updated = [...missions];
    updated[index] = value;
    setMissions(updated);
  }

  function addMission() {
    setMissions([...missions, ""]);
  }

  function removeMission(index: number) {
    setMissions(missions.filter((_, i) => i !== index));
  }

  function addTool() {
    const trimmed = newTool.trim();
    if (trimmed && !tools.includes(trimmed)) {
      setTools([...tools, trimmed]);
      setNewTool("");
    }
  }

  const applyDraft = useCallback(
    (draft: Partial<Experience> & { status?: "draft" | "published" }) => {
      if (typeof draft.slug === "string") setSlug(draft.slug);
      if (typeof draft.role === "string") setRole(draft.role);
      if (typeof draft.company === "string") setCompany(draft.company);
      if (typeof draft.period === "string") setPeriod(draft.period);
      if (typeof draft.location === "string") setLocation(draft.location);
      if (draft.type === "work" || draft.type === "leadership") setType(draft.type);
      if (typeof draft.tagline === "string") setTagline(draft.tagline);
      if (typeof draft.description === "string") setDescription(draft.description);
      if (Array.isArray(draft.missions)) setMissions(draft.missions);
      if (Array.isArray(draft.tools)) setTools(draft.tools);
      if (typeof draft.isConfidential === "boolean") {
        setIsConfidential(draft.isConfidential);
      }
      if (draft.status === "draft" || draft.status === "published") {
        setStatus(draft.status);
      }
    },
    []
  );

  function applyAIPrefill(dataFromAI: Partial<Experience>) {
    if (dataFromAI.slug) setSlug(dataFromAI.slug);
    if (dataFromAI.role) setRole(dataFromAI.role);
    if (dataFromAI.company) setCompany(dataFromAI.company);
    if (dataFromAI.period) setPeriod(dataFromAI.period);
    if (dataFromAI.location) setLocation(dataFromAI.location);
    if (dataFromAI.type) setType(dataFromAI.type);
    if (dataFromAI.tagline) setTagline(dataFromAI.tagline);
    if (dataFromAI.description) setDescription(dataFromAI.description);
    if (dataFromAI.missions) setMissions(dataFromAI.missions);
    if (dataFromAI.tools) setTools(dataFromAI.tools);
    if (typeof dataFromAI.isConfidential === "boolean") {
      setIsConfidential(dataFromAI.isConfidential);
    }
    if (dataFromAI.status) setStatus(dataFromAI.status);
  }

  useEffect(() => {
    if (typeof window === "undefined" || mode !== "create") return;
    const typeInStorage = sessionStorage.getItem("ai-prefill-type");
    const raw = sessionStorage.getItem("ai-prefill-data");
    if (typeInStorage !== "experience" || !raw) return;

    try {
      const parsed = JSON.parse(raw) as Partial<Experience>;
      applyAIPrefill(parsed);
    } catch {
      // Ignore malformed AI payload
    } finally {
      sessionStorage.removeItem("ai-prefill-type");
      sessionStorage.removeItem("ai-prefill-data");
    }
  }, [mode]);

  const hasFormChanges = useMemo(() => {
    if (mode !== "edit" || !initialSnapshot) return true;
    return JSON.stringify(formSnapshot) !== JSON.stringify(initialSnapshot);
  }, [formSnapshot, initialSnapshot, mode]);
  const hasPendingAIPrefill =
    mode === "create" &&
    typeof window !== "undefined" &&
    sessionStorage.getItem("ai-prefill-type") === "experience";

  const { restoredDraft, lastSavedAt, clearLocalDraft } = useAdminLocalDraft({
    draftStorageKey,
    mode,
    updatedAt: experience?.updatedAt,
    hasPendingAIPrefill,
    formSnapshot,
    hasFormChanges,
    applyDraft,
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const body = {
      slug,
      role,
      company,
      period,
      location,
      type,
      tagline,
      description,
      missions: missions.filter((mission) => mission.trim()),
      tools: tools.length > 0 ? tools : undefined,
      isConfidential: isConfidential || undefined,
      status,
    };

    try {
      const url =
        mode === "create"
          ? "/api/admin/experiences"
          : `/api/admin/experiences/${experience!.slug}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        clearLocalDraft();
        router.push("/admin/experiences");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this experience? This cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/experiences/${experience!.slug}`, {
        method: "DELETE",
      });
      if (res.ok) {
        clearLocalDraft();
        router.push("/admin/experiences");
        router.refresh();
      } else {
        setError("Failed to delete");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/experiences"
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
          >
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "create"
              ? "New Experience"
              : `Edit: ${experience!.role} @ ${experience!.company}`}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {mode === "create" && (
            <button
              type="button"
              onClick={() => setPrefillOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-lg text-sm hover:bg-blue-600/30 transition-all"
            >
              <Sparkles size={14} />
              AI Pre-fill
            </button>
          )}
          {mode === "edit" && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 text-red-400 border border-red-500/30 rounded-lg text-sm hover:bg-red-500/10 transition-all"
            >
              <Trash2 size={14} />
              Delete
            </button>
          )}
        </div>
      </div>

      {(restoredDraft || lastSavedAt) && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-200 text-xs flex items-center justify-between gap-3">
          <span>
            {restoredDraft ? "Autosaved draft restored." : "Autosave enabled."}
            {lastSavedAt ? ` Last save: ${new Date(lastSavedAt).toLocaleString()}` : ""}
          </span>
          <button
            type="button"
            onClick={clearLocalDraft}
            className="inline-flex items-center gap-1 text-blue-300 hover:text-white transition-colors"
          >
            <RotateCcw size={12} />
            Clear local draft
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-mono text-zinc-400 mb-2">Basic Info</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminTextField
              label="Role *"
              value={role}
              onChange={(value) => {
                setRole(value);
                if (mode === "create" && !slug) setSlug(toAdminSlug(value));
              }}
            />
            <AdminTextField
              label="Company *"
              value={company}
              onChange={setCompany}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AdminTextField
              label="Slug *"
              value={slug}
              onChange={setSlug}
              mono
              disabled={mode === "edit"}
            />
            <AdminTextField
              label="Period"
              value={period}
              onChange={setPeriod}
              placeholder="e.g. Jul 2025 — Dec 2025"
            />
            <AdminTextField
              label="Location"
              value={location}
              onChange={setLocation}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "work" | "leadership")}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="work">Work Experience</option>
                <option value="leadership">Leadership</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer pb-2">
                <input
                  type="checkbox"
                  checked={isConfidential}
                  onChange={(e) => setIsConfidential(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-800"
                />
                Confidential (hide missions)
              </label>
            </div>
          </div>

          <AiPolishTextArea
            label="Tagline"
            value={tagline}
            onChange={setTagline}
            rows={2}
            enableAI
            aiContext="Experience tagline"
          />
          <AiPolishTextArea
            label="Description"
            value={description}
            onChange={setDescription}
            rows={4}
            enableAI
            aiContext="Experience description"
          />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-mono text-zinc-400 mb-3">Missions</h2>
          <div className="space-y-2">
            {missions.map((mission, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-xs text-zinc-600 mt-3 w-4 shrink-0 text-right">
                  {index + 1}.
                </span>
                <textarea
                  value={mission}
                  onChange={(e) => updateMission(index, e.target.value)}
                  rows={2}
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 resize-y"
                />
                {missions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMission(index)}
                    className="p-2 text-zinc-500 hover:text-red-400 self-start"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addMission}
            className="mt-3 flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all"
          >
            <Plus size={12} />
            Add Mission
          </button>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-mono text-zinc-400 mb-3">Tools & Stack</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {tools.map((tool, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-xs"
              >
                {tool}
                <button
                  type="button"
                  onClick={() => setTools(tools.filter((_, i) => i !== index))}
                  className="text-zinc-500 hover:text-red-400"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTool}
              onChange={(e) => setNewTool(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTool();
                }
              }}
              placeholder="Add tool"
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50"
            />
            <button
              type="button"
              onClick={addTool}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {mode === "edit" && changePreview.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-mono text-zinc-400 mb-3">
              Change Preview ({changePreview.length})
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {changePreview.map((change) => (
                <div
                  key={change.key}
                  className="text-xs border border-zinc-800 rounded-lg p-3 bg-zinc-950/40"
                >
                  <p className="text-zinc-300 mb-1">{change.label}</p>
                  <p className="text-zinc-500">Before: {change.before}</p>
                  <p className="text-zinc-300">After: {change.after}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 disabled:opacity-50 transition-all"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {mode === "create" ? "Create Experience" : "Save Changes"}
          </button>
        </div>
      </form>

      <AIPrefillModal
        type="experience"
        isOpen={prefillOpen}
        onClose={() => setPrefillOpen(false)}
        onApply={(dataFromAI) => applyAIPrefill(dataFromAI as Partial<Experience>)}
      />
    </div>
  );
}
