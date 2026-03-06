import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About",
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
        image: `${SITE_URL}/profile.png`,
        jobTitle: "Data & AI Student",
        description:
          "I bridge the gap between data science, AI, and business strategy. Driven by curiosity and a hands-on approach, I build solutions where data meets real-world decisions.",
        nationality: {
          "@type": "Country",
          name: "France",
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
