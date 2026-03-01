"use client";

import { Loader2, Wand2 } from "lucide-react";
import { useState } from "react";

export function AdminTextField({
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

export function AiPolishTextArea({
  label,
  value,
  onChange,
  rows = 3,
  enableAI = false,
  aiContext,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  enableAI?: boolean;
  aiContext?: string;
}) {
  const [aiAction, setAiAction] = useState<"" | "improve" | "shorten" | "star">("");
  const [aiError, setAiError] = useState("");

  async function runAi(action: "improve" | "shorten" | "star") {
    if (!value.trim()) return;
    setAiAction(action);
    setAiError("");
    try {
      const res = await fetch("/api/admin/ai-polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          text: value,
          context: aiContext || label,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAiError(data.error || "AI rewrite failed");
        return;
      }
      if (typeof data.text === "string") {
        onChange(data.text);
      }
    } catch {
      setAiError("Network error");
    } finally {
      setAiAction("");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <label className="block text-xs text-zinc-400">{label}</label>
        {enableAI && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => runAi("improve")}
              disabled={!!aiAction || !value.trim()}
              className="inline-flex items-center gap-1 px-2 py-1 text-[10px] border border-zinc-700 rounded-md text-zinc-300 hover:text-white hover:border-zinc-500 disabled:opacity-40"
            >
              {aiAction === "improve" ? (
                <Loader2 size={10} className="animate-spin" />
              ) : (
                <Wand2 size={10} />
              )}
              Improve
            </button>
            <button
              type="button"
              onClick={() => runAi("shorten")}
              disabled={!!aiAction || !value.trim()}
              className="px-2 py-1 text-[10px] border border-zinc-700 rounded-md text-zinc-300 hover:text-white hover:border-zinc-500 disabled:opacity-40"
            >
              Shorten
            </button>
            <button
              type="button"
              onClick={() => runAi("star")}
              disabled={!!aiAction || !value.trim()}
              className="px-2 py-1 text-[10px] border border-zinc-700 rounded-md text-zinc-300 hover:text-white hover:border-zinc-500 disabled:opacity-40"
            >
              STAR
            </button>
          </div>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 resize-y"
      />
      {aiError && <p className="text-[11px] text-red-400 mt-1">{aiError}</p>}
    </div>
  );
}
