import type { TechStackBlock } from "./DynamicComponentRenderer";

export const TechStack = ({ heading, groups }: TechStackBlock) => {
  if (!groups || groups.length === 0) return null;

  return (
    <section className="py-4">
      {heading && (
        <h2 className="text-2xl font-bold text-black dark:text-white mb-6">{heading}</h2>
      )}
      <div className="flex flex-col gap-8">
        {groups.map((group, idx) => (
          <div key={group._key ?? idx}>
            <div className="mb-2">
              {group.groupName && (
                <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  {group.groupName}
                </p>
              )}
              {group.description && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{group.description}</p>
              )}
            </div>
            {group.items && group.items.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {group.items.map((item, itemIdx) => (
                  <span
                    key={itemIdx}
                    className="rounded-full border border-zinc-300 dark:border-zinc-600 px-3 py-1 text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
