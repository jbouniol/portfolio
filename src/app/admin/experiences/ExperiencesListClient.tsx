"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Briefcase, Users, ShieldCheck, Pencil } from "lucide-react";
import type { Experience } from "@/data/experiences";

export default function ExperiencesListClient({
  experiences,
}: {
  experiences: Experience[];
}) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "work" | "leadership">("all");

  const filtered = experiences.filter((e) => {
    const matchesSearch =
      !search ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      e.company.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || e.type === filterType;
    return matchesSearch && matchesType;
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
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search experiences..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as "all" | "work" | "leadership")}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50"
        >
          <option value="all">All Types</option>
          <option value="work">Work Experience</option>
          <option value="leadership">Leadership</option>
        </select>
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
