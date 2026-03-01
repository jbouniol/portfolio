"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Trophy, Award, ShieldCheck, Pencil } from "lucide-react";
import type { Project, ProjectCategory } from "@/data/projects";
import {
  AdminSearchFilter,
  AdminSelectFilter,
} from "@/app/admin/_components/AdminListFilters";

const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  bdd: "Business Deep Dive",
  hackathon: "Hackathon",
  consulting: "Consulting",
  school: "School Project",
};

const STATUS_FILTER_OPTIONS: Array<{
  value: "all" | "draft" | "published";
  label: string;
}> = [
  { value: "all", label: "All Statuses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

const GAP_FILTER_OPTIONS: Array<{
  value: "all" | "missing-links" | "missing-core" | "missing-tags";
  label: string;
}> = [
  { value: "all", label: "All Quality" },
  { value: "missing-links", label: "Missing Links" },
  { value: "missing-core", label: "Missing Core Content" },
  { value: "missing-tags", label: "Missing Tags" },
];

type ProjectFilters = {
  query: string;
  category: ProjectCategory | "all";
  status: "all" | "draft" | "published";
  gap: "all" | "missing-links" | "missing-core" | "missing-tags";
};

function readFiltersFromUrl(): ProjectFilters {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q") ?? "";
  const category = params.get("category");
  const status = params.get("status");
  const gap = params.get("gap");

  const normalizedCategory =
    category && (Object.keys(CATEGORY_LABELS) as string[]).includes(category)
      ? (category as ProjectCategory)
      : "all";
  const normalizedStatus =
    status === "draft" || status === "published" || status === "all"
      ? status
      : "all";
  const normalizedGap =
    gap === "missing-links" ||
    gap === "missing-core" ||
    gap === "missing-tags" ||
    gap === "all"
      ? gap
      : "all";

  return {
    query,
    category: normalizedCategory,
    status: normalizedStatus,
    gap: normalizedGap,
  };
}

export default function ProjectsListClient({
  projects,
}: {
  projects: Project[];
}) {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<ProjectCategory | "all">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "published">(
    "all"
  );
  const [filterGap, setFilterGap] = useState<
    "all" | "missing-links" | "missing-core" | "missing-tags"
  >("all");
  const categoryFilterOptions = useMemo<
    Array<{ value: ProjectCategory | "all"; label: string }>
  >(
    () => [
      { value: "all", label: "All Categories" },
      ...(Object.keys(CATEGORY_LABELS) as ProjectCategory[]).map((cat) => ({
        value: cat,
        label: CATEGORY_LABELS[cat],
      })),
    ],
    []
  );

  useEffect(() => {
    function applyFiltersFromUrl() {
      const next = readFiltersFromUrl();
      setSearch(next.query);
      setFilterCategory(next.category);
      setFilterStatus(next.status);
      setFilterGap(next.gap);
    }

    applyFiltersFromUrl();
    window.addEventListener("popstate", applyFiltersFromUrl);
    return () => window.removeEventListener("popstate", applyFiltersFromUrl);
  }, []);

  const filtered = projects.filter((p) => {
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.company.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory =
      filterCategory === "all" || p.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || (p.status ?? "published") === filterStatus;
    const matchesGap =
      filterGap === "all"
        ? true
        : filterGap === "missing-links"
          ? !p.githubUrl || !p.canvaEmbedUrl
          : filterGap === "missing-core"
            ? !p.tagline || !p.result || !p.impact
            : p.tags.length === 0;
    return matchesSearch && matchesCategory && matchesStatus && matchesGap;
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
        <AdminSearchFilter
          value={search}
          onChange={setSearch}
          placeholder="Search projects..."
        />
        <AdminSelectFilter<ProjectCategory | "all">
          value={filterCategory}
          onChange={setFilterCategory}
          options={categoryFilterOptions}
        />
        <AdminSelectFilter<"all" | "draft" | "published">
          value={filterStatus}
          onChange={setFilterStatus}
          options={STATUS_FILTER_OPTIONS}
        />
        <AdminSelectFilter<"all" | "missing-links" | "missing-core" | "missing-tags">
          value={filterGap}
          onChange={setFilterGap}
          options={GAP_FILTER_OPTIONS}
        />
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
                {(project.status ?? "published") === "draft" && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono bg-zinc-700/40 text-zinc-300 rounded-full">
                    Draft
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
