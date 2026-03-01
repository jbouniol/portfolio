"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  Loader2,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";

type ContentType = "project" | "experience";

export default function AIPrefillClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [type, setType] = useState<ContentType>(
    (searchParams.get("type") as ContentType) || "project"
  );
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (!description.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/admin/ai-prefill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, type }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data.data);
      } else {
        setError(data.error || "Failed to generate");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  function handleUseData() {
    if (!result) return;
    // Store in sessionStorage for the form to pick up
    sessionStorage.setItem("ai-prefill-data", JSON.stringify(result));
    sessionStorage.setItem("ai-prefill-type", type);
    router.push(
      type === "project" ? "/admin/projects/new" : "/admin/experiences/new"
    );
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles size={20} className="text-purple-400" />
          <h1 className="text-2xl font-semibold tracking-tight">AI Pre-fill</h1>
        </div>
        <p className="text-zinc-500 text-sm">
          Describe a project or experience and let Mistral Large generate
          structured data for your portfolio.
        </p>
      </div>

      {/* Type selector */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setType("project")}
          className={`px-4 py-2 text-sm rounded-lg border transition-all ${
            type === "project"
              ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
              : "border-zinc-800 text-zinc-500 hover:border-zinc-700"
          }`}
        >
          Project
        </button>
        <button
          onClick={() => setType("experience")}
          className={`px-4 py-2 text-sm rounded-lg border transition-all ${
            type === "experience"
              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
              : "border-zinc-800 text-zinc-500 hover:border-zinc-700"
          }`}
        >
          Experience
        </button>
      </div>

      {/* Input */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
        <label className="block text-xs text-zinc-400 mb-2">
          Describe your {type} in detail
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          placeholder={
            type === "project"
              ? "e.g. During my second year at Albert School, I worked on a 3-week project with Louis Vuitton analyzing their supply chain data. We used Python and scikit-learn to build a demand forecasting model..."
              : "e.g. I was an intern at Sunver, a solar panel startup, for 2 months during summer 2024. I reported directly to the CEO and worked on SEO, marketing, and building an LLM for the app..."
          }
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 resize-y"
        />

        <div className="flex justify-end mt-3">
          <button
            onClick={handleGenerate}
            disabled={loading || !description.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-sm font-medium rounded-lg transition-all text-white"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Generate
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800">
            <h2 className="text-sm font-mono text-zinc-400">
              Generated {type} data
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 hover:text-white border border-zinc-700 rounded-lg transition-all"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy JSON"}
              </button>
              <button
                onClick={handleUseData}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-all"
              >
                Use This Data
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
          <pre className="p-5 text-xs text-zinc-300 overflow-x-auto max-h-[500px] overflow-y-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
