"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Trophy,
  Award,
  ShieldCheck,
  ArrowUpRight,
  Pencil,
} from "lucide-react";
import type { Project, ProjectCategory } from "@/data/projects";

const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  bdd: "Business Deep Dive",
  hackathon: "Hackathon",
  consulting: "Consulting",
  school: "School Project",
};

export default function ProjectsListClient({
  projects,
}: {
  projects: Project[];
}) {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<
    ProjectCategory | "all"
  >("all");

  const filtered = projects.filter((p) => {
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.company.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory =
      filterCategory === "all" || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {projects.length} projects in your portfolio
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 transition-all"
        >
          <Plus size={14} />
          New Project
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) =>
            setFilterCategory(e.target.value as ProjectCategory | "all")
          }
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50"
        >
          <option value="all">All Categories</option>
          {(Object.keys(CATEGORY_LABELS) as ProjectCategory[]).map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((project) => (
          <Link
            key={project.slug}
            href={`/admin/projects/${project.slug}`}
            className="group flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs text-blue-400">
                  {project.company}
                </span>
                <span className="text-zinc-700">·</span>
                <span className="text-xs text-zinc-500">
                  {CATEGORY_LABELS[project.category]}
                </span>
                {project.badge === "Winner" && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono bg-amber-500/10 text-amber-500 rounded-full">
                    <Trophy size={8} /> Winner
                  </span>
                )}
                {project.badge === "Finalist" && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono bg-purple-500/10 text-purple-500 rounded-full">
                    <Award size={8} /> Finalist
                  </span>
                )}
                {project.badge === "2nd Place" && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono bg-zinc-500/10 text-zinc-400 rounded-full">
                    <Award size={8} /> 2nd
                  </span>
                )}
                {project.isNDA && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono bg-red-500/10 text-red-400 rounded-full">
                    <ShieldCheck size={8} /> NDA
                  </span>
                )}
              </div>
              <p className="text-sm font-medium mt-1 truncate">
                {project.title}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5 truncate">
                {project.tagline}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-mono text-zinc-600">
                {project.updatedAt}
              </span>
              <Pencil
                size={14}
                className="text-zinc-600 group-hover:text-blue-500 transition-colors"
              />
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-zinc-500 text-sm">
            No projects found
          </div>
        )}
      </div>
    </div>
  );
}
