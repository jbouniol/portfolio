"use client";

import { useState, useEffect } from "react";

const SECTIONS = [
  { id: "work", label: "Capabilities" },
  { id: "ai-search", label: "AI Search" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "research", label: "Stack & Tools" },
  { id: "contact", label: "Contact" },
] as const;

export function useActiveSection(): string {
  const [active, setActive] = useState("Portfolio");

  useEffect(() => {
    const ratios = new Map<string, number>();

    const observers = SECTIONS.map(({ id, label }) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const obs = new IntersectionObserver(
        ([entry]) => {
          ratios.set(label, entry.intersectionRatio);
          let best = "Portfolio";
          let max = 0;
          ratios.forEach((r, l) => {
            if (r > max) {
              max = r;
              best = l;
            }
          });
          if (max > 0.05) setActive(best);
        },
        { threshold: [0, 0.1, 0.25, 0.5, 0.75] }
      );

      obs.observe(el);
      return obs;
    });

    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return active;
}
