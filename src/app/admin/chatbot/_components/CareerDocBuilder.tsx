import { FileText, Loader2, Sparkles, Upload } from "lucide-react";
import type { CareerDocLanguage, CareerDocState } from "../types";

function AiActivitySteps({
  steps,
  activeIndex,
}: {
  steps: readonly string[];
  activeIndex: number;
}) {
  return (
    <div className="flex items-center flex-wrap gap-1.5">
      {steps.map((step, index) => {
        const isActive = index === activeIndex;
        return (
          <span
            key={step}
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] transition-colors ${
              isActive
                ? "border-zinc-600 bg-zinc-800 text-zinc-100"
                : "border-zinc-800 bg-zinc-900 text-zinc-500"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive ? "bg-zinc-300 bob-pulse-dot" : "bg-zinc-700"
              }`}
            />
            {step}
          </span>
        );
      })}
    </div>
  );
}

export default function CareerDocBuilder({
  title,
  subtitle,
  state,
  activitySteps,
  activityIndex,
  onChange,
  onGenerate,
  onDownloadPdf,
  onDownloadTex,
  onCopyLatex,
}: {
  title: string;
  subtitle: string;
  state: CareerDocState;
  activitySteps: readonly string[];
  activityIndex: number;
  onChange: (patch: Partial<CareerDocState>) => void;
  onGenerate: () => void;
  onDownloadPdf: () => void;
  onDownloadTex: () => void;
  onCopyLatex: () => void;
}) {
  return (
    <section className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-950/95 min-h-0 grid grid-cols-1 xl:grid-cols-[380px_1fr] overflow-hidden">
      <div className="border-r border-zinc-800 p-4 space-y-3 overflow-y-auto">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>
        </div>

        <label className="block">
          <span className="text-[11px] text-zinc-500">Job Title</span>
          <input
            value={state.jobTitle}
            onChange={(event) => onChange({ jobTitle: event.target.value })}
            className="no-focus-outline mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600"
            placeholder="Data Engineer Apprentice"
          />
        </label>

        <label className="block">
          <span className="text-[11px] text-zinc-500">Company</span>
          <input
            value={state.company}
            onChange={(event) => onChange({ company: event.target.value })}
            className="no-focus-outline mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600"
            placeholder="Company name"
          />
        </label>

        <label className="block">
          <span className="text-[11px] text-zinc-500">Language</span>
          <select
            value={state.language}
            onChange={(event) =>
              onChange({ language: event.target.value as CareerDocLanguage })
            }
            className="no-focus-outline mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </label>

        <label className="block">
          <span className="text-[11px] text-zinc-500">Job Description</span>
          <textarea
            rows={8}
            value={state.jobDescription}
            onChange={(event) => onChange({ jobDescription: event.target.value })}
            className="no-focus-outline mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 resize-y"
            placeholder="Paste the full role description here..."
          />
        </label>

        <label className="block">
          <span className="text-[11px] text-zinc-500">Extra Instructions</span>
          <textarea
            rows={4}
            value={state.extraInstructions}
            onChange={(event) =>
              onChange({ extraInstructions: event.target.value })
            }
            className="no-focus-outline mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 resize-y"
            placeholder="Optional: preferred angle, key points to emphasize..."
          />
        </label>

        {state.error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {state.error}
          </div>
        )}

        {state.generating && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2">
            <AiActivitySteps steps={activitySteps} activeIndex={activityIndex} />
            <p className="mt-2 text-[11px] text-zinc-500">
              AI is {activitySteps[activityIndex]}
              <span className="bob-ellipsis" />
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onGenerate}
            disabled={state.generating}
            className="no-focus-outline inline-flex items-center justify-center gap-1.5 rounded-lg bg-zinc-100 text-zinc-900 px-3 py-2 text-xs hover:bg-white disabled:opacity-50"
          >
            {state.generating ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Sparkles size={12} />
            )}
            Generate
          </button>
          <button
            type="button"
            onClick={onDownloadPdf}
            disabled={state.downloadingPdf || !state.latex.trim()}
            className="no-focus-outline inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-200 disabled:opacity-50"
          >
            {state.downloadingPdf ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Upload size={12} />
            )}
            PDF
          </button>
          <button
            type="button"
            onClick={onDownloadTex}
            disabled={!state.latex.trim()}
            className="no-focus-outline inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-200 disabled:opacity-50"
          >
            <FileText size={12} />
            .tex
          </button>
          <button
            type="button"
            onClick={onCopyLatex}
            disabled={!state.latex.trim()}
            className="no-focus-outline inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-200 disabled:opacity-50"
          >
            Copy LaTeX
          </button>
        </div>
      </div>

      <div className="p-4 min-h-0 overflow-y-auto">
        <p className="text-[11px] uppercase tracking-wide text-zinc-500 mb-2">
          Generated LaTeX
        </p>
        <pre className="text-[11px] leading-relaxed whitespace-pre-wrap rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-zinc-300 min-h-[280px]">
          {state.latex.trim() || "% Generated LaTeX will appear here"}
        </pre>
      </div>
    </section>
  );
}
