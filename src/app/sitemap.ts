import { getProjects, getExperiences } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, experiences] = await Promise.all([
    getProjects(),
    getExperiences(),
  ]);

  const lastUpdated = [...projects, ...experiences]
    .map((item) => item.updatedAt)
    .sort()
    .at(-1);

  const projectUrls = projects.map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    lastModified: p.updatedAt,
  }));

  const experienceUrls = experiences.map((e) => ({
    url: `${SITE_URL}/experience/${e.slug}`,
    lastModified: e.updatedAt,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: lastUpdated || "2026-02-28",
      priority: 1,
    },
    ...projectUrls,
    ...experienceUrls,
  ];
}
