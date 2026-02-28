import { experiences } from "@/data/experiences";
import { notFound } from "next/navigation";
import ExperienceDetailClient from "./ExperienceDetailClient";

export function generateStaticParams() {
  return experiences.map((exp) => ({
    slug: exp.slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return params.then(({ slug }) => {
    const experience = experiences.find((e) => e.slug === slug);
    if (!experience) return { title: "Experience Not Found" };
    return {
      title: `${experience.role} — ${experience.company} | Jonathan Bouniol`,
      description: experience.tagline,
    };
  });
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experience = experiences.find((e) => e.slug === slug);

  if (!experience) {
    notFound();
  }

  return <ExperienceDetailClient experience={experience} />;
}
