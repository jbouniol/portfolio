"use client";

import type React from "react";
import { useState } from "react";
import { ArrowRight, Search, Loader2, X, Copy, Check, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { MentionCandidate, Message } from "../types";

function linkifyProjectMentions(
  content: string,
  projectMentionTargets: Record<string, string>
) {
  return content.replace(
    /(^|[\s(])@([a-z0-9][a-z0-9-]{1,80})(?=$|[\s),.:;!?])/gi,
    (full, prefix: string, slug: string) => {
      const href = projectMentionTargets[slug.toLowerCase()];
      if (!href) return full;
      return `${prefix}[@${slug}](${href})`;
    }
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback silently
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="no-focus-outline inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all opacity-0 group-hover:opacity-100"
      title={copied ? "Copied!" : "Copy message"}
    >
      {copied ? (
        <>
          <Check size={11} className="text-emerald-400" />
          <span className="text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <Copy size={11} />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

export default function AskPane({
  hasConversation,
  loading,
  chatError,
  chatPhaseIndex,
  chatActivitySteps,
  isAskFocused,
  setIsAskFocused,
  input,
  setInput,
  setCursorPosition,
  askPlaceholderText,
  selectedModelLabel,
  activeMention,
  filteredMentions,
  mentionIndex,
  setMentionIndex,
  setMentionSuppressed,
  activeMentionContexts,
  onApplyMention,
  onRemoveMentionContext,
  onSubmitPrompt,
  messages,
  projectMentionTargets,
  starters,
  onStarterPrompt,
  chatInputRef,
  messagesEndRef,
}: {
  hasConversation: boolean;
  loading: boolean;
  chatError: string;
  chatPhaseIndex: number;
  chatActivitySteps: readonly string[];
  isAskFocused: boolean;
  setIsAskFocused: (value: boolean) => void;
  input: string;
  setInput: (value: string) => void;
  setCursorPosition: (value: number) => void;
  askPlaceholderText: string;
  selectedModelLabel?: string;
  activeMention: { start: number; end: number; query: string } | null;
  filteredMentions: MentionCandidate[];
  mentionIndex: number;
  setMentionIndex: React.Dispatch<React.SetStateAction<number>>;
  setMentionSuppressed: (value: boolean) => void;
  activeMentionContexts: MentionCandidate[];
  onApplyMention: (candidate: MentionCandidate) => void;
  onRemoveMentionContext: (slug: string) => void;
  onSubmitPrompt: () => void;
  messages: Message[];
  projectMentionTargets: Record<string, string>;
  starters: string[];
  onStarterPrompt: (starter: string) => void;
  chatInputRef: React.RefObject<HTMLInputElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <section className="relative flex-1 min-h-0 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blue-500/[0.08] to-transparent" />
        <div className="absolute left-1/2 top-20 h-40 w-[62%] -translate-x-1/2 rounded-full bg-white/[0.05] blur-3xl" />
      </div>

      <div className="relative flex h-full min-h-0 flex-col">
        <div
          className={`w-full px-5 transition-all duration-500 ${
            hasConversation
              ? "pt-5 pb-3"
              : "flex-1 flex items-center justify-center pb-8"
          }`}
        >
          <div
            className={`mx-auto w-full transition-all duration-500 ease-out ${
              hasConversation ? "max-w-5xl" : "max-w-2xl"
            }`}
          >
            <form
              onSubmit={(event) => {
                event.preventDefault();
                onSubmitPrompt();
              }}
              className={`relative rounded-[26px] border px-1 py-1 transition-all duration-300 backdrop-blur-2xl ${
                isAskFocused
                  ? "border-blue-400/70 bg-white/[0.09] shadow-[0_20px_70px_-28px_rgba(59,130,246,0.72)]"
                  : "border-white/15 bg-white/[0.05] shadow-[0_18px_58px_-30px_rgba(14,165,233,0.42)]"
              }`}
            >
              <div className="flex items-center gap-3 px-4 py-3">
                {loading ? (
                  <Loader2 size={18} className="text-zinc-300 shrink-0 animate-spin" />
                ) : (
                  <Search size={18} className="text-zinc-400 shrink-0" />
                )}
                <input
                  ref={chatInputRef}
                  type="text"
                  value={input}
                  onChange={(event) => {
                    setInput(event.target.value);
                    setCursorPosition(
                      event.target.selectionStart ?? event.target.value.length
                    );
                    setMentionSuppressed(false);
                  }}
                  onKeyDown={(event) => {
                    if (!activeMention || filteredMentions.length === 0) return;

                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      setMentionIndex((prev) => (prev + 1) % filteredMentions.length);
                      return;
                    }

                    if (event.key === "ArrowUp") {
                      event.preventDefault();
                      setMentionIndex((prev) =>
                        prev === 0 ? filteredMentions.length - 1 : prev - 1
                      );
                      return;
                    }

                    if (event.key === "Enter" || event.key === "Tab") {
                      event.preventDefault();
                      onApplyMention(filteredMentions[mentionIndex] ?? filteredMentions[0]);
                      return;
                    }

                    if (event.key === "Escape") {
                      event.preventDefault();
                      setMentionSuppressed(true);
                    }
                  }}
                  onClick={(event) =>
                    setCursorPosition(event.currentTarget.selectionStart ?? input.length)
                  }
                  onKeyUp={(event) =>
                    setCursorPosition(event.currentTarget.selectionStart ?? input.length)
                  }
                  onSelect={(event) =>
                    setCursorPosition(event.currentTarget.selectionStart ?? input.length)
                  }
                  onFocus={() => setIsAskFocused(true)}
                  onBlur={() => setIsAskFocused(false)}
                  placeholder={
                    askPlaceholderText || `Ask Bob (${selectedModelLabel ?? "model"})`
                  }
                  className="no-focus-outline flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="no-focus-outline h-9 min-w-9 px-2 rounded-xl bg-white/95 text-zinc-900 hover:bg-white disabled:opacity-50 inline-flex items-center justify-center"
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <ArrowRight size={14} />
                  )}
                </button>
              </div>

              {isAskFocused && activeMention && filteredMentions.length > 0 && (
                <div className="absolute left-3 right-3 top-[calc(100%+8px)] z-20 rounded-xl border border-zinc-700 bg-zinc-950/95 backdrop-blur-xl shadow-[0_16px_40px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
                  <div className="px-3 py-2 text-[10px] uppercase tracking-wide text-zinc-500 border-b border-zinc-800">
                    Add precise context
                  </div>
                  <div className="max-h-56 overflow-y-auto">
                    {filteredMentions.map((candidate, index) => (
                      <button
                        key={candidate.key}
                        type="button"
                        onMouseDown={(event) => {
                          event.preventDefault();
                          onApplyMention(candidate);
                        }}
                        className={`w-full text-left px-3 py-2.5 transition-colors ${
                          index === mentionIndex ? "bg-zinc-800/80" : "hover:bg-zinc-900"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm text-zinc-100 truncate">
                            @{candidate.slug}
                          </p>
                          <span
                            className={`text-[10px] uppercase tracking-wide ${
                              candidate.type === "project"
                                ? "text-blue-300"
                                : "text-emerald-300"
                            }`}
                          >
                            {candidate.type}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-zinc-400 truncate">
                          {candidate.label} · {candidate.secondary}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeMentionContexts.length > 0 && (
                <div className="px-4 pb-3 flex flex-wrap items-center gap-2">
                  <p className="text-[10px] uppercase tracking-wide text-zinc-500 mr-1">
                    Contexte actif
                  </p>
                  {activeMentionContexts.map((candidate) => (
                    <button
                      key={`active-${candidate.key}`}
                      type="button"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        onRemoveMentionContext(candidate.slug);
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] transition-colors ${
                        candidate.type === "project"
                          ? "border-blue-400/35 bg-blue-500/10 text-blue-200 hover:border-blue-300/60"
                          : "border-emerald-400/35 bg-emerald-500/10 text-emerald-200 hover:border-emerald-300/60"
                      }`}
                      title={`${candidate.label} · ${candidate.secondary}`}
                    >
                      <span className="font-mono">{candidate.slug}</span>
                      <X size={10} className="opacity-75" />
                    </button>
                  ))}
                </div>
              )}
            </form>

            <div className="mt-2 min-h-5">
              {chatError && <p className="text-[11px] text-red-300">{chatError}</p>}
              {!chatError && loading && (
                <p className="text-[11px] text-zinc-500">
                  Bob is {chatActivitySteps[chatPhaseIndex]}
                  <span className="bob-ellipsis" />
                </p>
              )}
            </div>

            {!hasConversation && !loading && (
              <div className="mt-5 flex flex-wrap gap-2 justify-center">
                {starters.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    onClick={() => onStarterPrompt(starter)}
                    className="no-focus-outline px-3 py-1.5 text-xs rounded-full border border-zinc-700/80 bg-zinc-900/70 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {hasConversation && (
          <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-5">
            <div className="mx-auto w-full max-w-5xl space-y-4">
              {messages.map((message, index) => (
                <article
                  key={`${index}-${message.role}`}
                  className={`group relative rounded-xl px-4 py-3 ${
                    message.role === "assistant"
                      ? "bg-zinc-900/60 border border-zinc-800/60 text-zinc-200"
                      : "bg-zinc-950/40 border border-zinc-800/40 text-zinc-400"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] uppercase tracking-wide text-zinc-500">
                      {message.role === "assistant" ? "Bob" : "Query"}
                    </p>
                    {message.role === "assistant" && message.content && (
                      <CopyButton text={message.content} />
                    )}
                  </div>
                  {message.role === "assistant" ? (
                    <div className="prose-chat">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 underline decoration-blue-400/30 hover:decoration-blue-300/50 transition-colors"
                            >
                              {children}
                              <ExternalLink size={11} className="inline shrink-0" />
                            </a>
                          ),
                        }}
                      >
                        {linkifyProjectMentions(
                          message.content,
                          projectMentionTargets
                        )}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  )}
                </article>
              ))}
              {loading && (
                <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-3 text-zinc-300">
                  <div className="flex items-center flex-wrap gap-1.5">
                    {chatActivitySteps.map((step, index) => {
                      const isActive = index === chatPhaseIndex;
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
                  <div className="mt-3 space-y-2">
                    <div className="h-2 w-[72%] rounded-full bg-zinc-800 bob-shimmer" />
                    <div className="h-2 w-[86%] rounded-full bg-zinc-800 bob-shimmer" />
                    <div className="h-2 w-[52%] rounded-full bg-zinc-800 bob-shimmer" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
