"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Users, ArrowUpRight } from "lucide-react";

const workExperience = [
  {
    period: "Jul 2025 — Dec 2025",
    role: "Data & IT Transformation Intern",
    company: "Generali France",
    description:
      "Created performance reports on IT projects through data extraction, transformation, and analysis. Built tools (apps, AI agents) to support agility and performance. Automated internal processes for the Tech & Ops department.",
    slug: "generali",
  },
  {
    period: "May 2024 — Jul 2024",
    role: "Right-Hand to CEO (Intern)",
    company: "Sunver",
    description:
      "SEO optimization, promotional video creation for MetaAds, developed an LLM for the Sunver app, and led prospect acquisition via cold calling and hotel chain contact databases.",
    slug: "sunver",
  },
  {
    period: "2024 — Present",
    role: "Sous-Officier Reserviste",
    company: "Commissariat du Numerique de Defense (CND)",
    description:
      "Called up 30 days per year for Data and AI missions within the French Army. Contributing to data structuring, interoperability, and digital sovereignty across military branches.",
    slug: "cnd",
  },
];

const leadership = [
  {
    period: "Jul 2024 — Jul 2025",
    role: "Vice President & CTO",
    company: "Albert Junior Consulting",
    description:
      "Doubled revenue vs. previous mandate. Led client acquisition strategy, created the website (albertjuniorconsulting.com), set up CRM & HR management with Notion + Zapier automation, and led the entire recruitment process.",
    slug: "albert-junior-consulting",
  },
  {
    period: "Sep 2025 — Present",
    role: "Campus Leader",
    company: "Notion",
    description:
      "Selected for Notion's international Campus Leader program. In charge of developing the Notion community at Albert School — promoting productivity and project management tools among students, professors, and campus associations.",
  },
  {
    period: "Sep 2023 — Present",
    role: "Student Representative",
    company: "Albert School",
    description:
      "Student fairs across Paris, Marseille, Lyon, and Geneva. Open days, campus tours, mentoring high schoolers during immersion weeks. Hosted a workshop for 200 students in a Luxembourg high school.",
  },
  {
    period: "2024 — 2025",
    role: "Ambassador",
    company: "Capgemini",
    description:
      "Representing Capgemini on campus — bridging tech consulting with the student community at Albert School.",
  },
];

const education = [
  {
    period: "2025 — 2027",
    degree: "MSc Data & AI for Business",
    school: "Mines Paris PSL x Albert School",
    description:
      "Advanced double-diploma program combining data science, AI engineering, and business strategy at France's #1 engineering school.",
  },
  {
    period: "2023 — 2025",
    degree: "Bachelor Business & Data",
    school: "Albert School x Mines Paris PSL",
    description:
      "Europe's first data-centric business school. 14+ Business Deep Dives with BCG, Louis Vuitton, BNP Paribas, Edmond de Rothschild, and more. Double diploma with Mines Paris PSL.",
  },
  {
    period: "2020 — 2023",
    degree: "Baccalaureat — High Honors",
    school: "Ecole Pascal",
    description:
      "Specialization in Mathematics and Social & Economic Sciences (SES), with advanced mathematics option (Maths Expertes).",
  },
];

export default function Experience() {
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
              <Briefcase
                size={18}
                className="text-foreground"
                strokeWidth={1.5}
              />
              <h3 className="text-lg font-semibold">Experience</h3>
            </div>

            <div className="relative">
              <div className="absolute left-[3px] top-2 bottom-2 w-px bg-border" />

              <div className="space-y-10">
                {workExperience.map((exp, i) => {
                  const Wrapper = exp.slug ? "a" : "div";
                  const wrapperProps = exp.slug
                    ? { href: `/experience/${exp.slug}` }
                    : {};

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="relative pl-8"
                    >
                      <div className="absolute left-0 top-[10px] w-[7px] h-[7px] rounded-full bg-foreground" />

                      <Wrapper
                        {...wrapperProps}
                        className={
                          exp.slug
                            ? "group block hover:bg-surface/50 -mx-3 -my-2 px-3 py-2 rounded-lg transition-colors"
                            : ""
                        }
                      >
                        <span className="font-mono text-xs text-muted block mb-1">
                          {exp.period}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-semibold text-sm">
                            {exp.role}
                          </h4>
                          {exp.slug && (
                            <ArrowUpRight
                              size={12}
                              className="text-muted group-hover:text-accent transition-colors shrink-0"
                            />
                          )}
                        </div>
                        <p className="text-accent text-sm font-medium mt-0.5">
                          {exp.company}
                        </p>
                        <p className="text-muted text-xs leading-relaxed mt-2">
                          {exp.description}
                        </p>
                      </Wrapper>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Leadership & Involvement */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Users
                size={18}
                className="text-foreground"
                strokeWidth={1.5}
              />
              <h3 className="text-lg font-semibold">
                Leadership & Involvement
              </h3>
            </div>

            <div className="relative">
              <div className="absolute left-[3px] top-2 bottom-2 w-px bg-purple-500/30" />

              <div className="space-y-10">
                {leadership.map((item, i) => {
                  const hasSlug = "slug" in item && item.slug;
                  const Wrapper = hasSlug ? "a" : "div";
                  const wrapperProps = hasSlug
                    ? {
                        href: `/experience/${(item as { slug: string }).slug}`,
                      }
                    : {};

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="relative pl-8"
                    >
                      <div className="absolute left-0 top-[10px] w-[7px] h-[7px] rounded-full bg-purple-500" />

                      <Wrapper
                        {...wrapperProps}
                        className={
                          hasSlug
                            ? "group block hover:bg-surface/50 -mx-3 -my-2 px-3 py-2 rounded-lg transition-colors"
                            : ""
                        }
                      >
                        <span className="font-mono text-xs text-muted block mb-1">
                          {item.period}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-semibold text-sm">
                            {item.role}
                          </h4>
                          {hasSlug && (
                            <ArrowUpRight
                              size={12}
                              className="text-muted group-hover:text-accent transition-colors shrink-0"
                            />
                          )}
                        </div>
                        <p className="text-purple-400 text-sm font-medium mt-0.5">
                          {item.company}
                        </p>
                        <p className="text-muted text-xs leading-relaxed mt-2">
                          {item.description}
                        </p>
                      </Wrapper>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Education */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <GraduationCap
                size={18}
                className="text-foreground"
                strokeWidth={1.5}
              />
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
