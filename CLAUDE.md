# CLAUDE.md - Portfolio Website

## Project Overview

Personal portfolio website for **Jonathan Bouniol** at [jonathanbouniol.com](https://jonathanbouniol.com). Built with Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS v4. Deployed on Vercel.

Two surfaces:
1. **Public site** - Single-page portfolio with dynamic detail pages, AI-powered search, dark/light mode, animations (Framer Motion), full SEO (sitemap, robots, JSON-LD, OpenGraph)
2. **Admin panel** (`/admin`) - JWT-protected dashboard for content CRUD, AI chatbot "Bob", AI form prefill, AI text polish, career doc generation, command palette

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router) + React 19.2.3 + TypeScript 5
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`), Geist Sans/Mono fonts
- **Database:** Upstash Redis (`@upstash/redis`) with static data fallback
- **Auth:** Password-based login, JWT via `jose`, HttpOnly cookie, proxy-based route protection (`src/proxy.ts`)
- **AI:** Mistral API + Gemini API (search, chatbot, text polish, form prefill, career docs)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Markdown:** `react-markdown` + `remark-gfm` (chatbot rendering)
- **Observability:** Vercel Analytics + Speed Insights
- **Deployment:** Vercel (GitHub integration, single `main` branch, direct pushes)

## Project Structure

```
src/
  app/
    layout.tsx              # Root layout (Geist fonts, metadata, JSON-LD, analytics)
    page.tsx                # Homepage (SSR, fetches from KV)
    globals.css             # Tailwind + custom CSS vars + dark mode + .prose-chat
    robots.ts / sitemap.ts  # SEO
    projects/[slug]/        # Project detail pages
    experience/[slug]/      # Experience detail pages
    admin/                  # Admin panel (login, dashboard, CRUD, chatbot, career docs)
      _components/          # AdminShell, forms, CommandPalette, AIPrefillModal, etc.
      chatbot/              # "Bob" AI chatbot page + components
    api/
      search/               # Public AI search endpoint
      admin/auth/           # Login API
      admin/projects/       # Projects CRUD
      admin/experiences/    # Experiences CRUD
      admin/chatbot/        # Bob chatbot API
      admin/ai-polish/      # AI text improvement
      admin/ai-prefill/     # AI form autofill
      admin/career-docs/    # LaTeX CV/cover letter generation + PDF compile
      admin/seed/           # DB seeding (merges static data into Redis)
  components/               # Public site components (Hero, Nav, Projects, Experience, etc.)
  data/                     # Static data (projects.ts, experiences.ts, profile.ts)
  lib/                      # DB layer, auth, AI utils, career docs, site config
  hooks/                    # useActiveSection (IntersectionObserver)
  proxy.ts                  # Auth proxy for admin routes (replaces Edge middleware)
```

## Key Architecture Decisions

- **Data layer:** `src/lib/db.ts` abstracts KV storage. Falls back to static data in `src/data/` when Redis is unavailable (build-time safety)
- **Auth proxy** (`src/proxy.ts`) protects `/admin` and `/api/admin` routes instead of Edge middleware
- **Static data** in `src/data/` serves as defaults and seed source. Admin edits are stored in Redis
- **AI chatbot "Bob"** uses Mistral Large with full portfolio context for interview prep and career doc generation
- **Path alias:** `@/*` maps to `./src/*`

## Environment Variables (.env.local)

```
ADMIN_PASSWORD=...
ADMIN_JWT_SECRET=...
KV_REST_API_URL=...        # Upstash Redis
KV_REST_API_TOKEN=...      # Upstash Redis
MISTRAL_API_KEY=...
GEMINI_API_KEY=...
OPENAI_API_KEY=...        # AskAI fallback when Mistral is unavailable
```

## Dev Server

```bash
npm run dev    # Port 3000
```

Configured in `.claude/launch.json` as "Portfolio Dev".

## Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

## Content

- **18 projects** across categories: BDD (Business Deep Dives with academic levels B1/B2/B3), Hackathons, Consulting, School
- **6 experiences** (Generali, Sunver, CND military reserve, Albert School student rep, etc.)
- **Education:** Mines Paris PSL, Albert School (2023-), Ecole Pascal (2020-2023)
- **Domain:** jonathanbouniol.com

## Conventions

- User writes in French; codebase and site content are in English
- Dark-first design with blue (#3b82f6) accent color
- Proposals are numbered lists, user responds "Go/Non" for each
- Keep it simple: no unnecessary features (user rejected analytics dashboards, Notion integration, media library, theme editor, etc.)
- Git: single `main` branch, direct pushes to Vercel
- GitHub: github.com/jbouniol
