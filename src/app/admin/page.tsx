import { getProjects, getExperiences } from "@/lib/db";
import AdminDashboardClient from "./_components/AdminDashboardClient";

export default async function AdminDashboardPage() {
  const projects = await getProjects();
  const experiences = await getExperiences();

  const sortedProjects = [...projects].sort((a, b) =>
    (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "")
  );
  const sortedExperiences = [...experiences].sort((a, b) =>
    (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "")
  );
  const latestProject = sortedProjects[0] ?? null;
  const latestExperience = sortedExperiences[0] ?? null;

  const stats = {
    totalProjects: projects.length,
    totalExperiences: experiences.length,
    publishedProjects: projects.filter((p) => (p.status ?? "published") === "published")
      .length,
    publishedExperiences: experiences.filter(
      (e) => (e.status ?? "published") === "published"
    ).length,
    draftProjects: projects.filter((p) => p.status === "draft").length,
    draftExperiences: experiences.filter((e) => e.status === "draft").length,
    ndaProjects: projects.filter((p) => Boolean(p.isNDA)).length,
    confidentialExperiences: experiences.filter((e) => Boolean(e.isConfidential))
      .length,
    winners: projects.filter((p) => p.badge === "Winner").length,
    podiums: projects.filter((p) => Boolean(p.badge)).length,
    categories: {
      bdd: projects.filter((p) => p.category === "bdd").length,
      hackathon: projects.filter((p) => p.category === "hackathon").length,
      consulting: projects.filter((p) => p.category === "consulting").length,
      school: projects.filter((p) => p.category === "school").length,
    },
    latestProject: latestProject
      ? {
          slug: latestProject.slug,
          title: latestProject.title,
          updatedAt: latestProject.updatedAt,
          status: latestProject.status ?? "published",
        }
      : null,
    latestExperience: latestExperience
      ? {
          slug: latestExperience.slug,
          role: latestExperience.role,
          updatedAt: latestExperience.updatedAt,
          status: latestExperience.status ?? "published",
        }
      : null,
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
