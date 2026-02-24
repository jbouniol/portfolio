import { experiences } from "@/data/experiences";
import { notFound } from "next/navigation";
import ExperienceDetailClient from "./ExperienceDetailClient";

export function generateStaticParams() {
  return experiences.map((exp) => ({
    slug: exp.slug,
  }));
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
