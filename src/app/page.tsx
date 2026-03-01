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

export default function Home() {
  return (
    <>
      <Navigation />
      <HomeCommandModal />
      <main id="main-content">
        <Hero />
        <WhatIBuild />
        <AISearch />
        <Projects />
        <Experience />
        <Research />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
