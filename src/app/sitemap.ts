import { getPublishedProjects, getPublishedExperiences } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, experiences] = await Promise.all([
    getPublishedProjects(),
    getPublishedExperiences(),
  ]);

  const lastUpdated = [...projects, ...experiences]
    .map((item) => item.updatedAt)
    .sort()
    .at(-1);

  const projectUrls = projects.map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const experienceUrls = experiences.map((e) => ({
    url: `${SITE_URL}/experience/${e.slug}`,
    lastModified: e.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: lastUpdated || "2026-02-28",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: lastUpdated || "2026-03-07",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...projectUrls,
    ...experienceUrls,
  ];
}
