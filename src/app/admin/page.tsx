import { getProjects, getExperiences } from "@/lib/db";
import AdminDashboardClient from "./_components/AdminDashboardClient";

export default async function AdminDashboardPage() {
  const projects = await getProjects();
  const experiences = await getExperiences();

  const stats = {
    totalProjects: projects.length,
    totalExperiences: experiences.length,
    winners: projects.filter((p) => p.badge === "Winner").length,
    podiums: projects.filter((p) => Boolean(p.badge)).length,
    categories: {
      bdd: projects.filter((p) => p.category === "bdd").length,
      hackathon: projects.filter((p) => p.category === "hackathon").length,
      consulting: projects.filter((p) => p.category === "consulting").length,
      school: projects.filter((p) => p.category === "school").length,
    },
    lastUpdatedProject: projects
      .map((p) => p.updatedAt)
      .sort()
      .at(-1) || "—",
    lastUpdatedExperience: experiences
      .map((e) => e.updatedAt)
      .sort()
      .at(-1) || "—",
  };

  return <AdminDashboardClient stats={stats} />;
}
