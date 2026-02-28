import { projects } from "@/data/projects";
import { experiences } from "@/data/experiences";
import { SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
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
