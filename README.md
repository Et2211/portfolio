# Portfolio

My personal portfolio site. Every page is built from content in Sanity: pages are
lists of page-builder blocks (hero, timeline, architecture diagram, project
cards, …) rendered by one catch-all Next.js route.

**Stack:** Next.js 16 (App Router, Cache Components, Turbopack) · React 19 ·
TypeScript · Tailwind CSS v4 · Motion · Sanity · Vercel.

## Getting started

```bash
cp .env.example .env.local   # then fill in the values
npm install
npm run dev                  # http://localhost:3000
```

| Variable            | Purpose                                                     |
| ------------------- | ----------------------------------------------------------- |
| `SANITY_PROJECT_ID` | Sanity project                                              |
| `SANITY_DATASET`    | Sanity dataset, e.g. `production`                           |
| `SANITY_API_TOKEN`  | Optional; only needed for private datasets                  |
| `REVALIDATE_SECRET` | Shared with the Sanity webhook that calls `/api/revalidate` |

The Sanity Studio lives in a sibling repo, `../studio-portfolio`.
`npm run dev:all` runs the site and the Studio together.

## How it works

```
app/[[...slug]]/page.tsx       catch-all route: URL → Sanity page → blocks
components/DynamicComponentRenderer.tsx   block _type → component registry
lib/queries.ts                 GROQ queries
lib/content.ts                 cached fetchers ("use cache" + cache tags)
lib/cacheTags.ts               tag names shared with the revalidate webhook
lib/sanity.ts                  Sanity client, image URL resolution
types/blocks.ts                block prop types, derived from the Sanity schema
types/generated/sanity.d.ts    generated from the Studio schemas (don't edit)
```

- **Rendering.** Each page is a list of sections, each holding one block. The
  renderer maps each block's `_type` to a component; the map is typed so a
  schema block without a component (or with the wrong one) fails to compile.
- **Types.** Block types are derived from the generated schema types via
  `Resolved<T>`, which reflects that image fields arrive as URL strings.
- **Images** are resolved to CDN URLs on the server, inside the cached
  fetchers, so client components only ever receive strings.
- **Caching.** Pages, navigation and the footer are cached with `"use cache"`
  and invalidated on publish by a Sanity webhook hitting `/api/revalidate`,
  which expires `page:<url>` or `sanity:global`. Unknown URLs return a real 404.
- **Progressive enhancement.** Content is visible without JavaScript: reveal
  and count-up animations only hide things under `@media (scripting: enabled)`,
  and the hero entrance is CSS.

### Adding a block

1. Add the schema in the Studio and run `npm run codegen:full`.
2. Add `Resolved<Sanity.NewBlock>` to `types/blocks.ts` (the compiler points
   you at the union and registry that need it).
3. Create the component, taking the block's fields as props, and register it
   in `BLOCK_COMPONENTS`.

## Scripts

| Script                   | What it does                                                     |
| ------------------------ | ---------------------------------------------------------------- |
| `npm run dev`            | Dev server                                                       |
| `npm run build`          | Production build                                                 |
| `npm run lint`           | ESLint (including jsx-a11y)                                      |
| `npm run format`         | Prettier (with Tailwind class sorting); `format:check` to verify |
| `npm run typecheck`      | `tsc --noEmit`                                                   |
| `npm test`               | Vitest unit tests (`test:watch` for watch mode)                  |
| `npm run codegen:full`   | Rebuild Studio schemas, then regenerate Sanity types             |
| `npm run codegen:sanity` | Regenerate types from the existing Studio build                  |

A pre-commit hook runs lint-staged (ESLint + Prettier), the type check and the
tests; GitHub Actions runs the same checks on pull requests.

### Troubleshooting

If CSS changes (especially to `app/globals.css`) don't show up in dev, stop the
server and clear Turbopack's cache: `rm -rf .next && npm run dev`.
