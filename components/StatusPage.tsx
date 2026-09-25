import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const ACTION_STYLES = {
  primary:
    "bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200",
  secondary:
    "border border-zinc-300 text-black hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900",
};

type ActionProps = {
  variant?: keyof typeof ACTION_STYLES;
  children: ReactNode;
} & ({ href: string; onClick?: never } | { onClick: () => void; href?: never });

/** A link or button styled for the status (404/error) pages. */
export const StatusAction = ({
  variant = "primary",
  children,
  ...props
}: ActionProps) => {
  const className = cn(
    "inline-block rounded-lg px-6 py-3 transition-colors",
    ACTION_STYLES[variant],
  );
  return props.href ? (
    <Link href={props.href} className={className}>
      {children}
    </Link>
  ) : (
    <button type="button" onClick={props.onClick} className={className}>
      {children}
    </button>
  );
};

/** Full-screen layout shared by the 404 and error pages. */
export const StatusPage = ({
  code,
  title,
  message,
  children,
}: {
  code: string;
  title: string;
  message: string;
  /** StatusAction buttons/links. */
  children: ReactNode;
}) => (
  <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
    <div className="text-center">
      <h1 className="mb-4 text-6xl font-bold text-black dark:text-white">
        {code}
      </h1>
      <h2 className="mb-8 text-2xl font-semibold text-zinc-600 dark:text-zinc-400">
        {title}
      </h2>
      <p className="mb-8 text-zinc-500 dark:text-zinc-500">{message}</p>
      <div className="flex justify-center gap-4">{children}</div>
    </div>
  </div>
);
