import { SectionHeading } from "@/components/atoms/SectionHeading";
import type { TestimonialItem, TestimonialsSectionBlock } from "@/types/blocks";

const TestimonialCard = ({ testimonial }: { testimonial: TestimonialItem }) => (
  <div className="flex w-80 flex-shrink-0 flex-col gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
    {testimonial.quote && (
      <blockquote className="text-sm leading-relaxed text-zinc-700 before:text-zinc-400 before:content-['“'] after:text-zinc-400 after:content-['”'] dark:text-zinc-300">
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
  const cards = testimonials.map((testimonial, idx) => (
    <TestimonialCard key={testimonial._key ?? idx} testimonial={testimonial} />
  ));
  // The second copy only makes the loop seamless, so hide it from assistive tech.
  return (
    <div className="overflow-hidden">
      <div
        className={`flex w-max gap-4 ${direction === "left" ? "marquee-left" : "marquee-right"}`}
      >
        <div className="flex gap-4">{cards}</div>
        <div className="flex gap-4" aria-hidden="true">
          {cards}
        </div>
      </div>
    </div>
  );
};

export const TestimonialsSection = ({
  heading,
  testimonials,
}: TestimonialsSectionBlock) => {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Split into two rows for the dual-direction marquee
  const mid = Math.ceil(testimonials.length / 2);
  const row1 = testimonials.slice(0, mid);
  const row2 =
    testimonials.slice(mid).length > 0 ? testimonials.slice(mid) : testimonials;

  return (
    <section className="py-4">
      {heading && <SectionHeading>{heading}</SectionHeading>}
      <div className="marquee-track -mx-4 flex flex-col gap-4 overflow-hidden px-0">
        <MarqueeRow testimonials={row1} direction="left" />
        <MarqueeRow testimonials={row2} direction="right" />
      </div>
    </section>
  );
};
