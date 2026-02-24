"use client";

import { motion } from "framer-motion";

const toolCategories = [
  {
    label: "Languages & Data",
    items: ["Python", "SQL", "Excel / VBA"],
  },
  {
    label: "ML & AI",
    items: ["Scikit-learn", "PyTorch", "ResNet / Transfer Learning", "GenAI (Prompt Engineering)"],
  },
  {
    label: "Visualization & BI",
    items: ["Qlik Sense", "Power BI", "Matplotlib", "Seaborn"],
  },
  {
    label: "Data Engineering",
    items: ["Pandas", "NumPy", "Data Cleaning", "Pipeline Design"],
  },
  {
    label: "Business & Strategy",
    items: ["Business Plan Modeling", "Market Sizing", "Competitive Analysis", "Financial Modeling"],
  },
  {
    label: "Tools & Productivity",
    items: ["Notion", "Git / GitHub", "Make", "Zapier", "Canva", "Google Suite"],
  },
];

const highlights = [
  { number: "14", label: "Business Deep Dives" },
  { number: "4", label: "BDD Wins" },
  { number: "4", label: "Finalists" },
  { number: "10+", label: "Industries Covered" },
];

export default function Research() {
  return (
    <section id="research" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-sm text-accent mb-3">Stack</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Tools & Methods
          </h2>
          <p className="mt-4 text-muted max-w-xl text-lg">
            The technical and strategic toolkit I bring to every project.
          </p>
        </motion.div>

        {/* Numbers */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {highlights.map((h, i) => (
            <motion.div
              key={h.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center p-6 bg-surface border border-border rounded-xl"
            >
              <p className="text-3xl font-semibold text-accent">{h.number}</p>
              <p className="text-xs text-muted font-mono mt-1">{h.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tool Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolCategories.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="p-5 bg-surface border border-border rounded-xl"
            >
              <h3 className="text-sm font-mono text-accent mb-3">
                {cat.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 text-xs bg-background border border-border rounded-md text-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
