import type { StatsBannerBlock } from "./DynamicComponentRenderer";

export const StatsBanner = ({ stats }: StatsBannerBlock) => {
  if (!stats || stats.length === 0) return null;

  return (
    <section className="py-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={stat._key ?? idx}
            className="flex flex-col items-center gap-1 text-center py-6 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
          >
            {stat.value && (
              <span className="text-3xl sm:text-4xl font-bold text-black dark:text-white">
                {stat.value}
              </span>
            )}
            {stat.label && (
              <span className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
