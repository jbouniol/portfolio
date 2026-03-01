export interface SupplementalExperienceItem {
  slug: string;
  role: string;
  company: string;
  period: string;
  tagline: string;
  category: "Leadership" | "Education";
  hasPage: false;
}

export const PROFILE_BASICS = {
  email: "jbouniol@albertschool.com",
  headline:
    "Data, AI, and business strategy. Mines Paris PSL × Albert School.",
} as const;

export const PROFILE_COMPANIES = [
  "Louis Vuitton",
  "CMA-CGM",
  "BNP Paribas",
  "Carrefour",
  "SNCF",
  "Henkel",
  "Asmodee",
  "Generali",
  "Edmond de Rothschild",
  "La French Tech",
  "Linkpick",
  "Ministere des Armees",
  "Capgemini",
  "X-HEC",
  "Villablu (Robertet)",
] as const;

export const PROFILE_SKILLS = [
  "Python",
  "SQL",
  "Scikit-learn",
  "PyTorch",
  "Qlik Sense",
  "Power BI",
  "Streamlit",
  "Excel/VBA",
  "Make",
  "Zapier",
  "Notion",
  "Power Platform",
  "GenAI",
  "RAG Systems",
] as const;

export const SUPPLEMENTAL_EXPERIENCE_ITEMS: SupplementalExperienceItem[] = [
  {
    slug: "student-representative",
    role: "Student Representative",
    company: "Albert School",
    period: "Sep 2023 — Present",
    tagline:
      "Student fairs across Paris, Marseille, Lyon, Geneva. Hosted workshop for 200 students in Luxembourg.",
    category: "Leadership",
    hasPage: false,
  },
  {
    slug: "capgemini-ambassador",
    role: "Ambassador",
    company: "Capgemini",
    period: "2024 — 2025",
    tagline: "Representing Capgemini on campus at Albert School.",
    category: "Leadership",
    hasPage: false,
  },
  {
    slug: "msc-mines-paris",
    role: "MSc Data & AI for Business",
    company: "Mines Paris PSL × Albert School",
    period: "2025 — 2027",
    tagline:
      "Advanced joint diploma program combining data science, AI engineering, and business strategy at France's #2 engineering school.",
    category: "Education",
    hasPage: false,
  },
  {
    slug: "bachelor-albert-school",
    role: "Bachelor Business & Data",
    company: "Albert School × Mines Paris PSL",
    period: "2023 — 2025",
    tagline:
      "Europe's first data-centric business school. 12 Business Deep Dives. Joint diploma with Mines Paris PSL.",
    category: "Education",
    hasPage: false,
  },
  {
    slug: "baccalaureat-ecole-pascal",
    role: "Baccalaureat — High Honors",
    company: "Ecole Pascal",
    period: "2020 — 2023",
    tagline:
      "Specialization in Mathematics and SES, with Maths Expertes option.",
    category: "Education",
    hasPage: false,
  },
];
