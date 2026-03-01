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
import {
  DEFAULT_PROJECT_TAGS,
  type Project,
  type ProjectCategory,
} from "@/data/projects";
import AIPrefillModal from "./AIPrefillModal";
import {
  formatDiffValue,
  toAdminSlug,
} from "./admin-form-utils";
import { AdminTextField, AiPolishTextArea } from "./AdminFormFields";
import { useAdminLocalDraft } from "./useAdminLocalDraft";

const ALL_TAGS = DEFAULT_PROJECT_TAGS;

const CATEGORIES: { value: ProjectCategory; label: string }[] = [
  { value: "bdd", label: "Business Deep Dive" },
  { value: "hackathon", label: "Hackathon" },
  { value: "consulting", label: "Consulting Mission" },
  { value: "school", label: "School Project" },
];

const BADGES = ["", "Winner", "Finalist", "2nd Place", "Honorable Mention"];
const STATUSES: Array<{ value: "draft" | "published"; label: string }> = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

interface Props {
  project?: Project;
  mode: "create" | "edit";
}

const PROJECT_DIFF_LABELS: Record<string, string> = {
  slug: "Slug",
  title: "Title",
  company: "Company",
  tagline: "Tagline",
  tags: "Tags",
  context: "Context",
  problem: "Problem",
  data: "Data",
  method: "Method",
  result: "Result",
  impact: "Impact",
  year: "Year",
  duration: "Duration",
  category: "Category",
  badge: "Badge",
  canvaEmbedUrl: "Canva URL",
  githubUrl: "GitHub URL",
  isPrivate: "Private",
  isNDA: "NDA",
  contributors: "Contributors",
  status: "Status",
};

export default function ProjectForm({ project, mode }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"draft" | "published">(
    mode === "create" ? "draft" : project?.status ?? "published"
  );

  // Form state
  const [slug, setSlug] = useState(project?.slug || "");
  const [title, setTitle] = useState(project?.title || "");
  const [company, setCompany] = useState(project?.company || "");
  const [tagline, setTagline] = useState(project?.tagline || "");
  const [tags, setTags] = useState<string[]>(project?.tags || []);
  const [context, setContext] = useState(project?.context || "");
  const [problem, setProblem] = useState(project?.problem || "");
  const [data, setData] = useState(project?.data || "");
  const [method, setMethod] = useState(project?.method || "");
  const [result, setResult] = useState(project?.result || "");
  const [impact, setImpact] = useState(project?.impact || "");
  const [year, setYear] = useState(project?.year || "");
  const [duration, setDuration] = useState(project?.duration || "");
  const [category, setCategory] = useState<ProjectCategory>(
    project?.category || "bdd"
  );
  const [badge, setBadge] = useState(project?.badge || "");
  const [canvaEmbedUrl, setCanvaEmbedUrl] = useState(project?.canvaEmbedUrl || "");
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl || "");
  const [isPrivate, setIsPrivate] = useState(project?.isPrivate || false);
  const [isNDA, setIsNDA] = useState(project?.isNDA || false);
  const [contributors, setContributors] = useState<string[]>(
    project?.contributors || []
  );
  const [newTag, setNewTag] = useState("");
  const [newContributor, setNewContributor] = useState("");
  const [prefillOpen, setPrefillOpen] = useState(false);

  const draftStorageKey = useMemo(
    () => `admin:project:draft:${mode}:${project?.slug ?? "new"}`,
    [mode, project?.slug]
  );

  const formSnapshot = useMemo(
    () => ({
      slug,
      title,
      company,
      tagline,
      tags,
      context,
      problem,
      data,
      method,
      result,
      impact,
      year,
      duration,
      category,
      badge,
      canvaEmbedUrl,
      githubUrl,
      isPrivate,
      isNDA,
      contributors,
      status,
    }),
    [
      slug,
      title,
      company,
      tagline,
      tags,
      context,
      problem,
      data,
      method,
      result,
      impact,
      year,
      duration,
      category,
      badge,
      canvaEmbedUrl,
      githubUrl,
      isPrivate,
      isNDA,
      contributors,
      status,
    ]
  );

  const initialSnapshot = useMemo(() => {
    if (mode !== "edit" || !project) return null;
    return {
      slug: project.slug ?? "",
      title: project.title ?? "",
      company: project.company ?? "",
      tagline: project.tagline ?? "",
      tags: project.tags ?? [],
      context: project.context ?? "",
      problem: project.problem ?? "",
      data: project.data ?? "",
      method: project.method ?? "",
      result: project.result ?? "",
      impact: project.impact ?? "",
      year: project.year ?? "",
      duration: project.duration ?? "",
      category: project.category ?? "bdd",
      badge: project.badge ?? "",
      canvaEmbedUrl: project.canvaEmbedUrl ?? "",
      githubUrl: project.githubUrl ?? "",
      isPrivate: project.isPrivate ?? false,
      isNDA: project.isNDA ?? false,
      contributors: project.contributors ?? [],
      status: project.status ?? "published",
    };
  }, [mode, project]);

  const changePreview = useMemo(() => {
    if (!initialSnapshot) return [];

    return Object.entries(formSnapshot)
      .filter(([key, value]) => {
        const before = initialSnapshot[key as keyof typeof initialSnapshot];
        return JSON.stringify(before) !== JSON.stringify(value);
      })
      .map(([key, value]) => ({
        key,
        label: PROJECT_DIFF_LABELS[key] || key,
        before: formatDiffValue(
          initialSnapshot[key as keyof typeof initialSnapshot]
        ),
        after: formatDiffValue(value),
      }));
  }, [formSnapshot, initialSnapshot]);

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function addTag() {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) {
      setNewTag("");
      return;
    }
    setTags((prev) => [...prev, trimmed]);
    setNewTag("");
  }

  function addContributor() {
    const trimmed = newContributor.trim();
    if (trimmed && !contributors.includes(trimmed)) {
      setContributors([...contributors, trimmed]);
      setNewContributor("");
    }
  }

  function applyAIPrefill(dataFromAI: Partial<Project>) {
    if (dataFromAI.slug) setSlug(dataFromAI.slug);
    if (dataFromAI.title) setTitle(dataFromAI.title);
    if (dataFromAI.company) setCompany(dataFromAI.company);
    if (dataFromAI.tagline) setTagline(dataFromAI.tagline);
    if (Array.isArray(dataFromAI.tags)) setTags(dataFromAI.tags);
    if (dataFromAI.context) setContext(dataFromAI.context);
    if (dataFromAI.problem) setProblem(dataFromAI.problem);
    if (dataFromAI.data) setData(dataFromAI.data);
    if (dataFromAI.method) setMethod(dataFromAI.method);
    if (dataFromAI.result) setResult(dataFromAI.result);
    if (dataFromAI.impact) setImpact(dataFromAI.impact);
    if (dataFromAI.year) setYear(dataFromAI.year);
    if (dataFromAI.duration) setDuration(dataFromAI.duration);
    if (dataFromAI.category) setCategory(dataFromAI.category);
    if (dataFromAI.badge) setBadge(dataFromAI.badge);
    if (dataFromAI.contributors) setContributors(dataFromAI.contributors);
    if (dataFromAI.status) setStatus(dataFromAI.status);
  }

  const applyDraft = useCallback(
    (draft: Partial<Project> & { status?: "draft" | "published" }) => {
      if (typeof draft.slug === "string") setSlug(draft.slug);
      if (typeof draft.title === "string") setTitle(draft.title);
      if (typeof draft.company === "string") setCompany(draft.company);
      if (typeof draft.tagline === "string") setTagline(draft.tagline);
      if (Array.isArray(draft.tags)) setTags(draft.tags);
      if (typeof draft.context === "string") setContext(draft.context);
      if (typeof draft.problem === "string") setProblem(draft.problem);
      if (typeof draft.data === "string") setData(draft.data);
      if (typeof draft.method === "string") setMethod(draft.method);
      if (typeof draft.result === "string") setResult(draft.result);
      if (typeof draft.impact === "string") setImpact(draft.impact);
      if (typeof draft.year === "string") setYear(draft.year);
      if (typeof draft.duration === "string") setDuration(draft.duration);
      if (
        draft.category &&
        ["bdd", "hackathon", "consulting", "school"].includes(draft.category)
      ) {
        setCategory(draft.category as ProjectCategory);
      }
      if (typeof draft.badge === "string") setBadge(draft.badge);
      if (typeof draft.canvaEmbedUrl === "string") setCanvaEmbedUrl(draft.canvaEmbedUrl);
      if (typeof draft.githubUrl === "string") setGithubUrl(draft.githubUrl);
      if (typeof draft.isPrivate === "boolean") setIsPrivate(draft.isPrivate);
      if (typeof draft.isNDA === "boolean") setIsNDA(draft.isNDA);
      if (Array.isArray(draft.contributors)) setContributors(draft.contributors);
      if (draft.status === "draft" || draft.status === "published") {
        setStatus(draft.status);
      }
    },
    []
  );

  const hasPendingAIPrefill =
    mode === "create" &&
    typeof window !== "undefined" &&
    sessionStorage.getItem("ai-prefill-type") === "project";

  const hasFormChanges = useMemo(() => {
    if (mode !== "edit" || !initialSnapshot) return true;
    return JSON.stringify(formSnapshot) !== JSON.stringify(initialSnapshot);
  }, [formSnapshot, initialSnapshot, mode]);
  const { restoredDraft, lastSavedAt, clearLocalDraft } = useAdminLocalDraft({
    draftStorageKey,
    mode,
    updatedAt: project?.updatedAt,
    hasPendingAIPrefill,
    formSnapshot,
    hasFormChanges,
    applyDraft,
  });

  useEffect(() => {
    if (typeof window === "undefined" || mode !== "create") return;
    const type = sessionStorage.getItem("ai-prefill-type");
    const raw = sessionStorage.getItem("ai-prefill-data");
    if (type !== "project" || !raw) return;

    try {
      const parsed = JSON.parse(raw) as Partial<Project>;
      applyAIPrefill(parsed);
    } catch {
      // Ignore malformed AI payload
    } finally {
      sessionStorage.removeItem("ai-prefill-type");
      sessionStorage.removeItem("ai-prefill-data");
    }
  }, [mode]);

  const availableTags = useMemo(
    () => Array.from(new Set([...ALL_TAGS, ...tags])).sort((a, b) => a.localeCompare(b)),
    [tags]
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const body = {
      slug,
      title,
      company,
      tagline,
      tags,
      context,
      problem,
      data,
      method,
      result,
      impact,
      year,
      duration,
      category,
      badge: badge || undefined,
      canvaEmbedUrl: canvaEmbedUrl || undefined,
      githubUrl: githubUrl || undefined,
      isPrivate: isPrivate || undefined,
      isNDA: isNDA || undefined,
      contributors: contributors.length > 0 ? contributors : undefined,
      status,
    };

    try {
      const url =
        mode === "create" ? "/api/admin/projects" : `/api/admin/projects/${project!.slug}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        clearLocalDraft();
        router.push("/admin/projects");
        router.refresh();
      } else {
        const responseData = await res.json();
        setError(responseData.error || "Failed to save");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/projects/${project!.slug}`, {
        method: "DELETE",
      });
      if (res.ok) {
        clearLocalDraft();
        router.push("/admin/projects");
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
            href="/admin/projects"
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
          >
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "create" ? "New Project" : `Edit: ${project!.title}`}
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
              label="Title *"
              value={title}
              onChange={(value) => {
                setTitle(value);
                if (mode === "create" && !slug) setSlug(toAdminSlug(value));
              }}
            />
            <AdminTextField
              label="Company *"
              value={company}
              onChange={setCompany}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminTextField
              label="Slug *"
              value={slug}
              onChange={setSlug}
              mono
              disabled={mode === "edit"}
            />
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50"
              >
                {CATEGORIES.map((entry) => (
                  <option key={entry.value} value={entry.value}>
                    {entry.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <AiPolishTextArea
            label="Tagline"
            value={tagline}
            onChange={setTagline}
            rows={2}
            enableAI
            aiContext="Project tagline"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <AdminTextField label="Year" value={year} onChange={setYear} />
            <AdminTextField
              label="Duration"
              value={duration}
              onChange={setDuration}
            />
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Badge</label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50"
              >
                {BADGES.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry || "None"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50"
              >
                {STATUSES.map((entry) => (
                  <option key={entry.value} value={entry.value}>
                    {entry.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-mono text-zinc-400 mb-3">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 text-xs font-mono rounded-full border transition-all ${
                  tags.includes(tag)
                    ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                    : "border-zinc-700 text-zinc-500 hover:border-zinc-600"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Add custom tag (ex: LLMOps)"
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-mono text-zinc-400 mb-2">Case Study</h2>
          <AiPolishTextArea
            label="Context"
            value={context}
            onChange={setContext}
            rows={3}
            enableAI
            aiContext="Project context"
          />
          <AiPolishTextArea
            label="Problem"
            value={problem}
            onChange={setProblem}
            rows={3}
            enableAI
            aiContext="Project problem"
          />
          <AiPolishTextArea
            label="Data"
            value={data}
            onChange={setData}
            rows={3}
            enableAI
            aiContext="Project data"
          />
          <AiPolishTextArea
            label="Method"
            value={method}
            onChange={setMethod}
            rows={4}
            enableAI
            aiContext="Project methodology"
          />
          <AiPolishTextArea
            label="Result"
            value={result}
            onChange={setResult}
            rows={3}
            enableAI
            aiContext="Project results"
          />
          <AiPolishTextArea
            label="Impact"
            value={impact}
            onChange={setImpact}
            rows={3}
            enableAI
            aiContext="Business impact"
          />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-mono text-zinc-400 mb-2">Links & Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminTextField
              label="Canva Embed URL"
              value={canvaEmbedUrl}
              onChange={setCanvaEmbedUrl}
            />
            <AdminTextField
              label="GitHub URL"
              value={githubUrl}
              onChange={setGithubUrl}
            />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-800"
              />
              Private
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={isNDA}
                onChange={(e) => setIsNDA(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-800"
              />
              NDA
            </label>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-mono text-zinc-400 mb-3">Contributors</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {contributors.map((contributor, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-xs"
              >
                {contributor}
                <button
                  type="button"
                  onClick={() =>
                    setContributors(contributors.filter((_, i) => i !== index))
                  }
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
              value={newContributor}
              onChange={(e) => setNewContributor(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addContributor();
                }
              }}
              placeholder="Add contributor name"
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50"
            />
            <button
              type="button"
              onClick={addContributor}
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
            {mode === "create" ? "Create Project" : "Save Changes"}
          </button>
        </div>
      </form>

      <AIPrefillModal
        type="project"
        isOpen={prefillOpen}
        onClose={() => setPrefillOpen(false)}
        onApply={(dataFromAI) => applyAIPrefill(dataFromAI as Partial<Project>)}
      />
    </div>
  );
}
