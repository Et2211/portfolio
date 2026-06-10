"use client";

import { motion } from "motion/react";

import { Badge } from "@/components/atoms/Badge";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { useIsPointerDevice } from "@/hooks/useIsPointerDevice";
import type { TechStackBlock } from "@/types/blocks";

export const TechStack = ({ heading, groups }: TechStackBlock) => {
  const isPointer = useIsPointerDevice();

  if (!groups || groups.length === 0) return null;

  const allItems = groups.flatMap((g) => g.items ?? []);
  const stripItems = allItems.length > 0 ? [...allItems, ...allItems] : [];

  return (
    <section className="py-4">
      {heading && <SectionHeading>{heading}</SectionHeading>}
      <div className="flex flex-col gap-8">
        {groups.map((group, idx) => (
          <motion.div
            key={group._key ?? idx}
            className="rounded-xl border border-transparent p-4 -mx-4 transition-colors duration-300"
            whileHover={isPointer ? {
              boxShadow: "0 0 24px oklch(0.56 0.28 280 / 0.14), 0 4px 16px oklch(0 0 0 / 0.06)",
              borderColor: "oklch(0.56 0.28 280 / 0.3)",
            } : undefined}
            transition={{ duration: 0.25 }}
          >
            <div className="mb-2">
              {group.groupName && (
                <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  {group.groupName}
                </p>
              )}
              {group.description && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  {group.description}
                </p>
              )}
            </div>
            {group.items && group.items.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {group.items.map((item, itemIdx) => (
                  <Badge key={itemIdx} variant="skill">
                    {item}
                  </Badge>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Scrolling strip of all technologies */}
      {stripItems.length > 0 && (
        <div className="tech-strip-wrap mt-10 -mx-4 overflow-hidden">
          <div className="tech-strip flex gap-3 w-max py-2">
            {stripItems.map((item, i) => (
              <Badge key={i} variant="skill">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
