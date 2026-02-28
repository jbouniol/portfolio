import { projects } from "@/data/projects";
import { experiences } from "@/data/experiences";
import type { MetadataRoute } from "next";

const BASE_URL = "https://jonathanbouniol.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const projectUrls = projects.map((p) => ({
    url: `${BASE_URL}/projects/${p.slug}`,
    lastModified: new Date(),
  }));

  const experienceUrls = experiences.map((e) => ({
    url: `${BASE_URL}/experience/${e.slug}`,
    lastModified: new Date(),
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), priority: 1 },
    ...projectUrls,
    ...experienceUrls,
  ];
}
