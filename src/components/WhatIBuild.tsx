"use client";

import { motion } from "framer-motion";
import { Database, Brain, BarChart3, Shield, Zap, Target } from "lucide-react";

const capabilities = [
  {
    icon: Database,
    title: "Data Engineering",
    description:
      "Structuring complex datasets, building pipelines, and creating data architectures that scale across enterprise systems.",
  },
  {
    icon: Brain,
    title: "AI for Business",
    description:
      "Applying machine learning and AI frameworks to real business problems — not demos, but deployed solutions with measurable impact.",
  },
  {
    icon: BarChart3,
    title: "Strategic Analytics",
    description:
      "Deep-dive analyses that connect data insights to C-level decisions. 18+ business cases across Fortune 500 companies.",
  },
  {
    icon: Shield,
    title: "Defense & Sovereign Tech",
    description:
      "Data structuring for sensitive environments. Experience with French Defense digital transformation and security-first architectures.",
  },
  {
    icon: Zap,
    title: "Automation",
    description:
      "Automating workflows, reporting pipelines, and operational processes. Reducing manual overhead by building systems that run themselves.",
  },
  {
    icon: Target,
    title: "Business Deep Dives",
    description:
      "Consulting-grade case studies. Problem definition, data analysis, strategic recommendations, and actionable frameworks.",
  },
];

export default function WhatIBuild() {
  return (
    <section id="work" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-sm text-accent mb-3">Capabilities</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            What I Actually Build
          </h2>
          <p className="mt-4 text-muted max-w-xl text-lg">
            Not buzzwords. Real systems, real analyses, real impact across
            industries from defense to luxury to finance.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group p-6 bg-surface border border-border rounded-xl hover:border-accent/30 transition-all duration-300"
            >
              <cap.icon
                size={20}
                className="text-accent mb-4"
                strokeWidth={1.5}
              />
              <h3 className="font-semibold text-lg mb-2">{cap.title}</h3>
              <p className="text-sm text-muted leading-relaxed">
                {cap.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
