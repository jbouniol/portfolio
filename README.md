# Jonathan Bouniol — Portfolio Website

Portfolio personnel Next.js avec:
- Site public (projects, experiences, AI search)
- Admin panel sécurisé (`/admin`) pour gérer le contenu
- Assistant admin "Bob" (chat + génération CV/Cover Letter LaTeX/PDF)

## Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- Upstash Redis (KV) pour persistance runtime
- Mistral + Gemini (features AI)

## Démarrage local

```bash
npm install
npm run dev
```

Qualité:

```bash
npm run lint
npx tsc --noEmit
```

Build prod:

```bash
npm run build
npm run start
```

## Variables d'environnement

Créer `.env.local`:

```bash
# Admin auth (obligatoire pour /admin)
ADMIN_PASSWORD=change-me
ADMIN_JWT_SECRET=change-me-long-random-secret

# Content storage (optionnel en local, requis pour persistance partagée)
KV_REST_API_URL=...
KV_REST_API_TOKEN=...

# AI providers
MISTRAL_API_KEY=...
GEMINI_API_KEY=...
```

Notes:
- Sans `KV_*`, l'app lit les données statiques `src/data/*`.
- Sans clé AI, les endpoints AI retournent des messages de configuration.

## Architecture contenu

- Projets statiques: `src/data/projects.ts`
- Expériences statiques: `src/data/experiences.ts`
- Profil/skills centralisés (context AI): `src/data/profile.ts`
- Couche données (lecture/écriture + seed): `src/lib/db.ts`

Le bouton `Sync Defaults` de l’admin exécute un merge des defaults statiques vers KV sans écraser les entrées déjà modifiées.

## Admin panel

- Routes: `/admin`, `/admin/projects`, `/admin/experiences`, `/admin/chatbot`
- Protection auth: `src/proxy.ts` (remplace middleware classique)
- Login API: `src/app/api/admin/auth/route.ts`
- Formulaires project/experience:
  - autosave local draft
  - AI prefill dans les formulaires de création
  - AI polish (`improve`, `shorten`, `STAR`) via `/api/admin/ai-polish`

## Bob (assistant admin)

- UI: `src/app/admin/chatbot/page.tsx` + composants `src/app/admin/chatbot/_components/*`
- API chat: `src/app/api/admin/chatbot/route.ts`
- Contexte ciblé via mentions `@slug` (projects/experiences)
- Choix modèle + style de réponse (`concise` / `deep`)

## Career Docs (CV / Cover Letter)

- Génération LaTeX: `src/app/api/admin/career-docs/generate/route.ts`
- Compilation PDF: `src/app/api/admin/career-docs/compile/route.ts`
- Compile via POST tarball vers latexonline.cc (`/data`) pour éviter les erreurs URL 414.

## Site public

- Home: `src/app/page.tsx`
- Project detail: `src/app/projects/[slug]/page.tsx`
- Experience detail: `src/app/experience/[slug]/page.tsx`
- AI search endpoint: `src/app/api/search/route.ts`

## Déploiement

Cible recommandée: Vercel.

Checklist:
1. Configurer toutes les variables d'environnement en Production/Preview.
2. Vérifier `npm run build`.
3. Vérifier accès admin (`/admin/login`) et endpoints AI côté serveur.
