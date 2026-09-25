import Link from "next/link";
import type { ReactNode } from "react";

import { externalLinkProps } from "@/lib/links";
import { cn } from "@/lib/utils";

const VARIANTS = {
  primary:
    "btn-primary-gradient inline-flex items-center gap-2 rounded-lg text-white px-6 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]",
  secondary:
    "inline-flex items-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-600 px-5 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:border-accent-vivid hover:text-accent-vivid dark:hover:border-accent-vivid dark:hover:text-accent-vivid transition-colors duration-200",
  text: "font-medium text-black dark:text-white underline underline-offset-2 hover:opacity-70 transition-opacity",
};

interface AppLinkProps {
  href: string;
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  className?: string;
}

export const AppLink = ({
  href,
  children,
  variant = "secondary",
  className,
}: AppLinkProps) => (
  <Link
    href={href}
    className={cn(VARIANTS[variant], className)}
    {...externalLinkProps(href)}
  >
    {children}
  </Link>
);
