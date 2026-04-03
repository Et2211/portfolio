import type { ReactNode } from "react";

interface RichTextProps {
  children: ReactNode;
  className?: string;
}

export const RichText = ({ children, className = "" }: RichTextProps) => (
  <div className={`prose prose-sm prose-gray dark:prose-invert max-w-none ${className}`}>
    {children}
  </div>
);
