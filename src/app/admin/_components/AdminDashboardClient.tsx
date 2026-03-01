"use client";

import Link from "next/link";
import {
  FolderKanban,
  Briefcase,
  Trophy,
  Award,
  Sparkles,
  MessageSquare,
  Database,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useState } from "react";

interface DashboardStats {
  totalProjects: number;
  totalExperiences: number;
  winners: number;
  podiums: number;
  categories: {
    bdd: number;
    hackathon: number;
    consulting: number;
    school: number;
  };
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
        setSeedResult(
          `✓ Seeded ${data.projects} projects and ${data.experiences} experiences`
        );
      } else {
        setSeedResult(`✗ ${data.error}`);
      }
    } catch {
      setSeedResult("✗ Network error");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Overview of your portfolio content
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
          href="/admin/ai-prefill"
          icon={Sparkles}
          title="AI Pre-fill"
          description="Describe a project and let AI fill the form"
        />
        <QuickAction
          href="/admin/chatbot"
          icon={MessageSquare}
          title="Personal Chatbot"
          description="Chat with AI about your portfolio"
        />
      </div>

      {/* Seed Database */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <Database size={16} className="text-zinc-400" />
          <h2 className="text-sm font-mono text-zinc-400">Database</h2>
        </div>
        <p className="text-xs text-zinc-500 mb-4">
          Seed the Redis database with data from your static TypeScript files.
          Use this for initial setup or to reset data.
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
            {seeding ? "Seeding..." : "Seed Database"}
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

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
}) {
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
