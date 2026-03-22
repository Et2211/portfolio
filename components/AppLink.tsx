import Link from "next/link";

const VARIANTS = {
  primary:
    "inline-flex items-center gap-2 rounded-md bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 text-sm font-medium hover:opacity-80 transition-opacity",
  secondary:
    "inline-flex items-center gap-2 rounded-md border border-zinc-300 dark:border-zinc-600 px-5 py-2 text-sm font-medium text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors",
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
