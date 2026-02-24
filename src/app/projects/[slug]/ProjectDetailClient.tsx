"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
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
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState } from "react";

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

export default function ProjectDetailClient({
  project,
}: {
  project: Project;
}) {
  const [showCanva, setShowCanva] = useState(false);

  return (
    <>
      <Navigation />
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <motion.a
            href="/#projects"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-12"
          >
            <ArrowLeft size={16} />
            Back to projects
          </motion.a>

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
              {project.badge === "Winner" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full">
                  <Trophy size={10} /> Winner
                </span>
              )}
              {project.badge === "Finalist" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-full">
                  <Award size={10} /> Finalist
                </span>
              )}
              {project.badge === "2nd Place" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono bg-zinc-400/10 text-zinc-400 border border-zinc-400/20 rounded-full">
                  <Award size={10} /> 2nd Place
                </span>
              )}
              {project.badge === "Honorable Mention" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  <Award size={10} /> Honorable Mention
                </span>
              )}
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
                  title={`${project.title} presentation`}
                />
              </div>
            </motion.div>
          )}

          {/* Divider */}
          <div className="my-12 border-t border-border" />

          {/* Case Study Sections */}
          <div className="space-y-10">
            {sectionConfig.map((section, i) => (
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
                <p className="text-foreground leading-relaxed pl-8">
                  {project[section.key]}
                </p>
              </motion.div>
            ))}
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

          {/* Next Project */}
          <div className="mt-20 pt-12 border-t border-border">
            <a
              href="/#projects"
              className="group inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
            >
              <ArrowLeft size={16} />
              View all projects
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
