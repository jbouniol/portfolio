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

export const PERSONAL_PROFILE = {
  mindset:
    "Action-oriented, impact-driven. Not the type to just attend classes and hand in assignments — needs to build, get involved, and make things happen. Systematic problem-solver: steps back, examines the full process, finds the bottleneck, then fixes it. Strong aversion to repetitive tasks that can be automated.",
  values: [
    "Action over theory — bias toward doing, not just planning",
    "Real impact — work must change something tangible",
    "Get stuff done — fully invested, never half-measures",
    "Automate the boring — builds tools so he can focus on what requires human judgment",
  ],
  traits: [
    "Curious — follows AI and economics news daily",
    "Organized — uses Notion and Calendar for everything",
    "Resourceful and adaptable — thrives in unfamiliar sectors",
    "Sharp-eyed and detail-oriented — spots errors others miss",
  ],
  interests: [
    "Weightlifting: 3+ sessions per week, no exceptions. Discipline in the gym mirrors discipline at work.",
    "Cinema: deeply interested in filmmaking and directing — loves how great films distill complex ideas.",
    "Atomic Habits (James Clear): reshaped how Jonathan organizes projects and daily routines. Systems over goals.",
  ],
  goals:
    "Wants to discover as many sectors and roles as possible to build a global perspective. Seeking a Data/AI apprenticeship (4 days in-company / 1 day at school) from September 2026.",
  quote:
    "I'm not the type of student who just shows up to class and turns in assignments. I need to build, to get involved, to have an impact.",
} as const;

export const SUPPLEMENTAL_EXPERIENCE_ITEMS: SupplementalExperienceItem[] = [
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
    period: "2026 — 2028",
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
