"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Zap,
  Target,
  Cog,
  Search,
  Dumbbell,
  Clapperboard,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const values = [
  {
    icon: Zap,
    title: "Action Over Theory",
    description:
      "I don't wait for things to happen — I make them happen. Whether it's a hackathon prototype at 3 AM or an automation that saves hours of manual work, I bias toward doing.",
  },
  {
    icon: Target,
    title: "Real Impact",
    description:
      "Every project I take on must matter. I need my work to change something tangible — a process improved, a decision informed, a problem solved.",
  },
  {
    icon: Search,
    title: "Systematic Thinking",
    description:
      "When facing a problem, I step back and examine the full process. Find the bottleneck, understand the root cause, then fix it. Analytical and methodical, always.",
  },
  {
    icon: Cog,
    title: "Automate the Boring",
    description:
      "If a task is repetitive and can be automated, it should be. I build tools and systems so I can focus on what actually requires human judgment.",
  },
];

const interests = [
  {
    icon: Dumbbell,
    title: "Weightlifting",
    description:
      "3+ sessions a week, no exceptions. Discipline and consistency in the gym translate directly into how I approach work.",
  },
  {
    icon: Clapperboard,
    title: "Cinema",
    description:
      "Deeply interested in filmmaking — from directing to storytelling. I love how great films distill complex ideas into something everyone can feel.",
  },
  {
    icon: BookOpen,
    title: "Atomic Habits",
    description:
      "This book reshaped how I organize everything. Systems over goals, small improvements compounding over time — it's how I track my projects and daily routines.",
  },
];

const traits = [
  { label: "Curious", detail: "Follows AI & econ news daily" },
  { label: "Organized", detail: "Notion & Calendar for everything" },
  { label: "Resourceful", detail: "Adapts fast when plans change" },
  { label: "Detail-Oriented", detail: "Spots errors others miss" },
];

export default function AboutContent() {
  return (
    <>
      <Navigation />

      <main id="main-content" className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-12"
            >
              <ArrowLeft size={14} />
              Back to home
            </Link>
          </motion.div>

          {/* Hero */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-5 mb-12"
          >
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-border shrink-0">
              <Image
                src="/jonathanbouniol.png"
                alt="Jonathan Bouniol"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                Jonathan Bouniol
              </h1>
              <p className="text-muted mt-1">
                Builder, problem-solver, impact-driven.
              </p>
            </div>
          </motion.div>

          {/* Intro */}
          <motion.section
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <p className="text-lg text-muted leading-relaxed">
              I&apos;m not the type of student who just shows up to class and
              turns in assignments.{" "}
              <span className="text-foreground font-medium">
                I need to build, to get involved, to have an impact.
              </span>{" "}
              Studying Data & AI at{" "}
              <span className="text-foreground">Mines Paris PSL</span> and{" "}
              <span className="text-foreground">Albert School</span>, I&apos;ve
              worked across 10+ industries — from luxury goods to defense — always
              at the intersection of data, AI, and business strategy.
            </p>
            <p className="text-lg text-muted leading-relaxed mt-4">
              I want to discover as many sectors and roles as possible to build a
              global perspective. Every new problem is a chance to learn something
              fundamental about how businesses actually work — and how data can
              make them work better.
            </p>
          </motion.section>

          {/* Philosophy */}
          <motion.section
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16"
          >
            <p className="font-mono text-sm text-accent mb-3">Philosophy</p>
            <h2 className="text-2xl font-semibold tracking-tight mb-8">
              How I think & work
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {values.map((item) => (
                <div
                  key={item.title}
                  className="p-5 border border-border rounded-xl hover:border-accent/30 transition-colors"
                >
                  <item.icon
                    size={20}
                    className="text-accent mb-3"
                    strokeWidth={1.5}
                  />
                  <h3 className="font-medium mb-2">{item.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Beyond Work */}
          <motion.section
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <p className="font-mono text-sm text-accent mb-3">Beyond work</p>
            <h2 className="text-2xl font-semibold tracking-tight mb-8">
              What I&apos;m into
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {interests.map((item) => (
                <div
                  key={item.title}
                  className="p-5 border border-border rounded-xl hover:border-accent/30 transition-colors"
                >
                  <item.icon
                    size={20}
                    className="text-accent mb-3"
                    strokeWidth={1.5}
                  />
                  <h3 className="font-medium mb-2">{item.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Traits */}
          <motion.section
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-16"
          >
            <p className="font-mono text-sm text-accent mb-3">In a nutshell</p>
            <h2 className="text-2xl font-semibold tracking-tight mb-8">
              How people describe me
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {traits.map((trait) => (
                <div
                  key={trait.label}
                  className="text-center p-4 border border-border rounded-xl"
                >
                  <p className="font-medium text-foreground">{trait.label}</p>
                  <p className="text-xs text-muted mt-1">{trait.detail}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* FAQ */}
          <motion.section
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mb-16"
          >
            <p className="font-mono text-sm text-accent mb-3">Quick answers</p>
            <h2 className="text-2xl font-semibold tracking-tight mb-8">
              Frequently asked
            </h2>
            <div className="space-y-5">
              {[
                {
                  q: "Who is Jonathan Bouniol?",
                  a: "Jonathan Bouniol is a French Data & AI student at Mines Paris PSL and Albert School in Paris. He specializes in data engineering, AI systems, and business strategy, with experience across 10+ industries including luxury goods, finance, logistics, and defense.",
                },
                {
                  q: "What does Jonathan Bouniol study?",
                  a: "Jonathan is pursuing a joint MSc in Data & AI for Business at Mines Paris PSL × Albert School (2025–2027), following a Bachelor in Business & Data at Albert School × Mines Paris PSL (2023–2025). Albert School is Europe's first data-centric business school.",
                },
                {
                  q: "What has Jonathan Bouniol worked on?",
                  a: "18+ projects spanning Business Deep Dives (Louis Vuitton, BNP Paribas, CMA-CGM…), hackathons (multiple podiums), consulting missions, and AI tooling. He has built RAG systems, automation pipelines, predictive models, and data dashboards across real-world mandates.",
                },
                {
                  q: "How to contact Jonathan Bouniol?",
                  a: "By email at jbouniol@albertschool.com, on LinkedIn at linkedin.com/in/jonathanbouniol, or via the contact section of this site.",
                },
              ].map(({ q, a }) => (
                <div key={q} className="border border-border rounded-xl p-5">
                  <p className="font-medium text-foreground mb-2">{q}</p>
                  <p className="text-sm text-muted leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* CTA */}
          <motion.section
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center py-12 border-t border-border"
          >
            <h2 className="text-2xl font-semibold tracking-tight mb-3">
              Want to work together?
            </h2>
            <p className="text-muted mb-8">
              I&apos;m looking for a Data/AI apprenticeship from September 2025.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/#contact"
                className="px-6 py-3 bg-foreground text-background text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Get in Touch
              </Link>
              <Link
                href="/#projects"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border text-sm font-medium rounded-lg hover:bg-surface transition-colors"
              >
                View Projects
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </>
  );
}
