import { getExperienceBySlug } from "@/lib/db";
import { notFound } from "next/navigation";
import ExperienceForm from "../../_components/ExperienceForm";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experience = await getExperienceBySlug(slug);

  if (!experience) {
    notFound();
  }

  return <ExperienceForm experience={experience} mode="edit" />;
}
