import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import WhatIBuild from "@/components/WhatIBuild";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Research from "@/components/Research";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
import { getPublishedProjects } from "@/lib/db";
import { allTags as defaultTags } from "@/data/projects";

const HomeCommandModal = dynamic(() => import("@/components/HomeCommandModal"), {
  ssr: false,
});

const AISearch = dynamic(() => import("@/components/AISearch"), {
  ssr: false,
});

export default async function Home() {
  const projects = await getPublishedProjects();
  const allTags = Array.from(
    new Set([...defaultTags, ...projects.flatMap((project) => project.tags || [])])
  ).sort((a, b) => a.localeCompare(b));
  const projectCount = projects.length;
  const winnerCount = projects.filter((project) => project.badge === "Winner").length;
  const podiumCount = projects.filter((project) => Boolean(project.badge)).length;

  return (
    <>
      <Navigation />
      <HomeCommandModal />
      <main id="main-content">
        <Hero projectCount={projectCount} winnerCount={winnerCount} />
        <WhatIBuild />
        <AISearch />
        <Projects projects={projects} allTags={allTags} />
        <Experience />
        <Research
          projectCount={projectCount}
          winnerCount={winnerCount}
          podiumCount={podiumCount}
        />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
