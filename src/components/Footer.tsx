"use client";

import { ArrowUp } from "lucide-react";

export default function Footer() {
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
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted font-mono">
            Jonathan Bouniol &mdash; {new Date().getFullYear()}
          </p>
          <p className="text-xs text-muted/50 font-mono">
            Designed for clarity
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border bg-surface text-muted hover:text-foreground hover:border-accent/40 transition-colors"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
