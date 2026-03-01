import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import WhatIBuild from "@/components/WhatIBuild";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import AISearch from "@/components/AISearch";
import Research from "@/components/Research";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import HomeCommandModal from "@/components/HomeCommandModal";
import { getPublishedProjects, getAllTags } from "@/lib/db";

export default async function Home() {
  const projects = await getPublishedProjects();
  const allTags = await getAllTags();
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
