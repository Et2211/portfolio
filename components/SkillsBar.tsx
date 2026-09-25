import { Badge } from "@/components/atoms/Badge";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { groupBy } from "@/lib/utils";
import type { SkillItem, SkillsBarBlock } from "@/types/blocks";

export const SkillsBar = ({ heading, skills }: SkillsBarBlock) => {
  if (!skills || skills.length === 0) {
    return null;
  }

  const grouped = groupBy<SkillItem>(
    skills,
    (skill) => skill.category ?? "Other",
  );

  const hasCategories =
    Object.keys(grouped).some((key) => key !== "Other") ||
    Object.keys(grouped).length > 1;

  return (
    <section className="py-4">
      {heading && <SectionHeading>{heading}</SectionHeading>}
      {hasCategories ? (
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).map(([category, items]) => (
            <div
              key={category}
              className="-mx-4 rounded-xl border border-transparent p-4 transition-[border-color,box-shadow] duration-300 hover:border-accent-vivid/30 hover:shadow-glow-sm"
            >
              <p className="mb-2 text-xs font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map((skill, idx) => (
                  <Badge key={skill._key ?? idx} variant="skill">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <Badge key={skill._key ?? idx} variant="skill">
              {skill.name}
            </Badge>
          ))}
        </div>
      )}
    </section>
  );
};
