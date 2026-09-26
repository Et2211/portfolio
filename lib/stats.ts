// Parsing/formatting for StatsBanner's count-up. Values are free text from
// the CMS, e.g. "7+", "1,200+", "4.75", "99.9%".

/** Split a stat like "1,200+" into its number (1200) and suffix ("+"). */
export function parseStatValue(
  raw: string,
): { num: number; suffix: string } | null {
  const match = raw.match(/^([\d.,]+)(.*)$/);
  if (!match) {
    return null;
  }
  const num = parseFloat(match[1].replace(/,/g, ""));
  if (isNaN(num)) {
    return null;
  }
  return { num, suffix: match[2] ?? "" };
}

/**
 * One frame of the count-up: whole numbers while counting to an integer,
 * one decimal place while counting to a fraction. The final frame shows
 * the original string instead, so formatting like "1,200" is kept.
 */
export function formatCount(current: number, target: number, suffix: string) {
  const rounded = Number.isInteger(target)
    ? Math.round(current)
    : Math.round(current * 10) / 10;
  return `${rounded}${suffix}`;
}
