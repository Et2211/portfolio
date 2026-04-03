import { SectionHeading } from "@/components/atoms/SectionHeading";
import type { TestimonialItem, TestimonialsSectionBlock } from "@/types/blocks";

const TestimonialCard = ({ testimonial }: { testimonial: TestimonialItem }) => (
  <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6">
    {testimonial.quote && (
      <blockquote className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed before:content-['\u201c'] after:content-['\u201d'] before:text-zinc-400 after:text-zinc-400">
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

export const TestimonialsSection = ({
  heading,
  testimonials,
}: TestimonialsSectionBlock) => {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-4">
      {heading && <SectionHeading>{heading}</SectionHeading>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {testimonials.map((testimonial, idx) => (
          <TestimonialCard
            key={testimonial._key ?? idx}
            testimonial={testimonial}
          />
        ))}
      </div>
    </section>
  );
};
