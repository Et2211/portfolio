import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Small uppercase label above a group of content. */
export const Eyebrow = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <p
    className={cn(
      "text-xs font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400",
      className,
    )}
  >
    {children}
  </p>
);
