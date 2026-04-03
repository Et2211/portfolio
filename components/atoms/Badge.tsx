import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  /** "tag" = compact project tag (no border). "skill" = larger skill pill (with border). */
  variant?: "tag" | "skill";
}

export const Badge = ({ children, variant = "tag" }: BadgeProps) => {
  if (variant === "skill") {
    return (
      <span className="rounded-full border border-zinc-300 dark:border-zinc-600 px-3 py-1 text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900">
        {children}
      </span>
    );
  }
  return (
    <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-700 dark:text-zinc-300">
      {children}
    </span>
  );
};
