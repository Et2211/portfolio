import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  children: ReactNode;
  align?: "start" | "center";
  className?: string;
}

export const SectionHeading = ({
  children,
  align = "start",
  className,
}: SectionHeadingProps) => (
  <div
    className={cn(
      "mb-6",
      align === "center" && "flex flex-col items-center text-center",
      className,
    )}
  >
    <h2 className="bg-linear-135 from-foreground from-30% to-accent-vivid text-gradient text-2xl font-bold">
      {children}
    </h2>
    <div className="mt-2 accent-rule w-14" />
  </div>
);
