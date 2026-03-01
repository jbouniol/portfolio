# Jonathan Bouniol — Portfolio Website

Personal portfolio built with Next.js, focused on Data, AI, and Business case studies.

## Overview

This website includes:
- A multi-section homepage (Hero, capabilities, AI search, projects, experience, stack, contact)
- Detailed project pages (`/projects/[slug]`)
- Detailed experience pages (`/experience/[slug]`)
- An AI assistant for contextual portfolio Q&A (section + `Cmd/Ctrl + K` modal)
- SEO metadata, sitemap, robots, and JSON-LD structured data

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Lucide Icons
- Vercel Analytics + Speed Insights
- Mistral API (server route: `src/app/api/search/route.ts`)

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Lint:

```bash
npm run lint
```

Production build:

```bash
npm run build
npm run start
```

## Environment Variables

Create a `.env.local` file with:

```bash
MISTRAL_API_KEY=your_mistral_api_key
```

Without this key, AI search returns a configuration message.

## Content Management

Main content is data-driven:

- Projects: `src/data/projects.ts`
- Experiences: `src/data/experiences.ts`

Each project/experience entry feeds:
- Homepage cards
- Detail pages
- AI context and related-item suggestions
- Sitemap `lastModified` values (via `updatedAt`)

## Key App Files

- Root layout and global metadata: `src/app/layout.tsx`
- Homepage composition: `src/app/page.tsx`
- AI API route: `src/app/api/search/route.ts`
- Command modal: `src/components/CommandModal.tsx`
- AI section: `src/components/AISearch.tsx`
- Project detail UI: `src/app/projects/[slug]/ProjectDetailClient.tsx`
- Experience detail UI: `src/app/experience/[slug]/ExperienceDetailClient.tsx`

## Deployment

Recommended target: Vercel.

Requirements:
- Set `MISTRAL_API_KEY` in environment variables
- Ensure domain value in `src/lib/site.ts` is correct
- Run `npm run build` before production release checks
