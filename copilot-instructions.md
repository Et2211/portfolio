---
name: Portfolio App Workspace Instructions
description: "Enforce strict type safety (no `any`/`unknown` types), run linting and typecheck validation, and guide development. Use when working on the portfolio app."
applyTo: "**/*.{ts,tsx,js,jsx}"
---

# Portfolio App: Workspace Instructions

## Project Overview

**Portfolio CMS System** — A modern, fully type-safe content management and display system for a developer portfolio.

### Architecture

```
portfolio-root/
├── portfolio/                 # Next.js 16.1.6 frontend (Turbopack)
│   ├── app/                   # App Router pages (React Server Components)
│   ├── components/            # React components (TimelineItem, Timeline, etc.)
│   ├── lib/                   # Utilities (sanity.ts client, utils.ts helpers)
│   ├── types/generated/       # Auto-generated Sanity types (@sanity/codegen)
│   └── public/                # Static assets
│
├── studio-portfolio/          # Sanity Studio (CMS admin interface)
│   ├── schemaTypes/           # Content type definitions (navigation, page, timeline, etc.)
│   ├── dist/schemaTypes/      # Compiled JS schemas (ESM-compatible)
│   ├── sanity.config.ts       # Studio config
│   └── sanity.cli.ts          # CLI config
│
└── portfolio-cms/             # Legacy Strapi CMS (deprecated, keeping for reference)
```

### Tech Stack

- **Frontend**: Next.js 16.1.6, React 19, TypeScript (strict mode)
- **CMS**: Sanity.io (projectId: `sjte2cbd`, dataset: `production`)
- **Type Generation**: @sanity/codegen (generates `types/generated/sanity.d.ts`)
- **Styling**: Tailwind CSS + PostCSS
- **Rich Text**: @portabletext/react (renders Sanity Portable Text blocks)
- **Image Handling**: @sanity/image-url (createImageUrlBuilder for server-side URL generation)
- **Linting**: ESLint with auto-fix on save
- **Environment Config**: `.env.local` files with SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_TOKEN

### Data Flow

1. **Content Creation** → Sanity Studio (`studio-portfolio/`)
2. **Type Generation** → @sanity/codegen generates `types/generated/sanity.d.ts`
3. **Content Fetching** → `portfolio/lib/sanity.ts` → `fetchSanity()` GROQ queries
4. **Server-Side Processing** → `portfolio/app/[[...slug]]/page.tsx`:
   - Fetches page + components from Sanity
   - Builds image URLs server-side (prevents hydration mismatch)
   - Pre-processes component data
5. **Client Rendering** → React components receive fully-processed data as strings/objects

### Key Sanity Content Types

- **Page** — Main content document (heading, URL, pageComponents array for dynamic content)
- **Navigation** — Site navigation structure
- **Timeline** — Container for timeline items (dates, descriptions, images)
- **TimelineItem** — Individual timeline entries (with portable text descriptions)
- **NavGroup** — Navigation grouping
- **NavItem** — Navigation items

---

## Code Quality Requirements

### 🚫 Type Safety

**ZERO `any` or `unknown` types allowed.** Every variable, parameter, and return type must be explicitly defined.

✅ **Good:**
```typescript
import type { Page } from "@/types/generated/sanity";

const getPageByUrl = async (url: string): Promise<Page | null> => {
  const query = `*[_type == "page" && url == $url][0]`;
  return await fetchSanity<Page>(query, { url });
};
```

❌ **Bad:**
```typescript
const getPageByUrl = async (url: any): any => {
  return await fetchSanity(query, { url });
};
```

**When importing types:**
- Always use `import type { TypeName } from "@/types/generated/sanity"`
- This ensures types are stripped at runtime (no bundle bloat)
- For unknown structures, use type assertions or generics, **never** `any`

### ✅ Linting & Formatting

All files must pass `npm run lint` without errors:

```bash
npm run lint          # Check for linting errors
npm run lint --fix    # Auto-fix fixable errors
```

**ESLint is configured to:**
- Enforce no `var` (use `const` by default, `let` if needed)
- Enforce no trailing semicolons (handled by Prettier via ESLint)
- Enforce consistent formatting
- Flag unused variables and imports
- Enforce React best practices (hooks, naming conventions)

**VS Code auto-fixes on save:** ESLint auto-fix runs on file save because `.vscode/settings.json` includes:
```json
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true
}
```

### ✅ TypeScript Strict Mode

All files must pass `npm run typecheck` without errors:

```bash
npm run typecheck      # Type check entire project
```

**TypeScript strict mode enforces:**
- No implicit `any` types
- Null/undefined safety (strict null checks)
- Function parameter and return types required
- No unchecked `any` type assertions

### 🔄 Pre-Commit Checklist

Before committing any code changes, verify:

1. **Tests pass:** `npm run typecheck && npm run lint`
2. **No `any`/`unknown`:** Search for `any` and `unknown` in your changes
3. **Build succeeds:** `npm run build` (or verify Turbopack compiles without error)
4. **Components receive correct types:** Verify all React component props are fully typed

---

## Common Patterns & Guidelines

### Image URL Handling (Critical!)

**Images must be processed server-side to prevent hydration mismatch.**

✅ **Correct (server-side in page.tsx):**
```typescript
import { buildImageUrl } from "@/lib/sanity";
import type { SanityImage } from "@/types/generated/sanity";

function buildImageUrlsForComponents(components: unknown[]): unknown[] {
  return components.map((component: any) => {
    if (component._type === "timeline" && component.items) {
      return {
        ...component,
        items: component.items.map((item: any) => ({
          ...item,
          image: item.image ? buildImageUrl(item.image) : null,
        })),
      };
    }
    return component;
  });
}

// In async Page() component:
const pageWithBuiltUrls = page.pageComponents
  ? {
      ...page,
      pageComponents: buildImageUrlsForComponents(page.pageComponents),
    }
  : page;
```

❌ **Wrong (client-side):**
```typescript
// ❌ Never do this in client components:
const imageUrl = buildImageUrl(image);  // env vars undefined on client!
```

**Why server-side?** 
- `buildImageUrl()` uses SANITY_PROJECT_ID and SANITY_DATASET
- Environment variables are only available on server at Next.js build/runtime
- Server renders HTML with correct image URLs
- Client hydrates with identical URLs (no mismatch warning)

### Fetching Data from Sanity

✅ **Use type-safe GROQ queries:**
```typescript
import { fetchSanity } from "@/lib/sanity";
import type { Page } from "@/types/generated/sanity";

const query = `*[_type == "page" && url == $url][0]{
  _id,
  heading,
  url,
  pageComponents[]
}`;

const page = await fetchSanity<Page>(query, { url: "/about" });
```

### Rendering Portable Text (Rich Text)

✅ **Use @portabletext/react:**
```typescript
import { PortableText } from "@portabletext/react";
import type { SanityBlock } from "@/types/generated/sanity";

interface Props {
  description: SanityBlock[] | null | undefined;
}

export function TimelineItem({ description }: Props) {
  return (
    <div>
      {description ? (
        <PortableText value={description} />
      ) : (
        <p>No description available</p>
      )}
    </div>
  );
}
```

### Component Prop Types

✅ **Always define prop interfaces:**
```typescript
interface TimelineProps {
  items: TimelineItem[];
  title: string;
  variant?: "default" | "compact";
}

export function Timeline({ items, title, variant = "default" }: TimelineProps) {
  // ...
}
```

❌ **Never use inline `any`:**
```typescript
export function Timeline(props: any) {  // ❌ BANNED
  // ...
}
```

---

## Frequently Asked Questions

### Q: How do I add a new content type to Sanity?

1. **Define the schema** in `studio-portfolio/schemaTypes/` (e.g., `myNewType.ts`)
2. **Export it** from `studio-portfolio/schemaTypes/index.ts`
3. **Run codegen:** `npm run sanity:codegen` (in `studio-portfolio/`)
4. **Use generated types** in frontend (`portfolio/`): `import type { MyNewType } from "@/types/generated/sanity"`

### Q: How do I regenerate types after schema changes?

In `studio-portfolio/`:
```bash
npm run sanity:codegen
# Generates: ../portfolio/types/generated/sanity.d.ts
```

### Q: Can I use `any` for external libraries I don't have types for?

No. Instead:
1. Look for `@types/library-name` package
2. If none exists, define a minimal interface wrapper
3. Use `as` type assertions sparingly and with explanation comments

Example:
```typescript
// ✅ Acceptable with explanation
interface ExternalLibraryConfig {
  [key: string]: unknown;  // External library doesn't have types
}
```

### Q: How do I debug hydration mismatches?

**Check:**
1. Is data fetched server-side? ✓
2. Are environment variables used server-side only? ✓
3. Does client receive pre-processed data (strings, primitives)? ✓
4. Are derived values computed server-side? ✓

If you see `Warning: Text content did not match between server and client`, ensure all dynamic data is computed on the server before passing to client components.

### Q: How do I run tests locally?

`npm run typecheck` — This is your primary test suite (TypeScript + type checking)  
`npm run lint` — ESLint checks for code quality issues

### Q: Where are environment variables stored?

- `portfolio/.env.local` — Frontend env vars (SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_TOKEN)
- `studio-portfolio/.env.local` — Studio env vars (SANITY_PROJECT_ID, SANITY_DATASET)

Never commit `.env.local` files to Git (included in `.gitignore`).

---

## Command Reference

```bash
# Type checking & linting (run before commits)
npm run typecheck          # TypeScript strict mode check
npm run lint               # ESLint validation
npm run lint --fix         # Auto-fix linting errors

# Building & running
npm run build              # Build portfolio app
npm run dev                # Start dev server (Turbopack)
npm run sanity:dev         # Start Sanity Studio

# Type generation (after schema changes)
cd studio-portfolio
npm run sanity:codegen     # Generate types

# Viewing Sanity dashboard
# https://sanity.io/manage/projects/sjte2cbd
```

---

## Migration Context: Strapi → Sanity

This project was migrated from **Strapi CMS** to **Sanity.io**. Important notes:

- **Legacy Strapi** (in `portfolio-cms/`) is deprecated, kept for reference only
- **Sanity Studio** (`studio-portfolio/`) is now the source of truth for content
- **Type generation** ensures frontend always has correct types from CMS
- **Image URLs** moved from Strapi URLs to Sanity `@sanity/image-url` builder
- **Rich text** migrated from Strapi blocks to Sanity Portable Text
- **All manual types replaced** with @sanity/codegen generated types

---

## Sanity Schema & Type Generation Workflow (2026 Update)

**To ensure type generation works with TypeScript-based Sanity schemas:**
```
import { navigation, page } from './navigation-page.js'
```

1. **Use `.js` extensions in all imports in `studio-portfolio/schemaTypes/index.ts`**
   - Example: `import { navigation, page } from './navigation-page.js'`
2. **Compile schemas to `dist/schemaTypes/` before running codegen:**
   - From `studio-portfolio/`, run: `npm run build:schemas`
3. **Run type generation from the app directory:**
   - From `portfolio/`, run: `npm run codegen:sanity`
4. **If you see module resolution errors:**
   - Check that all imports in `index.ts` use `.js` extensions
   - Ensure all schema files are present in `dist/schemaTypes/`
   - Rebuild schemas if needed

**Why?** Node.js ESM requires explicit `.js` extensions in imports. TypeScript does not add these by default, so you must write them in your source. This ensures `sanity-codegen` can resolve all modules and generate types reliably.

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `portfolio/lib/sanity.ts` | Sanity client, `fetchSanity()`, `buildImageUrl()` |
| `portfolio/app/[[...slug]]/page.tsx` | Dynamic page rendering, image URL building |
| `portfolio/types/generated/sanity.d.ts` | **Auto-generated types from Sanity schemas** |
| `studio-portfolio/schemaTypes/index.ts` | Sanity content type exports |
| `portfolio/.env.local` | Environment variables (git-ignored) |
| `.vscode/settings.json` | ESLint auto-fix on save, TypeScript validation |

---

## Enforcement

**Before committing:**

```bash
# 1. Run full validation
npm run typecheck && npm run lint

# 2. Check for any/unknown types
grep -r "any\|unknown" src/app src/components src/lib --include="*.ts" --include="*.tsx"

# 3. Build to catch runtime errors
npm run build
```

**If validation fails:** Fix the errors before committing. These checks are non-negotiable.
