"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Github,
  ShieldCheck,
  FileText,
  Database,
  Lightbulb,
  BarChart3,
  Target,
  Presentation,
  Trophy,
  Award,
  Clock,
  Users,
} from "lucide-react";
import type { Project } from "@/data/projects";
import { projects } from "@/data/projects";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLayoutEffect, useState } from "react";

const sectionConfig = [
  {
    key: "context" as const,
    label: "Business Context",
    icon: FileText,
  },
  {
    key: "problem" as const,
    label: "Strategic Problem",
    icon: Lightbulb,
  },
  {
    key: "data" as const,
    label: "Data Sources",
    icon: Database,
  },
  {
    key: "method" as const,
    label: "Methodology",
    icon: BarChart3,
  },
  {
    key: "result" as const,
    label: "Key Results",
    icon: Target,
  },
  {
    key: "impact" as const,
    label: "Business Impact",
    icon: Target,
  },
];

/**
 * Parse text that contains numbered steps (e.g. "1) ... 2) ..." or "1. ... 2. ...")
 * into an array of items. Returns null if no numbered pattern is found.
 */
function parseNumberedList(text: string): string[] | null {
  // Match patterns like "1) text" or "1. text" with at least 2 items
  const pattern = /(?:^|\s)(\d+)[.)]\s+/g;
  const matches = [...text.matchAll(pattern)];

  if (matches.length < 2) return null;

  const items: string[] = [];
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index! + matches[i][0].indexOf(matches[i][1]);
    const numberAndSep = matches[i][0].trimStart();
    const contentStart = start + numberAndSep.length;
    const end = i + 1 < matches.length ? matches[i + 1].index! : text.length;
    const item = text.slice(contentStart, end).trim();
    if (item) items.push(item);
  }

  return items.length >= 2 ? items : null;
}

function getProjectNavigation(currentProject: Project) {
  const sameCategory = projects.filter(
    (p) => p.category === currentProject.category
  );
  const idx = sameCategory.findIndex((p) => p.slug === currentProject.slug);

  const prev = idx > 0 ? sameCategory[idx - 1] : null;
  const next = idx < sameCategory.length - 1 ? sameCategory[idx + 1] : null;

  return { prev, next };
}

function getBadgeConfig(badge: string | undefined) {
  switch (badge) {
    case "Winner":
      return {
        icon: Trophy,
        label: "Winner",
        className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      };
    case "Finalist":
      return {
        icon: Award,
        label: "Finalist",
        className: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      };
    case "2nd Place":
      return {
        icon: Award,
        label: "2nd Place",
        className: "bg-zinc-400/10 text-zinc-400 border-zinc-400/20",
      };
    case "Honorable Mention":
      return {
        icon: Award,
        label: "Honorable Mention",
        className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      };
    default:
      return null;
  }
}

export default function ProjectDetailClient({
  project,
}: {
  project: Project;
}) {
  const [showCanva, setShowCanva] = useState(!!project.canvaEmbedUrl);
  const { prev, next } = getProjectNavigation(project);
  const badgeConfig = getBadgeConfig(project.badge);

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    window.scrollTo(0, 0);
    html.scrollTop = 0;
    body.scrollTop = 0;

    const frame = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      html.scrollTop = 0;
      body.scrollTop = 0;
      html.style.scrollBehavior = previousBehavior;
    });

    return () => {
      cancelAnimationFrame(frame);
      html.style.scrollBehavior = previousBehavior;
    };
  }, [project.slug]);

  return (
    <>
      <Navigation />
      <main id="main-content" className="pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-12"
          >
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to projects
            </motion.span>
          </Link>

          {/* Outcome Banner */}
          {badgeConfig && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border mb-8 ${badgeConfig.className}`}
            >
              <badgeConfig.icon size={20} strokeWidth={1.5} />
              <div>
                <p className="font-mono text-sm font-medium">
                  {badgeConfig.label}
                </p>
                <p className="text-xs opacity-80 mt-0.5">
                  {project.duration} &middot; {project.company} &middot;{" "}
                  {project.year}
                </p>
              </div>
            </motion.div>
          )}

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="font-mono text-sm text-accent">
                {project.company}
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-xs text-muted">
                <Clock size={12} /> {project.duration}
              </span>
              {project.isNDA && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono bg-red-500/10 text-red-400 border border-red-500/20 rounded-full">
                  <ShieldCheck size={10} /> NDA
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              {project.title}
            </h1>

            <p className="mt-4 text-lg text-muted leading-relaxed">
              {project.tagline}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-mono bg-surface border border-border rounded-full text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            {project.canvaEmbedUrl && (
              <button
                onClick={() => setShowCanva(!showCanva)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors"
              >
                <Presentation size={16} />
                {showCanva ? "Hide Deck" : "View Deck"}
              </button>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-border text-sm font-medium rounded-lg hover:border-accent/30 hover:text-accent transition-all"
              >
                <Github size={16} />
                Explore Code
                <ExternalLink size={12} />
              </a>
            )}

            {project.isNDA && (
              <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface border border-border text-sm text-muted rounded-lg cursor-default">
                <ShieldCheck size={16} />
                Under NDA
              </span>
            )}

            {project.isPrivate && !project.isNDA && (
              <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface border border-border text-sm text-muted rounded-lg cursor-default">
                <ShieldCheck size={16} />
                Private
              </span>
            )}
          </motion.div>

          {/* Canva Embed */}
          {showCanva && project.canvaEmbedUrl && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 rounded-xl overflow-hidden border border-border"
            >
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  src={project.canvaEmbedUrl}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                  loading="lazy"
                  title={`${project.title} presentation`}
                />
              </div>
            </motion.div>
          )}

          {/* Divider */}
          <div className="my-12 border-t border-border" />

          {/* Case Study Sections */}
          <div className="space-y-10">
            {sectionConfig.map((section, i) => {
              const content = project[section.key];
              const listItems =
                section.key === "method" || section.key === "result"
                  ? parseNumberedList(content)
                  : null;

              return (
                <motion.div
                  key={section.key}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <section.icon
                      size={18}
                      className="text-accent"
                      strokeWidth={1.5}
                    />
                    <h2 className="text-sm font-mono text-accent uppercase tracking-wider">
                      {section.label}
                    </h2>
                  </div>
                  {listItems ? (
                    <ol className="pl-8 space-y-3">
                      {listItems.map((item, j) => (
                        <li
                          key={j}
                          className="text-foreground leading-relaxed flex gap-3"
                        >
                          <span className="text-accent font-mono text-sm shrink-0 mt-0.5">
                            {j + 1}.
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-foreground leading-relaxed pl-8">
                      {content}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Contributors */}
          {project.contributors && project.contributors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="mt-12 pt-10 border-t border-border"
            >
              <div className="flex items-center gap-3 mb-4">
                <Users
                  size={18}
                  className="text-accent"
                  strokeWidth={1.5}
                />
                <h2 className="text-sm font-mono text-accent uppercase tracking-wider">
                  Contributors
                </h2>
              </div>
              <div className="flex flex-wrap gap-2 pl-8">
                {project.contributors.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-surface border border-border rounded-full text-foreground"
                  >
                    <span className="w-5 h-5 rounded-full bg-accent/20 text-accent text-[10px] font-mono flex items-center justify-center shrink-0">
                      {name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                    {name}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Project Navigation */}
          <div className="mt-20 pt-12 border-t border-border">
            <div className="flex items-center justify-between">
              {prev ? (
                <Link
                  href={`/projects/${prev.slug}`}
                  scroll
                  className="group flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
                >
                  <ArrowLeft size={16} />
                  <div>
                    <span className="text-xs font-mono block opacity-60">
                      Previous
                    </span>
                    <span className="group-hover:text-accent transition-colors">
                      {prev.title}
                    </span>
                  </div>
                </Link>
              ) : (
                <Link
                  href="/#projects"
                  className="group inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
                >
                  <ArrowLeft size={16} />
                  All projects
                </Link>
              )}

              {next ? (
                <Link
                  href={`/projects/${next.slug}`}
                  scroll
                  className="group flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors text-right"
                >
                  <div>
                    <span className="text-xs font-mono block opacity-60">
                      Next
                    </span>
                    <span className="group-hover:text-accent transition-colors">
                      {next.title}
                    </span>
                  </div>
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <Link
                  href="/#projects"
                  className="group inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
                >
                  All projects
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
