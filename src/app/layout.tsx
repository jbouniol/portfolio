import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";
import { getPublishedProjects } from "@/lib/db";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const projects = await getPublishedProjects();
  const projectCount = projects.length;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME,
      template: "%s | Jonathan Bouniol",
    },
    description: `Data, AI, and business strategy. Mines Paris PSL × Albert School. Portfolio showcasing ${projectCount} projects across 10+ industries.`,
    keywords: [
      "data engineering",
      "AI strategy",
      "business analytics",
      "consulting",
      "Mines Paris PSL",
      "Albert School",
      "portfolio",
      "Jonathan Bouniol",
      "machine learning",
      "data science",
    ],
    authors: [{ name: "Jonathan Bouniol", url: SITE_URL }],
    creator: "Jonathan Bouniol",
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: SITE_NAME,
      description:
        "Data engineering, AI strategy, and consulting-grade business deep dives.",
      type: "website",
      url: SITE_URL,
      siteName: SITE_NAME,
      locale: "en_US",
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
      title: SITE_NAME,
      description:
        "Data engineering, AI strategy, and consulting-grade business deep dives.",
      images: [`/opengraph-image`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const projects = await getPublishedProjects();
  const projectCount = projects.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profilepage`,
        url: SITE_URL,
        dateModified: "2026-03-08T00:00:00+00:00",
        mainEntity: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        description: `Data, AI, and business strategy. Mines Paris PSL × Albert School. ${projectCount} projects across 10+ industries.`,
        publisher: { "@id": `${SITE_URL}/#person` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
        inLanguage: "en",
      },
      {
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
        description: `Data, AI, and business strategy. Mines Paris PSL × Albert School. ${projectCount} projects across 10+ industries.`,
        disambiguatingDescription:
          "French Data & AI student at Mines Paris PSL and Albert School, Paris. Specializes in data engineering, AI systems, and business strategy. Not to be confused with other persons named Jonathan Bouniol.",
        email: "jbouniol@albertschool.com",
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
        sameAs: [
          "https://github.com/jbouniol",
          "https://linkedin.com/in/jonathanbouniol",
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
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
