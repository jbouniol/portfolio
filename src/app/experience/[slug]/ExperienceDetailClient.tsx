"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Wrench,
} from "lucide-react";
import type { Experience } from "@/data/experiences";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function ExperienceDetailClient({
  experience,
}: {
  experience: Experience;
}) {
  return (
    <>
      <Navigation />
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <motion.a
            href="/#experience"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-12"
          >
            <ArrowLeft size={16} />
            Back to experience
          </motion.a>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="font-mono text-sm text-accent">
                {experience.company}
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-xs text-muted">
                <Calendar size={12} /> {experience.period}
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-xs text-muted">
                <MapPin size={12} /> {experience.location}
              </span>
              {experience.isConfidential && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono bg-red-500/10 text-red-400 border border-red-500/20 rounded-full">
                  <ShieldCheck size={10} /> Classified
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              {experience.role}
            </h1>

            <p className="mt-4 text-lg text-muted leading-relaxed">
              {experience.tagline}
            </p>
          </motion.div>

          {/* Divider */}
          <div className="my-12 border-t border-border" />

          {/* About the role */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-sm font-mono text-accent uppercase tracking-wider mb-4">
              About the Role
            </h2>
            <p className="text-foreground leading-relaxed">
              {experience.description}
            </p>
          </motion.div>

          {/* Key Missions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10"
          >
            <h2 className="text-sm font-mono text-accent uppercase tracking-wider mb-4">
              {experience.isConfidential
                ? "Confidentiality Notice"
                : "Key Missions"}
            </h2>
            <div className="space-y-3">
              {experience.missions.map((mission, i) => (
                <div key={i} className="flex items-start gap-3">
                  {experience.isConfidential ? (
                    <ShieldCheck
                      size={16}
                      className="text-red-400 shrink-0 mt-0.5"
                    />
                  ) : (
                    <CheckCircle2
                      size={16}
                      className="text-accent shrink-0 mt-0.5"
                    />
                  )}
                  <p className="text-foreground text-sm leading-relaxed">
                    {mission}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tools & Stack */}
          {experience.tools && experience.tools.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-10"
            >
              <div className="flex items-center gap-2 mb-4">
                <Wrench size={14} className="text-accent" />
                <h2 className="text-sm font-mono text-accent uppercase tracking-wider">
                  Tools & Stack
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {experience.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1.5 text-xs font-mono bg-surface border border-border rounded-full text-foreground"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Back */}
          <div className="mt-20 pt-12 border-t border-border">
            <a
              href="/#experience"
              className="group inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
            >
              <ArrowLeft size={16} />
              View all experience
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
