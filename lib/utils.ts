import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  if (!dateString) {
    return "";
  }
  // Sanity dates are plain YYYY-MM-DD strings, which JS parses as UTC
  // midnight. Format in UTC too, otherwise visitors west of UTC see the
  // previous month (and the server/client render disagree).
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export function groupBy<T>(
  items: T[],
  key: (item: T) => string,
): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const group = key(item);
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(item);
    return acc;
  }, {});
}
