---
name: Portfolio App Workspace Instructions
description: "Conventions for the portfolio app: type safety, component style, data flow and the checks to run. Use when working on the portfolio app."
applyTo: "**/*.{ts,tsx,js,jsx,mjs,css}"
---

# Portfolio App: Workspace Instructions

See `README.md` for the architecture overview. This file covers the
conventions to follow when changing code.

## Checks (must pass before committing)

```bash
npm run lint && npm run format:check && npm run typecheck && npm test
```

The pre-commit hook runs lint-staged (ESLint `--fix` + Prettier on staged
files), `typecheck` and `test`; CI runs all four on pull requests.

## Type safety

- **No `any`.** `unknown` is fine at trust boundaries (JSON bodies, CMS data
  walks) as long as it's narrowed with a type guard before use.
- Import types with `import type`.
- Block prop types come from `types/blocks.ts`, which derives them from the
  generated Sanity types (`Resolved<T>`). Don't hand-write block types or
  import from `types/generated/sanity` in components when a `types/blocks`
  alias exists.
- Keep type assertions rare, local and commented (see `buildImageUrls` in
  `lib/sanity.ts` and `renderBlock` in `DynamicComponentRenderer.tsx`).

## Components

- Arrow-function components with named exports
  (`export const Timeline = (...) => ...`). Only Next.js files (`page.tsx`,
  `layout.tsx`, `error.tsx`, `not-found.tsx`) use default exports.
- Server components by default. Add `"use client"` only for state, effects,
  browser APIs or motion. Prefer CSS (Tailwind `hover:`, which only applies on
  hover-capable devices) over JS for hover effects.
- Block components take their block's fields as props
  (`({ heading, items }: TimelineBlock)`) and are registered in
  `BLOCK_COMPONENTS` in `DynamicComponentRenderer.tsx`.
- Reuse the shared pieces: `AppLink` (primary / secondary / text), `SectionHeading`,
  `Eyebrow`, `Badge`, `TagList`, `RichText`, `ProjectFeature`, `StatusPage`.
- Use `cn()` from `lib/utils` to combine class names.

## Styling

- Colours come from theme tokens, never literals: `text-accent-vivid`,
  `border-accent-vivid/30`, `shadow-glow-sm|md|lg`, and in inline styles
  `var(--accent-vivid)` / `color-mix(in oklch, var(--accent-vivid) 20%, transparent)`.
  In SVG use `style={{ stopColor: "var(--accent-vivid)" }}`, not the attribute.
- Shared utilities in `app/globals.css`: `text-gradient`, `accent-rule`,
  `surface-card`, `surface-muted`, easing `ease-out-expo` / `ease-out-back`.
- Prettier sorts Tailwind classes; don't reorder by hand.

## Hydration and rendering

- Never read `window`, `document`, `matchMedia`, `Date.now()` or the local
  time zone during render. Use `useMediaQuery` / `useIsPointerDevice` /
  `usePrefersReducedMotion` (server snapshot `false`) and format dates in UTC
  (`formatDate`).
- Content must be visible without JavaScript: hide things for an animation
  only under `@media (scripting: enabled)` (see `.scroll-reveal`), and prefer
  CSS keyframes for entrance animations.
- Respect `prefers-reduced-motion` for JS-driven animation.

## Data

- GROQ lives in `lib/queries.ts`; cached fetchers in `lib/content.ts`
  (`"use cache"`, `cacheLife("days")`, a tag from `lib/cacheTags.ts`).
- Don't catch errors inside a `"use cache"` function: the fallback would be
  cached. Catch at the call site.
- Images are resolved to URLs by `buildImageUrls` inside the fetchers.
- `lib/simpleIcons.ts` is `server-only`; resolve icons on the server and pass
  `{ title, hex, path }` down.

## Sanity types

After changing schemas in `../studio-portfolio`:

```bash
npm run codegen:full   # rebuild Studio schemas + regenerate types
```

Studio schema imports in `schemaTypes/index.ts` need `.js` extensions so the
compiled schemas resolve under Node ESM.
