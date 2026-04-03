import type { ReactNode } from "react";

interface SectionHeadingProps {
  children: ReactNode;
  className?: string;
}

export const SectionHeading = ({ children, className = "" }: SectionHeadingProps) => (
  <h2 className={`text-2xl font-bold text-black dark:text-white mb-6 ${className}`}>
    {children}
  </h2>
);
