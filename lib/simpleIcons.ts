import "server-only";

import * as simpleIcons from "simple-icons";

/** What the UI needs to draw a brand icon. */
export interface IconData {
  title: string;
  hex: string;
  path: string;
}

type SimpleIcon = IconData & { slug: string };

// simple-icons ships ~3,400 icons (several MB). Looking them up on the server
// keeps the package out of the client bundle; only the matched paths are sent.
let index: Map<string, IconData> | null = null;

const buildIndex = () => {
  const map = new Map<string, IconData>();
  for (const [exportName, icon] of Object.entries(
    simpleIcons as Record<string, SimpleIcon>,
  )) {
    const data = { title: icon.title, hex: icon.hex, path: icon.path };
    // Accept the slug ("nextdotjs"), title ("Next.js") or export name ("siReact").
    for (const key of [icon.slug, icon.title, exportName.replace(/^si/, "")]) {
      const normalized = key.toLowerCase();
      if (!map.has(normalized)) {
        map.set(normalized, data);
      }
    }
  }
  return map;
};

/** Look up a simple-icons icon by slug, title or export name (case-insensitive). */
export function getSimpleIcon(key: string | null | undefined): IconData | null {
  if (!key) {
    return null;
  }
  index ??= buildIndex();
  const normalized = key.toLowerCase();
  // Try the key as given first ("siemens", "Signal"), then as an export name
  // without its "si" prefix ("siReact" → "react").
  return (
    index.get(normalized) ??
    (normalized.startsWith("si")
      ? index.get(normalized.slice(2))
      : undefined) ??
    null
  );
}
