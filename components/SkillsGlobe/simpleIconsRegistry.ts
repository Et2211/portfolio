import * as simpleIcons from "simple-icons";

export interface SimpleIconData {
  title: string;
  slug: string;
  hex: string;
  path: string;
}

// Map a skill key (e.g. "react", "typescript") to a simple-icons icon data object
export function getSimpleIcon(skillKey: string): SimpleIconData | null {
  if (!skillKey) return null;
  // Accept both "react" and "siReact" (case-insensitive)
  const normalized = skillKey.replace(/^si/i, "").toLowerCase();
  for (const iconKey in simpleIcons) {
    const icon = (simpleIcons as Record<string, SimpleIconData>)[iconKey];
    if (
      icon.slug === normalized ||
      icon.title.toLowerCase() === normalized ||
      iconKey.toLowerCase() === `s${normalized}` ||
      iconKey.toLowerCase() === `si${normalized}`
    ) {
      return icon;
    }
  }
  return null;
}
