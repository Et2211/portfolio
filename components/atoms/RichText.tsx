import type { ReactNode } from "react";

interface RichTextProps {
  children: ReactNode;
  className?: string;
}

export const RichText = ({ children, className = "" }: RichTextProps) => (
  <div
    className={`prose prose-sm max-w-none prose-gray dark:prose-invert ${className}`}
  >
    {children}
  </div>
);
