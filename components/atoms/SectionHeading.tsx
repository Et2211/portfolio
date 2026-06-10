import type { ReactNode } from "react";

interface SectionHeadingProps {
  children: ReactNode;
  className?: string;
}

export const SectionHeading = ({ children, className = "" }: SectionHeadingProps) => (
  <div className={`mb-6 ${className}`}>
    <h2
      className="text-2xl font-bold"
      style={{
        background: "linear-gradient(135deg, var(--foreground) 30%, var(--accent-vivid) 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </h2>
    <div
      className="mt-2 h-0.5 w-14 rounded-full"
      style={{ background: "linear-gradient(90deg, var(--accent-vivid), var(--accent-vivid-2))" }}
    />
  </div>
);
