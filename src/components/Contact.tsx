"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Calendar, ArrowUpRight, ArrowUp } from "lucide-react";

const links = [
  {
    kind: "meeting",
    icon: Calendar,
    label: "Schedule a chat",
    href: "https://calendar.notion.so/meet/jbouniol/apprenticeship",
    display: "Open to apprenticeship, projects, and collaborations",
  },
  {
    kind: "email",
    icon: Mail,
    label: "Email",
    href: "mailto:jbouniol@albertschool.com",
    display: "jbouniol@albertschool.com",
  },
  {
    kind: "linkedin",
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/jonathanbouniol",
    display: "linkedin.com/in/jonathanbouniol",
  },
  {
    kind: "github",
    icon: Github,
    label: "GitHub",
    href: "https://github.com/jbouniol",
    display: "github.com/jbouniol",
  },
];

export default function Contact() {
  const scrollToTop = () => {
    const html = document.documentElement;
    const previousBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "smooth";
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    requestAnimationFrame(() => {
      html.style.scrollBehavior = previousBehavior;
    });
  };

  return (
    <section id="contact" className="pt-32 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-xl"
        >
          <p className="font-mono text-sm text-accent mb-3">Contact</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Let&apos;s connect
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            I&apos;m currently looking for a{" "}
            <span className="text-foreground font-medium">Data/AI apprenticeship</span>{" "}
            from September (4 days in-company / 1 day at school), and I&apos;m
            also open to project collaborations, portfolio discussions, and broader
            professional exchanges.
          </p>
        </motion.div>

        <div className="mt-12 space-y-4 max-w-md">
          {links.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              {...(link.href.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`group flex items-center gap-4 p-4 border rounded-xl transition-all ${
                link.kind === "meeting"
                  ? "bg-accent/5 border-accent/30 hover:bg-accent/10"
                  : "border-border hover:border-accent/30"
              }`}
            >
              <link.icon
                size={20}
                className={
                  link.kind === "meeting"
                    ? "text-accent"
                    : "text-muted group-hover:text-accent transition-colors"
                }
                strokeWidth={1.5}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{link.label}</p>
                <p
                  className={`text-xs ${
                    link.kind === "meeting" ? "text-accent/80" : "text-muted"
                  }`}
                >
                  {link.display}
                </p>
              </div>
              <ArrowUpRight
                size={16}
                className={
                  link.kind === "meeting"
                    ? "text-accent"
                    : "text-muted group-hover:text-accent transition-colors"
                }
              />
            </motion.a>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="inline-flex items-center justify-center text-muted hover:text-foreground transition-colors"
          >
            <ArrowUp size={16} className="animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}
