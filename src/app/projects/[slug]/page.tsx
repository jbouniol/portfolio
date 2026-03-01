import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedProjects, getPublishedProjectBySlug } from "@/lib/db";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";
import ProjectDetailClient from "./ProjectDetailClient";

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  const canonicalUrl = `${SITE_URL}/projects/${project.slug}`;

  return {
    title: `${project.title} — ${project.company} | Jonathan Bouniol`,
    description: project.tagline,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${project.title} — ${project.company} | ${SITE_NAME}`,
      description: project.tagline,
      url: canonicalUrl,
      type: "article",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          alt: `${project.title} case study`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — ${project.company} | Jonathan Bouniol`,
      description: project.tagline,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const canonicalUrl = `${SITE_URL}/projects/${project.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Projects",
            item: `${SITE_URL}/#projects`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: canonicalUrl,
          },
        ],
      },
      {
        "@type": "CreativeWork",
        "@id": `${canonicalUrl}#creativework`,
        name: project.title,
        headline: project.title,
        description: project.tagline,
        url: canonicalUrl,
        dateModified: project.updatedAt,
        inLanguage: "en",
        keywords: project.tags.join(", "),
        about: project.tags,
        publisher: {
          "@type": "Person",
          name: "Jonathan Bouniol",
          url: SITE_URL,
        },
        creator: {
          "@type": "Person",
          name: "Jonathan Bouniol",
          url: SITE_URL,
        },
        provider: {
          "@type": "Organization",
          name: project.company,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectDetailClient project={project} />
    </>
  );
}
