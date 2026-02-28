import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description:
    "Data, AI, and business strategy. Mines Paris PSL × Albert School. Portfolio showcasing 19 projects across 10+ industries.",
  keywords: [
    "data engineering",
    "AI strategy",
    "business analytics",
    "consulting",
    "Mines Paris PSL",
    "Albert School",
    "portfolio",
    "Jonathan Bouniol",
  ],
  authors: [{ name: "Jonathan Bouniol" }],
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
        url: DEFAULT_OG_IMAGE,
        alt: "Jonathan Bouniol Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Data engineering, AI strategy, and consulting-grade business deep dives.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jonathan Bouniol",
  url: "https://jonathanbouniol.com",
  jobTitle: "Data & AI Student",
  description:
    "Data, AI, and business strategy. Mines Paris PSL × Albert School. 19 projects across 10+ industries.",
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
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
