"use client";

import { motion } from "framer-motion";
import { ArrowDown, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const scrollToWork = () => {
    const section = document.getElementById("work");
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    // Keep the URL in sync even if the hash is already present.
    window.history.replaceState(null, "", "#work");
  };

  return (
    <section className="min-h-screen flex flex-col justify-center px-6 pt-16">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-4 mb-6">
            {/* Profile Photo */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-border">
              <Image
                src="/profile.png"
                alt="Jonathan Bouniol"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <p className="font-mono text-sm text-accent tracking-wide">
                Jonathan Bouniol
              </p>
              <p className="font-mono text-xs text-muted">
                Data &middot; AI &middot; Business
              </p>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] max-w-4xl">
            I turn complex data
            <br />
            <span className="text-muted">into business clarity.</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-8 text-lg md:text-xl text-muted max-w-2xl leading-relaxed"
          >
            I bridge the gap between{" "}
            <span className="text-foreground font-medium">data science</span>,{" "}
            <span className="text-foreground font-medium">AI</span>, and{" "}
            <span className="text-foreground font-medium">business strategy</span>.
            Driven by curiosity and a hands-on approach, I build solutions where
            data meets real-world decisions. What I&apos;m looking for: a team with
            real culture, a project that genuinely matters, and the space to make
            an impact.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            {[
              "19 Projects · 10+ Industries",
              "4x Winner",
              "Mines Paris PSL × Albert School",
              "French Army Reservist",
            ].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 text-xs font-mono bg-surface border border-border rounded-full text-muted"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-12 flex gap-4"
          >
            <Link
              href="#projects"
              className="px-6 py-3 bg-foreground text-background text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              View Projects
            </Link>
            <Link
              href="#contact"
              className="px-6 py-3 border border-border text-sm font-medium rounded-lg hover:bg-surface transition-colors"
            >
              Get in Touch
            </Link>
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-sm font-medium rounded-lg hover:bg-surface transition-colors text-muted hover:text-foreground"
            >
              <Download size={14} />
              CV
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:block"
        >
          <button
            type="button"
            onClick={scrollToWork}
            aria-label="Scroll to work section"
            className="text-muted hover:text-foreground transition-colors"
          >
            <ArrowDown size={20} className="animate-bounce" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
