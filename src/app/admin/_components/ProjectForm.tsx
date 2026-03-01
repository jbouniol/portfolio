"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Loader2,
  Trash2,
  ArrowLeft,
  Plus,
  X,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import type { Project, ProjectTag, ProjectCategory } from "@/data/projects";

const ALL_TAGS: ProjectTag[] = [
  "AI", "ML", "Data", "NLP", "Consulting", "Strategy",
  "Finance", "Retail", "Luxury", "Defense", "Transport",
  "Logistics", "Automation", "SaaS",
];

const CATEGORIES: { value: ProjectCategory; label: string }[] = [
  { value: "bdd", label: "Business Deep Dive" },
  { value: "hackathon", label: "Hackathon" },
  { value: "consulting", label: "Consulting Mission" },
  { value: "school", label: "School Project" },
];

const BADGES = ["", "Winner", "Finalist", "2nd Place", "Honorable Mention"];

interface Props {
  project?: Project;
  mode: "create" | "edit";
}

export default function ProjectForm({ project, mode }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [slug, setSlug] = useState(project?.slug || "");
  const [title, setTitle] = useState(project?.title || "");
  const [company, setCompany] = useState(project?.company || "");
  const [tagline, setTagline] = useState(project?.tagline || "");
  const [tags, setTags] = useState<ProjectTag[]>(project?.tags || []);
  const [context, setContext] = useState(project?.context || "");
  const [problem, setProblem] = useState(project?.problem || "");
  const [data, setData] = useState(project?.data || "");
  const [method, setMethod] = useState(project?.method || "");
  const [result, setResult] = useState(project?.result || "");
  const [impact, setImpact] = useState(project?.impact || "");
  const [year, setYear] = useState(project?.year || "");
  const [duration, setDuration] = useState(project?.duration || "");
  const [category, setCategory] = useState<ProjectCategory>(project?.category || "bdd");
  const [badge, setBadge] = useState(project?.badge || "");
  const [canvaEmbedUrl, setCanvaEmbedUrl] = useState(project?.canvaEmbedUrl || "");
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl || "");
  const [isPrivate, setIsPrivate] = useState(project?.isPrivate || false);
  const [isNDA, setIsNDA] = useState(project?.isNDA || false);
  const [contributors, setContributors] = useState<string[]>(project?.contributors || []);
  const [newContributor, setNewContributor] = useState("");

  function autoSlug(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  function toggleTag(tag: ProjectTag) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function addContributor() {
    const trimmed = newContributor.trim();
    if (trimmed && !contributors.includes(trimmed)) {
      setContributors([...contributors, trimmed]);
      setNewContributor("");
    }
  }

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
    };

    try {
      const url =
        mode === "create"
          ? "/api/admin/projects"
          : `/api/admin/projects/${project!.slug}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        router.push("/admin/projects");
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
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/projects/${project!.slug}`, {
        method: "DELETE",
      });
      if (res.ok) {
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

  // Pre-fill from AI
  function applyAIPrefill(data: Partial<Project>) {
    if (data.slug) setSlug(data.slug);
    if (data.title) setTitle(data.title);
    if (data.company) setCompany(data.company);
    if (data.tagline) setTagline(data.tagline);
    if (data.tags) setTags(data.tags);
    if (data.context) setContext(data.context);
    if (data.problem) setProblem(data.problem);
    if (data.data) setData(data.data);
    if (data.method) setMethod(data.method);
    if (data.result) setResult(data.result);
    if (data.impact) setImpact(data.impact);
    if (data.year) setYear(data.year);
    if (data.duration) setDuration(data.duration);
    if (data.category) setCategory(data.category);
    if (data.badge) setBadge(data.badge);
    if (data.contributors) setContributors(data.contributors);
  }

  // Expose for AI pre-fill page to call
  if (typeof window !== "undefined") {
    (window as unknown as Record<string, unknown>).__projectFormApply = applyAIPrefill;
  }

  return (
    <div>
      {/* Header */}
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
            <Link
              href={`/admin/ai-prefill?type=project`}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg text-sm hover:bg-purple-600/30 transition-all"
            >
              <Sparkles size={14} />
              AI Pre-fill
            </Link>
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

      {error && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-mono text-zinc-400 mb-2">Basic Info</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title *" value={title} onChange={(v) => {
              setTitle(v);
              if (mode === "create" && !slug) setSlug(autoSlug(v));
            }} />
            <Field label="Company *" value={company} onChange={setCompany} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
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
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <TextArea label="Tagline" value={tagline} onChange={setTagline} rows={2} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Year" value={year} onChange={setYear} />
            <Field label="Duration" value={duration} onChange={setDuration} />
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Badge</label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50"
              >
                {BADGES.map((b) => (
                  <option key={b} value={b}>
                    {b || "None"}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-mono text-zinc-400 mb-3">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map((tag) => (
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
        </div>

        {/* Case Study Content */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-mono text-zinc-400 mb-2">Case Study</h2>
          <TextArea label="Context" value={context} onChange={setContext} rows={3} />
          <TextArea label="Problem" value={problem} onChange={setProblem} rows={3} />
          <TextArea label="Data" value={data} onChange={setData} rows={3} />
          <TextArea label="Method" value={method} onChange={setMethod} rows={4} />
          <TextArea label="Result" value={result} onChange={setResult} rows={3} />
          <TextArea label="Impact" value={impact} onChange={setImpact} rows={3} />
        </div>

        {/* Links & Options */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-mono text-zinc-400 mb-2">Links & Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Canva Embed URL" value={canvaEmbedUrl} onChange={setCanvaEmbedUrl} />
            <Field label="GitHub URL" value={githubUrl} onChange={setGithubUrl} />
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

        {/* Contributors */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-mono text-zinc-400 mb-3">Contributors</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {contributors.map((c, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-xs"
              >
                {c}
                <button
                  type="button"
                  onClick={() =>
                    setContributors(contributors.filter((_, j) => j !== i))
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

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {mode === "create" ? "Create Project" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Reusable fields ─────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  mono,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  mono?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs text-zinc-400 mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 disabled:opacity-50 ${
          mono ? "font-mono" : ""
        }`}
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs text-zinc-400 mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 resize-y"
      />
    </div>
  );
}
