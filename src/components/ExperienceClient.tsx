"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Briefcase, GraduationCap, Users, ArrowUpRight } from "lucide-react";
import type { Experience } from "@/data/experiences";

const education = [
  {
    period: "2026 — 2028",
    degree: "MSc Data & AI for Business",
    school: "Mines Paris PSL × Albert School",
    description:
      "Advanced joint diploma program combining data science, AI engineering, and business strategy at France's #2 engineering school.",
  },
  {
    period: "2023 — 2025",
    degree: "Bachelor Business & Data",
    school: "Albert School × Mines Paris PSL",
    description:
      "Europe's first data-centric business school. 12 Business Deep Dives with Louis Vuitton, BNP Paribas, Generali, Asmodee, and more. Joint diploma with Mines Paris PSL.",
  },
  {
    period: "2020 — 2023",
    degree: "Baccalaureat — High Honors",
    school: "Ecole Pascal",
    description:
      "Specialization in Mathematics and Social & Economic Sciences (SES), with advanced mathematics option (Maths Expertes).",
  },
];

interface TimelineItemProps {
  period: string;
  title: string;
  subtitle: string;
  description: string;
  slug?: string;
  dotColor: string;
  subtitleColor: string;
  basePath: string;
  index: number;
}

function TimelineItem({
  period,
  title,
  subtitle,
  description,
  slug,
  dotColor,
  subtitleColor,
  basePath,
  index,
}: TimelineItemProps) {
  const content = (
    <>
      <span className="font-mono text-xs text-muted block mb-1">{period}</span>
      <div className="flex items-center gap-1.5">
        <h4 className="font-semibold text-sm">{title}</h4>
        {slug && (
          <ArrowUpRight
            size={12}
            className="text-muted group-hover:text-accent transition-colors shrink-0"
          />
        )}
      </div>
      <p className={`${subtitleColor} text-sm font-medium mt-0.5`}>{subtitle}</p>
      <p className="text-muted text-xs leading-relaxed mt-2">{description}</p>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-8"
    >
      <div className={`absolute left-0 top-[10px] w-[7px] h-[7px] rounded-full ${dotColor}`} />
      {slug ? (
        <Link
          href={`${basePath}/${slug}`}
          scroll
          className="group block hover:bg-surface/50 -mx-3 -my-2 px-3 py-2 rounded-lg transition-colors"
        >
          {content}
        </Link>
      ) : (
        <div>{content}</div>
      )}
    </motion.div>
  );
}

export default function ExperienceClient({
  workExperience,
  leadership,
}: {
  workExperience: Experience[];
  leadership: Experience[];
}) {
  return (
    <section id="experience" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-sm text-accent mb-3">Background</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Experience & Education
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-10">
          {/* Work Experience */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Briefcase size={18} className="text-foreground" strokeWidth={1.5} />
              <h3 className="text-lg font-semibold">Experience</h3>
            </div>
            <div className="relative">
              <div className="absolute left-[3px] top-2 bottom-2 w-px bg-border" />
              <div className="space-y-10">
                {workExperience.map((exp, i) => (
                  <TimelineItem
                    key={exp.slug}
                    period={exp.period}
                    title={exp.role}
                    subtitle={exp.company}
                    description={exp.tagline}
                    slug={exp.slug}
                    dotColor="bg-foreground"
                    subtitleColor="text-accent"
                    basePath="/experience"
                    index={i}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Leadership & Involvement */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Users size={18} className="text-foreground" strokeWidth={1.5} />
              <h3 className="text-lg font-semibold">Leadership & Involvement</h3>
            </div>
            <div className="relative">
              <div className="absolute left-[3px] top-2 bottom-2 w-px bg-purple-500/30" />
              <div className="space-y-10">
                {leadership.map((item, i) => (
                  <TimelineItem
                    key={item.slug}
                    period={item.period}
                    title={item.role}
                    subtitle={item.company}
                    description={item.tagline}
                    slug={item.slug}
                    dotColor="bg-purple-500"
                    subtitleColor="text-purple-400"
                    basePath="/experience"
                    index={i}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Education */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <GraduationCap size={18} className="text-foreground" strokeWidth={1.5} />
              <h3 className="text-lg font-semibold">Education</h3>
            </div>
            <div className="relative">
              <div className="absolute left-[3px] top-2 bottom-2 w-px bg-accent/30" />
              <div className="space-y-10">
                {education.map((edu, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="relative pl-8"
                  >
                    <div className="absolute left-0 top-[10px] w-[7px] h-[7px] rounded-full bg-accent" />
                    <span className="font-mono text-xs text-muted block mb-1">
                      {edu.period}
                    </span>
                    <h4 className="font-semibold text-sm">{edu.degree}</h4>
                    <p className="text-accent text-sm font-medium mt-0.5">
                      {edu.school}
                    </p>
                    <p className="text-muted text-xs leading-relaxed mt-2">
                      {edu.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
