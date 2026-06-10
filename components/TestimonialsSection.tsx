import { SectionHeading } from "@/components/atoms/SectionHeading";
import type { TestimonialItem, TestimonialsSectionBlock } from "@/types/blocks";

const TestimonialCard = ({ testimonial }: { testimonial: TestimonialItem }) => (
  <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 w-80 flex-shrink-0">
    {testimonial.quote && (
      <blockquote className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed before:content-['“'] after:content-['”'] before:text-zinc-400 after:text-zinc-400">
        {testimonial.quote}
      </blockquote>
    )}
    <footer className="mt-auto">
      {testimonial.author && (
        <p className="text-sm font-semibold text-black dark:text-white">
          {testimonial.author}
        </p>
      )}
      {(testimonial.role || testimonial.company) && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {[testimonial.role, testimonial.company].filter(Boolean).join(" · ")}
        </p>
      )}
    </footer>
  </div>
);

const MarqueeRow = ({
  testimonials,
  direction,
}: {
  testimonials: TestimonialItem[];
  direction: "left" | "right";
}) => {
  // Duplicate cards so the loop is seamless
  const doubled = [...testimonials, ...testimonials];
  return (
    <div className="overflow-hidden">
      <div className={`flex gap-4 w-max ${direction === "left" ? "marquee-left" : "marquee-right"}`}>
        {doubled.map((t, i) => (
          <TestimonialCard key={i} testimonial={t} />
        ))}
      </div>
    </div>
  );
};

export const TestimonialsSection = ({
  heading,
  testimonials,
}: TestimonialsSectionBlock) => {
  if (!testimonials || testimonials.length === 0) return null;

  // Split into two rows for the dual-direction marquee
  const mid = Math.ceil(testimonials.length / 2);
  const row1 = testimonials.slice(0, mid);
  const row2 = testimonials.slice(mid).length > 0 ? testimonials.slice(mid) : testimonials;

  return (
    <section className="py-4">
      {heading && <SectionHeading>{heading}</SectionHeading>}
      <div className="marquee-track flex flex-col gap-4 overflow-hidden -mx-4 px-0">
        <MarqueeRow testimonials={row1} direction="left" />
        <MarqueeRow testimonials={row2} direction="right" />
      </div>
    </section>
  );
};
