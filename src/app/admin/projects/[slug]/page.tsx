import { getProjectBySlug } from "@/lib/db";
import { notFound } from "next/navigation";
import ProjectForm from "../../_components/ProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectForm project={project} mode="edit" />;
}
