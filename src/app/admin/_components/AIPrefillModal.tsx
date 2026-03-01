"use client";

import { useState } from "react";
import { Loader2, Sparkles, X, ClipboardCheck, ArrowRight } from "lucide-react";

interface AIPrefillModalProps {
  type: "project" | "experience";
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: Record<string, unknown>) => void;
}

export default function AIPrefillModal({
  type,
  isOpen,
  onClose,
  onApply,
}: AIPrefillModalProps) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  if (!isOpen) return null;

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
      if (!res.ok) {
        setError(data.error || "Failed to generate");
        return;
      }

      setResult(data.data);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  function handleApply() {
    if (!result) return;
    onApply(result);
    onClose();
    setDescription("");
    setResult(null);
    setError("");
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 h-full w-full flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-blue-900/20">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  AI Pre-fill ({type === "project" ? "Project" : "Experience"})
                </p>
                <p className="text-[11px] text-zinc-500">
                  Décris ton contenu et applique directement le résultat au formulaire.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              aria-label="Close AI prefill modal"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-[calc(90vh-74px)]">
            <div className="p-5 border-r border-zinc-800 overflow-y-auto">
              <label className="block text-xs text-zinc-400 mb-2">
                Ton brief (contexte, actions, résultats, stack, durée...)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={14}
                placeholder={
                  type === "project"
                    ? "Exemple: mission de 3 semaines pour X, objectif business, dataset, méthode, résultat quantifié..."
                    : "Exemple: stage de 6 mois, rôle, missions principales, impact, outils..."
                }
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 resize-y"
              />

              {error && (
                <p className="mt-3 text-xs text-red-300 border border-red-500/30 bg-red-500/10 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading || !description.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-sm font-medium text-white transition-colors"
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

            <div className="p-5 overflow-y-auto bg-gradient-to-b from-zinc-950 to-zinc-900/60">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-mono text-zinc-400">Generated JSON</p>
                {result && (
                  <button
                    type="button"
                    onClick={handleApply}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition-colors"
                  >
                    <ClipboardCheck size={12} />
                    Apply to form
                    <ArrowRight size={12} />
                  </button>
                )}
              </div>

              {result ? (
                <pre className="text-[11px] text-zinc-200 bg-zinc-900 border border-zinc-800 rounded-xl p-4 overflow-x-auto max-h-[60vh] overflow-y-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              ) : (
                <div className="h-full min-h-[220px] border border-dashed border-zinc-800 rounded-xl flex items-center justify-center text-xs text-zinc-500">
                  Le résultat apparaîtra ici après génération.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
