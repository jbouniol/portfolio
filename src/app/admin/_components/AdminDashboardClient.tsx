"use client";

import Link from "next/link";
import {
  FolderKanban,
  Briefcase,
  Trophy,
  Award,
  Database,
  Globe,
  Layers,
  ArrowRight,
  Loader2,
  Cloud,
  ExternalLink,
} from "lucide-react";
import { useState, useMemo } from "react";

interface DashboardStats {
  totalProjects: number;
  totalExperiences: number;
  publishedProjects: number;
  publishedExperiences: number;
  draftProjects: number;
  draftExperiences: number;
  ndaProjects: number;
  confidentialExperiences: number;
  winners: number;
  podiums: number;
  categories: {
    bdd: number;
    hackathon: number;
    consulting: number;
    school: number;
  };
  latestProject: {
    slug: string;
    title: string;
    updatedAt: string;
    status: "draft" | "published";
  } | null;
  latestExperience: {
    slug: string;
    role: string;
    updatedAt: string;
    status: "draft" | "published";
  } | null;
  lastUpdatedProject: string;
  lastUpdatedExperience: string;
}

export default function AdminDashboardClient({
  stats,
}: {
  stats: DashboardStats;
}) {
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  async function handleSeed() {
    setSeeding(true);
    setSeedResult(null);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSeedResult(`✓ ${data.message}`);
      } else {
        setSeedResult(`✗ ${data.error}`);
      }
    } catch {
      setSeedResult("✗ Network error");
    } finally {
      setSeeding(false);
    }
  }

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonne soirée";
  }, []);

  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          {greeting} Jonathan
        </h1>
        <p className="text-zinc-500 text-sm mt-1 capitalize">
          {todayFormatted}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard
          icon={FolderKanban}
          value={stats.totalProjects}
          label="Projects"
          accent="text-blue-500"
        />
        <StatCard
          icon={Briefcase}
          value={stats.totalExperiences}
          label="Experiences"
          accent="text-emerald-500"
        />
        <StatCard
          icon={FolderKanban}
          value={stats.draftProjects}
          label="Draft Projects"
          accent="text-zinc-300"
        />
        <StatCard
          icon={Briefcase}
          value={stats.draftExperiences}
          label="Draft Exp."
          accent="text-zinc-300"
        />
        <StatCard
          icon={Trophy}
          value={stats.winners}
          label="Wins"
          accent="text-amber-500"
        />
        <StatCard
          icon={Award}
          value={stats.podiums}
          label="Podiums"
          accent="text-purple-500"
        />
      </div>

      {/* Category breakdown */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-8">
        <h2 className="text-sm font-mono text-zinc-400 mb-4">
          Projects by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Business Deep Dives",
              count: stats.categories.bdd,
              color: "text-blue-400",
            },
            {
              label: "Hackathons",
              count: stats.categories.hackathon,
              color: "text-amber-400",
            },
            {
              label: "Consulting",
              count: stats.categories.consulting,
              color: "text-emerald-400",
            },
            {
              label: "School",
              count: stats.categories.school,
              color: "text-purple-400",
            },
          ].map((cat) => (
            <div key={cat.label} className="text-center">
              <p className={`text-2xl font-semibold ${cat.color}`}>
                {cat.count}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">{cat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Last edited shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <LatestEditCard
          label="Latest Project"
          href={
            stats.latestProject
              ? `/admin/projects/${stats.latestProject.slug}`
              : "/admin/projects"
          }
          title={stats.latestProject?.title ?? "No project yet"}
          updatedAt={stats.latestProject?.updatedAt ?? "—"}
          status={stats.latestProject?.status}
          icon={FolderKanban}
          accent="text-blue-400"
        />
        <LatestEditCard
          label="Latest Experience"
          href={
            stats.latestExperience
              ? `/admin/experiences/${stats.latestExperience.slug}`
              : "/admin/experiences"
          }
          title={stats.latestExperience?.role ?? "No experience yet"}
          updatedAt={stats.latestExperience?.updatedAt ?? "—"}
          status={stats.latestExperience?.status}
          icon={Briefcase}
          accent="text-emerald-400"
        />
      </div>

      {/* Portfolio Control Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <QuickAction
          href="/admin/projects/new"
          icon={FolderKanban}
          title="New Project"
          description="Add a new project to your portfolio"
        />
        <QuickAction
          href="/admin/experiences/new"
          icon={Briefcase}
          title="New Experience"
          description="Add a new work experience"
        />
        <QuickAction
          href="/admin/projects"
          icon={FolderKanban}
          title="Manage Projects"
          description="Edit, duplicate, and maintain your project library"
        />
        <QuickAction
          href="/admin/experiences"
          icon={Layers}
          title="Manage Experiences"
          description="Maintain professional and leadership entries"
        />
        <QuickAction
          href="/admin/projects?status=draft"
          icon={FolderKanban}
          title="Draft Projects"
          description="Open only projects that still need publication"
        />
        <QuickAction
          href="/admin/experiences?status=draft"
          icon={Briefcase}
          title="Draft Experiences"
          description="Open only experiences waiting for publication"
        />
        <QuickAction
          href="https://vercel.com/jbouniols-projects/portfolio"
          icon={Cloud}
          title="Vercel Panel"
          description="Open deployment, logs, env vars and domains"
          external
        />
        <QuickAction
          href="/"
          icon={Globe}
          title="Preview Site"
          description="Open your public homepage in a new tab"
          external
        />
      </div>

      {/* Seed Database */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <Database size={16} className="text-zinc-400" />
          <h2 className="text-sm font-mono text-zinc-400">Database</h2>
        </div>
        <p className="text-xs text-zinc-500 mb-4">
          Sync imports missing local defaults (`src/data/*`) into KV without overwriting existing content.
          Daily admin edits are already persisted automatically in KV.
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-sm rounded-lg transition-colors flex items-center gap-2"
          >
            {seeding ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Database size={14} />
            )}
            {seeding ? "Syncing..." : "Sync Defaults"}
          </button>
          {seedResult && (
            <p
              className={`text-xs font-mono ${
                seedResult.startsWith("✓")
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {seedResult}
            </p>
          )}
        </div>
        <div className="mt-3 flex gap-4 text-[10px] font-mono text-zinc-600">
          <span>Last project update: {stats.lastUpdatedProject}</span>
          <span>Last experience update: {stats.lastUpdatedExperience}</span>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  accent,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: number;
  label: string;
  accent: string;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <Icon size={16} className={`${accent} mb-2`} />
      <p className={`text-2xl font-semibold ${accent}`}>{value}</p>
      <p className="text-xs text-zinc-500 font-mono mt-0.5">{label}</p>
    </div>
  );
}

function LatestEditCard({
  label,
  href,
  title,
  updatedAt,
  status,
  icon: Icon,
  accent,
}: {
  label: string;
  href: string;
  title: string;
  updatedAt: string;
  status?: "draft" | "published";
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="group bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-all"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-mono text-zinc-500">{label}</p>
        <Icon size={14} className={accent} />
      </div>
      <p className="text-sm font-medium truncate">{title}</p>
      <div className="mt-2 flex items-center gap-2 text-[10px] font-mono">
        <span className="text-zinc-600">Updated {updatedAt}</span>
        {status && (
          <span
            className={`px-1.5 py-0.5 rounded-full ${
              status === "draft"
                ? "bg-zinc-700/50 text-zinc-300"
                : "bg-emerald-500/10 text-emerald-400"
            }`}
          >
            {status}
          </span>
        )}
      </div>
    </Link>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
  external,
}: {
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  external?: boolean;
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all"
      >
        <Icon size={18} className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
        <div className="flex-1">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-zinc-500">{description}</p>
        </div>
        <ExternalLink
          size={14}
          className="text-zinc-600 group-hover:text-blue-500 transition-colors"
        />
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="group flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all"
    >
      <Icon size={18} className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>
      <ArrowRight
        size={14}
        className="text-zinc-600 group-hover:text-blue-500 transition-colors"
      />
    </Link>
  );
}
