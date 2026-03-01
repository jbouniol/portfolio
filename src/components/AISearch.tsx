"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Loader2,
  AlertCircle,
  Trophy,
  Award,
  Briefcase,
  GraduationCap,
  Users,
  ArrowUpRight,
} from "lucide-react";

const suggestions = [
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

export default function AISearch() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % suggestions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    track("ai_search", { query: searchQuery, source: "ai-search-section" });

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (
          res.status === 500 &&
          data.error === "MISTRAL_API_KEY not configured"
        ) {
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

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Work Experience":
        return <Briefcase size={12} />;
      case "Leadership":
        return <Users size={12} />;
      case "Education":
        return <GraduationCap size={12} />;
      default:
        return <Briefcase size={12} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Work Experience":
        return "text-accent bg-accent/10 border-accent/20";
      case "Leadership":
        return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "Education":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      default:
        return "text-accent bg-accent/10 border-accent/20";
    }
  };

  const hasRelatedItems =
    result &&
    (result.relatedProjects.length > 0 ||
      result.relatedExperiences.length > 0);

  return (
    <section id="ai-search" className="py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full mb-6">
            <Sparkles size={14} className="text-accent" />
            <span className="text-xs font-mono text-accent">
              AI-Powered Search
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Ask me anything
          </h2>
          <p className="mt-4 text-muted text-lg">
            An AI search interface to explore my projects, skills, and
            experience. Powered by Mistral AI over my entire portfolio.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`relative border rounded-2xl transition-all duration-300 ${
            isFocused
              ? "border-accent/50 shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]"
              : "border-border"
          }`}
        >
          <div className="flex items-center gap-3 px-5 py-4">
            {isLoading ? (
              <Loader2
                size={20}
                className="text-accent shrink-0 animate-spin"
              />
            ) : (
              <Search size={20} className="text-muted shrink-0" />
            )}
            <label htmlFor="ai-search-input" className="sr-only">
              Search the portfolio
            </label>
            <input
              id="ai-search-input"
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={suggestions[placeholderIndex]}
              disabled={isLoading}
              className="flex-1 bg-transparent text-foreground placeholder:text-muted/50 outline-none text-base disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="p-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.form>

        {/* Suggestions */}
        {!result && !isLoading && !error && (
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {suggestions.slice(0, 3).map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestionClick(s)}
                className="px-3 py-1.5 text-xs text-muted bg-surface border border-border rounded-full hover:border-accent/30 hover:text-foreground transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-xl text-sm text-red-400"
            >
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 space-y-3"
            >
              <div className="flex items-center gap-2 text-xs text-muted font-mono">
                <Sparkles size={14} className="text-accent animate-pulse" />
                <span>Searching portfolio with AI...</span>
              </div>
              <div className="p-5 bg-surface border border-border rounded-xl space-y-3 animate-pulse">
                <div className="h-4 bg-border/50 rounded w-3/4" />
                <div className="h-3 bg-border/50 rounded w-full" />
                <div className="h-3 bg-border/50 rounded w-5/6" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real Results */}
        <AnimatePresence>
          {result && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 space-y-4"
            >
              {/* AI Answer */}
              <div className="p-5 bg-surface border border-border rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={14} className="text-accent" />
                  <span className="text-xs font-mono text-accent">
                    AI Answer
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-mono bg-accent/10 text-accent rounded-full ml-auto">
                    {result.type}
                  </span>
                </div>
                <p className="text-foreground leading-relaxed text-sm">
                  {result.answer}
                </p>

                {/* Follow-up questions */}
                {result.followUpQuestions?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-[10px] font-mono text-muted mb-2 uppercase tracking-wider">
                      Follow-up
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.followUpQuestions.map((q) => (
                        <button
                          key={q}
                          onClick={() => {
                            setQuery(q);
                            handleSearch(q);
                          }}
                          className="px-3 py-1.5 text-xs text-muted bg-background border border-border rounded-full hover:border-accent/40 hover:text-foreground transition-all text-left"
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
                <div className="flex items-center gap-2 text-xs text-muted font-mono">
                  <MessageSquare size={14} />
                  <span>
                    {result.relatedProjects.length +
                      result.relatedExperiences.length}{" "}
                    related item
                    {result.relatedProjects.length +
                      result.relatedExperiences.length >
                    1
                      ? "s"
                      : ""}
                  </span>
                </div>
              )}

              {/* Related Experiences */}
              {result.relatedExperiences.length > 0 && (
                <div className="space-y-3">
                  {result.relatedExperiences.map((exp, i) => {
                    const colorClass = getCategoryColor(exp.category);
                    const inner = (
                      <>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono border rounded-full ${colorClass}`}
                          >
                            {getCategoryIcon(exp.category)} {exp.category}
                          </span>
                          <span className="font-mono text-xs text-muted">
                            {exp.period}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-semibold text-sm">{exp.role}</h4>
                          {exp.hasPage && (
                            <ArrowUpRight
                              size={12}
                              className="text-muted group-hover:text-accent transition-colors shrink-0"
                            />
                          )}
                        </div>
                        <p className="text-accent text-xs font-medium mt-0.5">
                          {exp.company}
                        </p>
                        <p className="text-xs text-muted leading-relaxed mt-2">
                          {exp.tagline}
                        </p>
                      </>
                    );

                    if (exp.hasPage) {
                      return (
                        <Link
                          key={exp.slug}
                          href={`/experience/${exp.slug}`}
                          scroll
                          className="group block"
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-4 bg-surface border border-border rounded-xl hover:border-accent/20 transition-colors"
                          >
                            {inner}
                          </motion.div>
                        </Link>
                      );
                    }

                    return (
                      <motion.div
                        key={exp.slug}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 bg-surface border border-border rounded-xl"
                      >
                        {inner}
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Related Projects */}
              {result.relatedProjects.length > 0 && (
                <div className="space-y-3">
                  {result.relatedProjects.map((project, i) => (
                    <Link
                      key={project.slug}
                      href={`/projects/${project.slug}`}
                      scroll
                      className="group block"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay:
                            (result.relatedExperiences.length + i) * 0.1,
                        }}
                        className="p-4 bg-surface border border-border rounded-xl hover:border-accent/20 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-xs text-accent">
                            {project.company}
                          </span>
                          {project.badge === "Winner" && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full">
                              <Trophy size={10} /> Winner
                            </span>
                          )}
                          {project.badge === "Finalist" && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-full">
                              <Award size={10} /> Finalist
                            </span>
                          )}
                          {project.badge === "2nd Place" && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono bg-zinc-400/10 text-zinc-400 border border-zinc-400/20 rounded-full">
                              <Award size={10} /> 2nd Place
                            </span>
                          )}
                          {project.badge === "Honorable Mention" && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                              <Award size={10} /> Mention
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-sm mb-1">
                          {project.title}
                        </h4>
                        <p className="text-xs text-muted leading-relaxed">
                          {project.tagline}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-[10px] font-mono bg-background border border-border rounded-full text-muted"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Search again */}
              <div className="text-center pt-2">
                <button
                  onClick={() => {
                    setResult(null);
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="text-xs text-muted hover:text-accent transition-colors font-mono"
                >
                  Ask another question →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
