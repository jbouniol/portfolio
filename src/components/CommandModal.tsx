"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle,
  Trophy,
  Award,
  Briefcase,
  Users,
  GraduationCap,
  ArrowUpRight,
  X,
} from "lucide-react";

const modalSuggestions = [
  "Ask me anything...",
  "What projects involve AI?",
  "Tell me about the Generali internship",
  "Where did Jonathan study?",
  "What leadership roles does Jonathan hold?",
  "Summarize the CMA-CGM supply chain analysis",
];

interface RelatedProject {
  slug: string;
  title: string;
  company: string;
  tagline: string;
  badge?: string;
  tags: string[];
}

interface RelatedExperience {
  slug: string;
  role: string;
  company: string;
  period: string;
  tagline: string;
  category: string;
  hasPage: boolean;
}

interface SearchResult {
  answer: string;
  followUpQuestions: string[];
  relatedProjects: RelatedProject[];
  relatedExperiences: RelatedExperience[];
  type: "project" | "experience" | "skill" | "general";
}

export default function CommandModal({
  pageContext,
}: {
  pageContext: string;
}) {
  const hasContext = pageContext.trim().length > 0;
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderText, setPlaceholderText] = useState("");
  const [isDeletingPlaceholder, setIsDeletingPlaceholder] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const open = useCallback(() => {
    setIsOpen(true);
    setQuery("");
    setResult(null);
    setError(null);
    setPlaceholderIndex(0);
    setPlaceholderText("");
    setIsDeletingPlaceholder(false);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setResult(null);
    setError(null);
  }, []);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) close(); else open();
      }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, open, close]);

  // Custom event from Navigation button
  useEffect(() => {
    const handleEvent = () => open();
    window.addEventListener("command-modal:open", handleEvent);
    return () => window.removeEventListener("command-modal:open", handleEvent);
  }, [open]);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const currentSuggestion = modalSuggestions[placeholderIndex];
    const typingSpeed = isDeletingPlaceholder ? 35 : 60;

    if (!isDeletingPlaceholder && placeholderText === currentSuggestion) {
      const pause = setTimeout(() => setIsDeletingPlaceholder(true), 1200);
      return () => clearTimeout(pause);
    }

    if (isDeletingPlaceholder && placeholderText === "") {
      const next = setTimeout(() => {
        setIsDeletingPlaceholder(false);
        setPlaceholderIndex((prev) => (prev + 1) % modalSuggestions.length);
      }, 250);
      return () => clearTimeout(next);
    }

    const timer = setTimeout(() => {
      setPlaceholderText((prev) =>
        isDeletingPlaceholder
          ? currentSuggestion.slice(0, Math.max(0, prev.length - 1))
          : currentSuggestion.slice(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [isDeletingPlaceholder, isOpen, placeholderIndex, placeholderText]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    track("ai_search", { query: searchQuery, source: "command-modal" });

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, pageContext }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 500 && data.error === "MISTRAL_API_KEY not configured") {
          setError("AI search is being configured. Check back soon!");
        } else {
          setError("Something went wrong. Please try again.");
        }
        return;
      }

      const data: SearchResult = await res.json();
      setResult(data);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Work Experience": return <Briefcase size={12} />;
      case "Leadership": return <Users size={12} />;
      case "Education": return <GraduationCap size={12} />;
      default: return <Briefcase size={12} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Work Experience": return "text-accent bg-accent/10 border-accent/20";
      case "Leadership": return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "Education": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      default: return "text-accent bg-accent/10 border-accent/20";
    }
  };

  const hasRelatedItems =
    result &&
    (result.relatedProjects.length > 0 || result.relatedExperiences.length > 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4"
          onClick={(e) => { if (e.target === overlayRef.current) close(); }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={close} />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full max-w-xl bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Context badge + close */}
            {hasContext && (
              <div className="flex items-center justify-between px-4 pt-3 pb-0">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent/10 border border-accent/20 rounded-full">
                  <Sparkles size={11} className="text-accent" />
                  <span className="text-[11px] font-mono text-accent">{pageContext}</span>
                </div>
                <button
                  onClick={close}
                  className="p-1.5 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-surface"
                  aria-label="Close"
                >
                  <X size={15} />
                </button>
              </div>
            )}

            {/* Search form */}
            <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4 py-3 border-b border-border">
              {isLoading ? (
                <Loader2 size={18} className="text-accent shrink-0 animate-spin" />
              ) : (
                <Search size={18} className="text-muted shrink-0" />
              )}
              <label htmlFor="command-modal-input" className="sr-only">Ask a question</label>
              <input
                id="command-modal-input"
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholderText}
                disabled={isLoading}
                className="no-focus-outline flex-1 bg-transparent text-foreground placeholder:text-muted/50 outline-none text-sm disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="p-1.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowRight size={14} />
              </button>
            </form>

            {/* Results area */}
            <div className="max-h-[55vh] overflow-y-auto overscroll-contain">
              {/* Error */}
              {error && (
                <div className="flex items-center gap-3 m-4 p-3 bg-red-500/5 border border-red-500/20 rounded-xl text-sm text-red-400">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Loading skeleton */}
              {isLoading && (
                <div className="p-4 space-y-3 animate-pulse">
                  <div className="h-3 bg-border/50 rounded w-3/4" />
                  <div className="h-3 bg-border/50 rounded w-full" />
                  <div className="h-3 bg-border/50 rounded w-5/6" />
                </div>
              )}

              {/* AI answer */}
              {result && !isLoading && (
                <div className="p-4 space-y-3">
                  {/* Answer card */}
                  <div className="p-4 bg-surface border border-border rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={13} className="text-accent" />
                      <span className="text-[11px] font-mono text-accent">AI Answer</span>
                      <span className="px-2 py-0.5 text-[10px] font-mono bg-accent/10 text-accent rounded-full ml-auto">
                        {result.type}
                      </span>
                    </div>
                    <p className="text-foreground leading-relaxed text-sm">{result.answer}</p>

                    {/* Follow-up questions */}
                    {result.followUpQuestions?.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-[10px] font-mono text-muted mb-2 uppercase tracking-wider">Follow-up</p>
                        <div className="flex flex-wrap gap-1.5">
                          {result.followUpQuestions.map((q) => (
                            <button
                              key={q}
                              onClick={() => {
                                setQuery(q);
                                handleSearch(q);
                              }}
                              className="px-2.5 py-1 text-[11px] text-muted bg-background border border-border rounded-full hover:border-accent/40 hover:text-foreground transition-all text-left"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Related items count */}
                  {hasRelatedItems && (
                    <p className="text-[11px] font-mono text-muted px-1">
                      {result.relatedProjects.length + result.relatedExperiences.length} related item
                      {result.relatedProjects.length + result.relatedExperiences.length > 1 ? "s" : ""}
                    </p>
                  )}

                  {/* Related experiences */}
                  {result.relatedExperiences.length > 0 && (
                    <div className="space-y-2">
                      {result.relatedExperiences.map((exp) => {
                        const colorClass = getCategoryColor(exp.category);
                        const inner = (
                          <>
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono border rounded-full ${colorClass}`}>
                                {getCategoryIcon(exp.category)} {exp.category}
                              </span>
                              <span className="font-mono text-[11px] text-muted">{exp.period}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <h4 className="font-semibold text-sm">{exp.role}</h4>
                              {exp.hasPage && <ArrowUpRight size={11} className="text-muted group-hover:text-accent transition-colors" />}
                            </div>
                            <p className="text-accent text-xs font-medium">{exp.company}</p>
                            <p className="text-[11px] text-muted leading-relaxed mt-1">{exp.tagline}</p>
                          </>
                        );

                        if (exp.hasPage) {
                          return (
                            <Link key={exp.slug} href={`/experience/${exp.slug}`} onClick={close} className="group block">
                              <div className="p-3 bg-surface border border-border rounded-xl hover:border-accent/20 transition-colors">
                                {inner}
                              </div>
                            </Link>
                          );
                        }
                        return (
                          <div key={exp.slug} className="p-3 bg-surface border border-border rounded-xl">
                            {inner}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Related projects */}
                  {result.relatedProjects.length > 0 && (
                    <div className="space-y-2">
                      {result.relatedProjects.map((project) => (
                        <Link key={project.slug} href={`/projects/${project.slug}`} onClick={close} className="group block">
                          <div className="p-3 bg-surface border border-border rounded-xl hover:border-accent/20 transition-colors">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="font-mono text-[11px] text-accent">{project.company}</span>
                              {project.badge === "Winner" && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full">
                                  <Trophy size={9} /> Winner
                                </span>
                              )}
                              {project.badge === "Finalist" && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-full">
                                  <Award size={9} /> Finalist
                                </span>
                              )}
                              {project.badge === "2nd Place" && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono bg-zinc-400/10 text-zinc-400 border border-zinc-400/20 rounded-full">
                                  <Award size={9} /> 2nd Place
                                </span>
                              )}
                              {project.badge === "Honorable Mention" && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                                  <Award size={9} /> Mention
                                </span>
                              )}
                            </div>
                            <h4 className="font-semibold text-sm mb-0.5">{project.title}</h4>
                            <p className="text-[11px] text-muted leading-relaxed">{project.tagline}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {project.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="px-2 py-0.5 text-[10px] font-mono bg-background border border-border rounded-full text-muted">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Ask another */}
                  <button
                    onClick={() => { setResult(null); setQuery(""); inputRef.current?.focus(); }}
                    className="w-full text-center text-[11px] text-muted hover:text-accent transition-colors font-mono pt-1 pb-2"
                  >
                    Ask another question →
                  </button>
                </div>
              )}

              {/* Empty state */}
              {!result && !isLoading && !error && (
                <p className="text-center text-xs text-muted font-mono py-8">
                  Type a question and press Enter
                </p>
              )}
            </div>

            {/* Footer hint */}
            <div className="flex items-center justify-end gap-4 px-4 py-2.5 border-t border-border bg-surface/50">
              <span className="text-[10px] text-muted font-mono flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-border/50 rounded text-muted">Esc</kbd>
                close
              </span>
              <span className="text-[10px] text-muted font-mono flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-border/50 rounded text-muted">↵</kbd>
                search
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
