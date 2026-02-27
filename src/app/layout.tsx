import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
  title: "Jonathan Bouniol — Data, AI & Business",
  description:
    "Data engineering, AI strategy, and consulting-grade business deep dives. Mines Paris PSL x Albert School. Portfolio showcasing 18+ projects across Fortune 500 companies.",
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
  openGraph: {
    title: "Jonathan Bouniol — Data, AI & Business",
    description:
      "Data engineering, AI strategy, and consulting-grade business deep dives.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jonathan Bouniol — Data, AI & Business",
    description:
      "Data engineering, AI strategy, and consulting-grade business deep dives.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
