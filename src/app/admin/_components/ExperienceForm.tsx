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
import type { Experience } from "@/data/experiences";

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
  const [isConfidential, setIsConfidential] = useState(experience?.isConfidential || false);
  const [newTool, setNewTool] = useState("");

  function autoSlug(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

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
      missions: missions.filter((m) => m.trim()),
      tools: tools.length > 0 ? tools : undefined,
      isConfidential: isConfidential || undefined,
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
      {/* Header */}
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
            <Link
              href="/admin/ai-prefill?type=experience"
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
            <Field label="Role *" value={role} onChange={(v) => {
              setRole(v);
              if (mode === "create" && !slug) setSlug(autoSlug(v));
            }} />
            <Field label="Company *" value={company} onChange={setCompany} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field
              label="Slug *"
              value={slug}
              onChange={setSlug}
              mono
              disabled={mode === "edit"}
            />
            <Field label="Period" value={period} onChange={setPeriod} placeholder="e.g. Jul 2025 — Dec 2025" />
            <Field label="Location" value={location} onChange={setLocation} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <TextArea label="Tagline" value={tagline} onChange={setTagline} rows={2} />
          <TextArea label="Description" value={description} onChange={setDescription} rows={4} />
        </div>

        {/* Missions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-mono text-zinc-400 mb-3">Missions</h2>
          <div className="space-y-2">
            {missions.map((mission, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-xs text-zinc-600 mt-3 w-4 shrink-0 text-right">
                  {i + 1}.
                </span>
                <textarea
                  value={mission}
                  onChange={(e) => updateMission(i, e.target.value)}
                  rows={2}
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 resize-y"
                />
                {missions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMission(i)}
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

        {/* Tools */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-mono text-zinc-400 mb-3">Tools & Stack</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {tools.map((t, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-xs"
              >
                {t}
                <button
                  type="button"
                  onClick={() => setTools(tools.filter((_, j) => j !== i))}
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
            {mode === "create" ? "Create Experience" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  mono,
  disabled,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  mono?: boolean;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-zinc-400 mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
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
