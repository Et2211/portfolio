import type { SkillItem, SkillsBarBlock } from "./DynamicComponentRenderer";

export const SkillsBar = ({ heading, skills }: SkillsBarBlock) => {
  if (!skills || skills.length === 0) return null;

  // Group skills by category
  const grouped = skills.reduce<Record<string, SkillItem[]>>((acc, skill) => {
    const cat = skill.category ?? "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const hasCategories = Object.keys(grouped).some((key) => key !== "Other") || Object.keys(grouped).length > 1;

  return (
    <section className="py-4">
      {heading && (
        <h2 className="text-2xl font-bold text-black dark:text-white mb-6">{heading}</h2>
      )}
      {hasCategories ? (
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map((skill, idx) => (
                  <span
                    key={skill._key ?? idx}
                    className="rounded-full border border-zinc-300 dark:border-zinc-600 px-3 py-1 text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <span
              key={skill._key ?? idx}
              className="rounded-full border border-zinc-300 dark:border-zinc-600 px-3 py-1 text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900"
            >
              {skill.name}
            </span>
          ))}
        </div>
      )}
    </section>
  );
};
