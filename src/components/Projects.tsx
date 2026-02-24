"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Trophy,
  Award,
  ShieldCheck,
  Rocket,
  Zap,
  Handshake,
} from "lucide-react";
import { projects, allTags, type ProjectTag } from "@/data/projects";

const bddProjects = projects.filter((p) => p.category === "bdd");
const hackathonProjects = projects.filter((p) => p.category === "hackathon");
const consultingProjects = projects.filter((p) => p.category === "consulting");
const schoolProjects = projects.filter((p) => p.category === "school");

function filterByTag<T extends { tags: ProjectTag[] }>(
  items: T[],
  tag: ProjectTag | "All"
): T[] {
  return tag === "All" ? items : items.filter((p) => p.tags.includes(tag));
}

export default function Projects() {
  const [activeTag, setActiveTag] = useState<ProjectTag | "All">("All");

  const filteredBDD = filterByTag(bddProjects, activeTag);
  const filteredHackathon = filterByTag(hackathonProjects, activeTag);
  const filteredConsulting = filterByTag(consultingProjects, activeTag);
  const filteredSchool = filterByTag(schoolProjects, activeTag);

  const totalFiltered =
    filteredBDD.length +
    filteredHackathon.length +
    filteredConsulting.length +
    filteredSchool.length;

  return (
    <section id="projects" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-sm text-accent mb-3">Portfolio</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Hackathons & Business Deep Dives
          </h2>
          <p className="mt-4 text-muted max-w-xl text-lg">
            Consulting case studies, hackathons, consulting missions, and school
            projects. From 3-day hackathons to 3-week deep dives.
          </p>
        </motion.div>

        {/* Tag Filter */}
        <div className="mt-10 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag("All")}
            className={`px-3 py-1.5 text-xs font-mono rounded-full border transition-all duration-200 ${
              activeTag === "All"
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted hover:text-foreground hover:border-foreground/30"
            }`}
          >
            All ({projects.length})
          </button>
          {allTags.map((tag) => {
            const count = projects.filter((p) => p.tags.includes(tag)).length;
            if (count === 0) return null;
            return (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3 py-1.5 text-xs font-mono rounded-full border transition-all duration-200 ${
                  activeTag === tag
                    ? "bg-foreground text-background border-foreground"
                    : "border-border text-muted hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* BDD Section */}
        {filteredBDD.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-sm font-mono text-muted uppercase tracking-wider">
                Business Deep Dives
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-accent/10 text-accent rounded-full">
                {filteredBDD.length}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredBDD.map((project, i) => (
                  <ProjectCard
                    key={project.slug}
                    project={project}
                    index={i}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Hackathon Section */}
        {filteredHackathon.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-2 mb-6">
              <Zap size={14} className="text-amber-400" />
              <h3 className="text-sm font-mono text-muted uppercase tracking-wider">
                Hackathons
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-500/10 text-amber-400 rounded-full">
                {filteredHackathon.length}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredHackathon.map((project, i) => (
                  <ProjectCard
                    key={project.slug}
                    project={project}
                    index={i}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Consulting Missions Section */}
        {filteredConsulting.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-2 mb-6">
              <Handshake size={14} className="text-emerald-400" />
              <h3 className="text-sm font-mono text-muted uppercase tracking-wider">
                Consulting Missions
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 rounded-full">
                {filteredConsulting.length}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredConsulting.map((project, i) => (
                  <ProjectCard
                    key={project.slug}
                    project={project}
                    index={i}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* School Projects Section */}
        {filteredSchool.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-2 mb-6">
              <Rocket size={14} className="text-purple-400" />
              <h3 className="text-sm font-mono text-muted uppercase tracking-wider">
                School Projects
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-purple-500/10 text-purple-400 rounded-full">
                {filteredSchool.length}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredSchool.map((project, i) => (
                  <ProjectCard
                    key={project.slug}
                    project={project}
                    index={i}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Empty state */}
        {totalFiltered === 0 && (
          <div className="mt-10 text-center py-12 text-muted font-mono text-sm">
            No projects match this filter.
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  return (
    <motion.a
      href={`/projects/${project.slug}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group block p-6 bg-surface border border-border rounded-xl hover:border-accent/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
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
          {project.isNDA && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono bg-red-500/10 text-red-400 border border-red-500/20 rounded-full">
              <ShieldCheck size={10} /> NDA
            </span>
          )}
        </div>
        <span className="font-mono text-xs text-muted">
          {project.duration}
        </span>
      </div>

      <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
        {project.title}
      </h3>

      <p className="text-sm text-muted leading-relaxed mb-4">
        {project.tagline}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[10px] font-mono bg-background border border-border rounded-full text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
        <ArrowUpRight
          size={16}
          className="text-muted group-hover:text-accent transition-colors shrink-0"
        />
      </div>
    </motion.a>
  );
}
