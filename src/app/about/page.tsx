import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: { absolute: "Jonathan Bouniol — Data & AI Student" },
  description:
    "Meet Jonathan Bouniol — a Data & AI student at Mines Paris PSL and Albert School who bridges data science, artificial intelligence, and business strategy. Driven by impact, curiosity, and a builder mindset.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: `About | ${SITE_NAME}`,
    description:
      "Meet Jonathan Bouniol — a Data & AI student who bridges data science, artificial intelligence, and business strategy.",
    url: `${SITE_URL}/about`,
    type: "profile",
    images: [
      {
        url: `/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Jonathan Bouniol — Data, AI & Business",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `About | ${SITE_NAME}`,
    description:
      "Meet Jonathan Bouniol — a Data & AI student who bridges data science, artificial intelligence, and business strategy.",
    images: [`/opengraph-image`],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/about#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Who is Jonathan Bouniol?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Jonathan Bouniol is a French Data & AI student at Mines Paris PSL and Albert School in Paris. He specializes in data engineering, AI systems, and business strategy, with experience across 10+ industries including luxury goods, finance, logistics, and defense.",
          },
        },
        {
          "@type": "Question",
          name: "What does Jonathan Bouniol study?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Jonathan is pursuing a joint MSc in Data & AI for Business at Mines Paris PSL × Albert School (2026–2028), following a Bachelor in Business & Data at Albert School × Mines Paris PSL (2023–2025). Albert School is Europe's first data-centric business school.",
          },
        },
        {
          "@type": "Question",
          name: "What has Jonathan Bouniol worked on?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "18+ projects spanning Business Deep Dives (Louis Vuitton, BNP Paribas, CMA-CGM…), hackathons (multiple podiums), consulting missions, and AI tooling. He has built RAG systems, automation pipelines, predictive models, and data dashboards across real-world mandates.",
          },
        },
        {
          "@type": "Question",
          name: "How to contact Jonathan Bouniol?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "By email at jbouniol@albertschool.com, on LinkedIn at linkedin.com/in/jonathanbouniol, or via the contact section of jonathanbouniol.com.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "About",
          item: `${SITE_URL}/about`,
        },
      ],
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/about#profilepage`,
      name: "About Jonathan Bouniol",
      description:
        "Data & AI student at Mines Paris PSL and Albert School. Builder, problem-solver, and strategic thinker bridging data science and business.",
      url: `${SITE_URL}/about`,
      mainEntity: {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "Jonathan Bouniol",
        givenName: "Jonathan",
        familyName: "Bouniol",
        url: SITE_URL,
        image: {
          "@type": "ImageObject",
          url: `${SITE_URL}/jonathanbouniol.png`,
          caption: "Jonathan Bouniol",
        },
        jobTitle: "Data & AI Student",
        description:
          "I bridge the gap between data science, AI, and business strategy. Driven by curiosity and a hands-on approach, I build solutions where data meets real-world decisions.",
        disambiguatingDescription:
          "French Data & AI student at Mines Paris PSL and Albert School, Paris. Specializes in data engineering, AI systems, and business strategy. Not to be confused with other persons named Jonathan Bouniol.",
        nationality: {
          "@type": "Country",
          name: "France",
        },
        homeLocation: {
          "@type": "Place",
          addressLocality: "Paris",
          addressCountry: "FR",
        },
        alumniOf: [
          {
            "@type": "CollegeOrUniversity",
            name: "Mines Paris PSL",
            url: "https://www.minesparis.psl.eu",
          },
          {
            "@type": "CollegeOrUniversity",
            name: "Albert School",
            url: "https://www.albertschool.com",
          },
        ],
        knowsAbout: [
          "Data Engineering",
          "Artificial Intelligence",
          "Machine Learning",
          "Business Strategy",
          "Python",
          "SQL",
          "Consulting",
          "Process Optimization",
        ],
        sameAs: [
          "https://github.com/jbouniol",
          "https://linkedin.com/in/jonathanbouniol",
        ],
      },
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutContent />
    </>
  );
}
