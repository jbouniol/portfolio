"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Briefcase, Users, ShieldCheck, Pencil } from "lucide-react";
import type { Experience } from "@/data/experiences";
import {
  AdminSearchFilter,
  AdminSelectFilter,
} from "@/app/admin/_components/AdminListFilters";

const TYPE_FILTER_OPTIONS: Array<{
  value: "all" | "work" | "leadership";
  label: string;
}> = [
  { value: "all", label: "All Types" },
  { value: "work", label: "Work Experience" },
  { value: "leadership", label: "Leadership" },
];

const STATUS_FILTER_OPTIONS: Array<{
  value: "all" | "draft" | "published";
  label: string;
}> = [
  { value: "all", label: "All Statuses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

const GAP_FILTER_OPTIONS: Array<{
  value: "all" | "missing-tools" | "missing-core" | "confidential";
  label: string;
}> = [
  { value: "all", label: "All Quality" },
  { value: "missing-tools", label: "Missing Tools" },
  { value: "missing-core", label: "Missing Core Content" },
  { value: "confidential", label: "Confidential Only" },
];

type ExperienceFilters = {
  query: string;
  type: "all" | "work" | "leadership";
  status: "all" | "draft" | "published";
  gap: "all" | "missing-tools" | "missing-core" | "confidential";
};

function readFiltersFromUrl(): ExperienceFilters {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q") ?? "";
  const type = params.get("type");
  const status = params.get("status");
  const gap = params.get("gap");

  const normalizedType =
    type === "work" || type === "leadership" || type === "all" ? type : "all";
  const normalizedStatus =
    status === "draft" || status === "published" || status === "all"
      ? status
      : "all";
  const normalizedGap =
    gap === "missing-tools" ||
    gap === "missing-core" ||
    gap === "confidential" ||
    gap === "all"
      ? gap
      : "all";

  return {
    query,
    type: normalizedType,
    status: normalizedStatus,
    gap: normalizedGap,
  };
}

export default function ExperiencesListClient({
  experiences,
}: {
  experiences: Experience[];
}) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "work" | "leadership">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "published">(
    "all"
  );
  const [filterGap, setFilterGap] = useState<
    "all" | "missing-tools" | "missing-core" | "confidential"
  >("all");

  useEffect(() => {
    function applyFiltersFromUrl() {
      const next = readFiltersFromUrl();
      setSearch(next.query);
      setFilterType(next.type);
      setFilterStatus(next.status);
      setFilterGap(next.gap);
    }

    applyFiltersFromUrl();
    window.addEventListener("popstate", applyFiltersFromUrl);
    return () => window.removeEventListener("popstate", applyFiltersFromUrl);
  }, []);

  const filtered = experiences.filter((e) => {
    const matchesSearch =
      !search ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      e.company.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || e.type === filterType;
    const matchesStatus =
      filterStatus === "all" || (e.status ?? "published") === filterStatus;
    const matchesGap =
      filterGap === "all"
        ? true
        : filterGap === "missing-tools"
          ? !e.tools || e.tools.length === 0
          : filterGap === "missing-core"
            ? !e.tagline || !e.description
            : Boolean(e.isConfidential);
    return matchesSearch && matchesType && matchesStatus && matchesGap;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Experiences</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {experiences.length} experiences in your portfolio
          </p>
        </div>
        <Link
          href="/admin/experiences/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 transition-all"
        >
          <Plus size={14} />
          New Experience
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <AdminSearchFilter
          value={search}
          onChange={setSearch}
          placeholder="Search experiences..."
        />
        <AdminSelectFilter<"all" | "work" | "leadership">
          value={filterType}
          onChange={setFilterType}
          options={TYPE_FILTER_OPTIONS}
        />
        <AdminSelectFilter<"all" | "draft" | "published">
          value={filterStatus}
          onChange={setFilterStatus}
          options={STATUS_FILTER_OPTIONS}
        />
        <AdminSelectFilter<"all" | "missing-tools" | "missing-core" | "confidential">
          value={filterGap}
          onChange={setFilterGap}
          options={GAP_FILTER_OPTIONS}
        />
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((exp) => (
          <Link
            key={exp.slug}
            href={`/admin/experiences/${exp.slug}`}
            className="group flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all"
          >
            <div className="p-2 bg-zinc-800 rounded-lg shrink-0">
              {exp.type === "work" ? (
                <Briefcase size={16} className="text-emerald-400" />
              ) : (
                <Users size={16} className="text-purple-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono ${exp.type === "work" ? "text-emerald-400" : "text-purple-400"}`}>
                  {exp.company}
                </span>
                {exp.isConfidential && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono bg-red-500/10 text-red-400 rounded-full">
                    <ShieldCheck size={8} /> Confidential
                  </span>
                )}
                {(exp.status ?? "published") === "draft" && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono bg-zinc-700/40 text-zinc-300 rounded-full">
                    Draft
                  </span>
                )}
              </div>
              <p className="text-sm font-medium mt-0.5">{exp.role}</p>
              <p className="text-xs text-zinc-500 mt-0.5">
                {exp.period} · {exp.location}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-mono text-zinc-600">
                {exp.updatedAt}
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
            No experiences found
          </div>
        )}
      </div>
    </div>
  );
}
