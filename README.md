# mattarabah

Portfolio + blog site built with Astro, with room to grow AI-powered tools.

## Stack

- Astro + TypeScript
- Svelte integration enabled for interactive components
- MDX support for richer writing workflows
- ESLint + Prettier + Husky + lint-staged for guardrails

## Current Structure

```text
/
├── public/                  # static assets
├── src/
│   ├── components/          # shared UI components
│   ├── content/             # content collections (blog)
│   │   └── blog/
│   ├── layouts/             # page layouts
│   ├── lib/
│   │   └── ai/              # AI provider and env helpers
│   ├── pages/
│   │   ├── api/ai/          # AI endpoints
│   │   ├── blog/            # blog list + dynamic post routes
│   │   ├── tools/
│   │   └── ...
│   ├── styles/
│   └── content.config.ts    # Astro content collection schema
├── .husky/                  # git hooks
├── eslint.config.js
└── lint-staged.config.mjs
```

## Commands

- `npm install`
- `npm run dev`
- `npm run check`
- `npm run build`
- `npm run preview`

## Blog Content

Blog posts now live in `src/content/blog/*.md` and are typed by `src/content.config.ts`.

- List page: `src/pages/blog/index.astro`
- Post page: `src/pages/blog/[slug].astro`

## AI Tooling Scaffold

The project includes a starter server-side AI shape:

- `src/lib/ai/env.ts` validates required environment variables
- `src/lib/ai/providers/openai.ts` contains a provider wrapper
- `src/pages/api/ai/health.json.ts` health endpoint
- `src/pages/api/ai/generate.json.ts` prompt -> text endpoint

### Environment

Copy `.env.example` and set:

- `OPENAI_API_KEY`

## Notes

- Keep API keys server-side only (never in client bundles).
- Use API routes for AI calls and keep prompts/provider logic inside `src/lib/ai`.
