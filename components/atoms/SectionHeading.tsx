import type { ReactNode } from "react";

interface SectionHeadingProps {
  children: ReactNode;
  className?: string;
}

export const SectionHeading = ({
  children,
  className = "",
}: SectionHeadingProps) => (
  <div className={`mb-6 ${className}`}>
    <h2 className="bg-linear-135 from-foreground from-30% to-accent-vivid text-gradient text-2xl font-bold">
      {children}
    </h2>
    <div className="mt-2 accent-rule w-14" />
  </div>
);
