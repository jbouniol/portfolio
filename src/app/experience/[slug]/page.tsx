import { getExperiences, getExperienceBySlug } from "@/lib/db";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";
import ExperienceDetailClient from "./ExperienceDetailClient";

export async function generateStaticParams() {
  const experiences = await getExperiences();
  return experiences.map((exp) => ({
    slug: exp.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const experience = await getExperienceBySlug(slug);
  if (!experience) return { title: "Experience Not Found" };

  const canonicalUrl = `${SITE_URL}/experience/${experience.slug}`;

  return {
    title: `${experience.role} — ${experience.company} | Jonathan Bouniol`,
    description: experience.tagline,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${experience.role} — ${experience.company} | ${SITE_NAME}`,
      description: experience.tagline,
      url: canonicalUrl,
      type: "article",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          alt: `${experience.role} at ${experience.company}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${experience.role} — ${experience.company} | Jonathan Bouniol`,
      description: experience.tagline,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experience = await getExperienceBySlug(slug);

  if (!experience) {
    notFound();
  }

  const canonicalUrl = `${SITE_URL}/experience/${experience.slug}`;
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
            name: "Experience",
            item: `${SITE_URL}/#experience`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: experience.role,
            item: canonicalUrl,
          },
        ],
      },
      {
        "@type": "ProfilePage",
        "@id": `${canonicalUrl}#profile-page`,
        name: `${experience.role} — ${experience.company}`,
        description: experience.tagline,
        url: canonicalUrl,
        dateModified: experience.updatedAt,
      },
      {
        "@type": "Person",
        name: "Jonathan Bouniol",
        url: SITE_URL,
        hasOccupation: {
          "@type": "Occupation",
          name: experience.role,
          description: experience.description,
          occupationLocation: {
            "@type": "Place",
            name: experience.location,
          },
          skills: experience.tools?.join(", "),
        },
        worksFor: {
          "@type": "Organization",
          name: experience.company,
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
      <ExperienceDetailClient experience={experience} />
    </>
  );
}
