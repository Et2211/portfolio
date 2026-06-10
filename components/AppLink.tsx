"use client";

import Link from "next/link";

const VARIANTS = {
  primary:
    "btn-primary-gradient inline-flex items-center gap-2 rounded-lg text-white px-6 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]",
  secondary:
    "inline-flex items-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-600 px-5 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:border-[var(--accent-vivid)] hover:text-[var(--accent-vivid)] dark:hover:border-[var(--accent-vivid)] dark:hover:text-[var(--accent-vivid)] transition-colors duration-200",
};

type Variant = keyof typeof VARIANTS;

interface AppLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

export const AppLink = ({
  href,
  children,
  variant = "secondary",
  className,
}: AppLinkProps) => {
  const classes = [VARIANTS[variant], className].filter(Boolean).join(" ");
  const isExternal = href.startsWith("http");
  return (
    <Link
      href={href}
      className={classes}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </Link>
  );
};
