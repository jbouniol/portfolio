import { getProjects } from "@/lib/db";
import ProjectsListClient from "./ProjectsListClient";

export default async function AdminProjectsPage() {
  const projects = await getProjects();
  return <ProjectsListClient projects={projects} />;
}
