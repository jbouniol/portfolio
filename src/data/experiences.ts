export interface Experience {
  slug: string;
  updatedAt: string;
  role: string;
  company: string;
  period: string;
  location: string;
  type: "work" | "leadership";
  tagline: string;
  description: string;
  missions: string[];
  tools?: string[];
  isConfidential?: boolean;
  status?: "draft" | "published";
}

export const experiences: Experience[] = [
  {
    slug: "generali",
    updatedAt: "2026-02-28",
    role: "Data & IT Transformation Intern",
    company: "Generali France",
    period: "Jul 2025 — Dec 2025",
    location: "Seine-Saint-Denis, Ile-de-France",
    type: "work",
    tagline:
      "6-month internship within the Tech & Ops department of one of Europe's largest insurers, focused on data-driven IT performance.",
    description:
      "Embedded in the IT Transformation team at Generali France, I worked at the intersection of data analysis, automation, and AI tooling to support the Tech & Ops department's digital modernization. My role combined data engineering, reporting, and internal product development.",
    missions: [
      "Created performance reports on IT projects through extraction, transformation, and analysis of internal datasets",
      "Built internal tools — including applications and AI agents — to support agility and performance tracking across IT project portfolios",
      "Automated numerous internal processes for the Tech & Ops department, reducing manual effort and increasing reliability",
      "Contributed to the broader digital transformation strategy by identifying optimization levers through data-driven audits",
    ],
    tools: [
      "Python",
      "SQL",
      "Power BI",
      "Excel / VBA",
      "AI Agents",
      "Automation",
    ],
  },
  {
    slug: "sunver",
    updatedAt: "2026-02-28",
    role: "Right-Hand to CEO (Intern)",
    company: "Sunver",
    period: "May 2024 — Jul 2024",
    location: "Boulogne-Billancourt, Ile-de-France",
    type: "work",
    tagline:
      "3-month startup internship as the CEO's right hand — wearing every hat from SEO to LLM development to sales.",
    description:
      "At Sunver, a SaaS startup digitalizing tourist establishments via QR codes and web apps, I worked directly alongside the CEO on growth, product, and tech. The fast-paced environment required me to ship across marketing, engineering, and business development simultaneously.",
    missions: [
      "SEO optimization of the Sunver website through strategic article creation and technical improvements",
      "Created and edited promotional videos for Meta Ads campaigns to drive user acquisition",
      "Developed a custom LLM integration for the Sunver application — enabling AI-powered guest assistance for hotels",
      "Led prospect acquisition via cold calling and built a structured database of hotel chain contacts across France",
    ],
    tools: ["SEO", "Meta Ads", "LLM / GenAI", "Cold Calling", "Video Editing"],
  },
  {
    slug: "cnd",
    updatedAt: "2026-02-28",
    role: "Sous-Officier Reserviste",
    company: "Commissariat du Numerique de Defense (CND)",
    period: "2024 — Present",
    location: "France",
    type: "work",
    tagline:
      "Reserve Non-Commissioned Officer contributing to Data & AI missions within the French Ministry of Armed Forces.",
    description:
      "As a Sous-Officier Reserviste at the Commissariat du Numerique de Defense, I am called up 30 days per year to contribute to the digital sovereignty and operational readiness of the French armed forces. My missions are classified and cannot be detailed publicly.",
    missions: [
      "Classified missions — details cannot be disclosed for operational security reasons",
    ],
    isConfidential: true,
  },
  {
    slug: "albert-junior-consulting",
    updatedAt: "2026-02-28",
    role: "Vice President & CTO",
    company: "Albert Junior Consulting",
    period: "Jul 2024 — Jul 2025",
    location: "Paris, Ile-de-France",
    type: "leadership",
    tagline:
      "Led Albert School's junior consulting firm as VP & CTO — doubled revenue and built the tech infrastructure from scratch.",
    description:
      "As Vice President and CTO of Albert Junior Consulting, I was responsible for both strategic growth and the entire technical infrastructure of the association. I combined business development leadership with hands-on engineering to scale the organization.",
    missions: [
      "Doubled revenue compared to the previous mandate through aggressive client acquisition strategy",
      "Led and executed the full client acquisition pipeline — from prospecting to closing",
      "Created the website from scratch: albertjuniorconsulting.com",
      "Set up the CRM and HR management system with automation via Notion and Zapier",
      "Piloted the entire recruitment process — from job postings to interviews to onboarding",
    ],
    tools: ["Notion", "Zapier", "Web Development", "CRM"],
  },
  {
    slug: "notion-campus-leader",
    updatedAt: "2026-03-01",
    role: "Campus Leader",
    company: "Notion",
    period: "Sep 2025 — Present",
    location: "Paris, Ile-de-France",
    type: "leadership",
    tagline:
      "Built and activated the Notion student community at Albert School through workshops, 1:1 coaching, templates, and co-created webinar formats.",
    description:
      "As a Notion Campus Leader, I developed Notion adoption on campus for students and associations through training, hands-on implementation, and community events. The objective was to turn Notion into a practical operating system for study, project management, and student organization workflows.",
    missions: [
      "Organized multiple onboarding workshops to implement Notion and helped 4 student associations structure project management, CRM, and HR workflows directly in Notion",
      "Ran 1:1 coaching sessions with students to improve personal use cases: note-taking systems, personal organization, and side projects",
      "Co-organized a campus event with the BDE: crepes and New Year's resolutions with Notion, designed to grow and activate the Albert School Notion community",
      "Created 3 reusable Notion templates for students to accelerate setup and daily adoption",
      "Co-founded the 'Learning Break with Notion' webinar format and co-hosted the first session with Hugo Foucault and Anais Gissinger: Learning Break with Notion #1 — Note-taking",
    ],
    tools: [
      "Notion",
      "Workshop Facilitation",
      "Community Building",
      "CRM Design",
      "Workflow Design",
      "Template Design",
    ],
  },
];
