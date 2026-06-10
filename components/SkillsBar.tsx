"use client";

import { motion } from "motion/react";

import { Badge } from "@/components/atoms/Badge";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { useIsPointerDevice } from "@/hooks/useIsPointerDevice";
import { groupBy } from "@/lib/utils";
import type { SkillItem, SkillsBarBlock } from "@/types/blocks";

export const SkillsBar = ({ heading, skills }: SkillsBarBlock) => {
  const isPointer = useIsPointerDevice();

  if (!skills || skills.length === 0) return null;

  const grouped = groupBy<SkillItem>(skills, (skill) => skill.category ?? "Other");

  const hasCategories =
    Object.keys(grouped).some((key) => key !== "Other") ||
    Object.keys(grouped).length > 1;

  return (
    <section className="py-4">
      {heading && <SectionHeading>{heading}</SectionHeading>}
      {hasCategories ? (
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).map(([category, items]) => (
            <motion.div
              key={category}
              className="rounded-xl border border-transparent p-4 -mx-4 transition-colors duration-300"
              whileHover={isPointer ? {
                boxShadow: "0 0 24px oklch(0.56 0.28 280 / 0.14), 0 4px 16px oklch(0 0 0 / 0.06)",
                borderColor: "oklch(0.56 0.28 280 / 0.3)",
              } : undefined}
              transition={{ duration: 0.25 }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map((skill, idx) => (
                  <Badge key={skill._key ?? idx} variant="skill">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </motion.div>
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
