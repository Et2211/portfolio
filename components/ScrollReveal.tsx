"use client";

import { useInView } from "@/hooks/useInView";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
}

// Hidden/revealed state lives in CSS (.scroll-reveal in globals.css) so the
// server-rendered HTML is visible when JavaScript isn't available.
export const ScrollReveal = ({ children, delay = 0 }: ScrollRevealProps) => {
  const { ref, isInView } = useInView({ threshold: 0.08 });

  return (
    <div
      ref={ref}
      className="scroll-reveal"
      data-revealed={isInView || undefined}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
