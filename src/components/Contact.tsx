"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin, ArrowUpRight } from "lucide-react";

const links = [
  {
    icon: Mail,
    label: "Email",
    href: "mailto:jbouniol@albertschool.com",
    display: "jbouniol@albertschool.com",
  },
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/jbouniol",
    display: "github.com/jbouniol",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/jonathanbouniol",
    display: "linkedin.com/in/jonathanbouniol",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-32 px-6">
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
            Currently looking for an{" "}
            <span className="text-foreground font-medium">apprenticeship </span>{" "}
            in Data, AI applied to Business — 4 days in-company / 1 day at school.
            Available for conversations about how data transforms business.
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
              className="group flex items-center gap-4 p-4 border border-border rounded-xl hover:border-accent/30 transition-all"
            >
              <link.icon
                size={20}
                className="text-muted group-hover:text-accent transition-colors"
                strokeWidth={1.5}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{link.label}</p>
                <p className="text-xs text-muted">{link.display}</p>
              </div>
              <ArrowUpRight
                size={16}
                className="text-muted group-hover:text-accent transition-colors"
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
