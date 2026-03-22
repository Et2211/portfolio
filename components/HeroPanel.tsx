import Image from "next/image";
import Link from "next/link";

import type { HeroPanelBlock } from "./DynamicComponentRenderer";

export const HeroPanel = ({ name, role, tagline, photo, ctaLabel, ctaUrl }: HeroPanelBlock) => {
  return (
    <section className="flex flex-col sm:flex-row items-center gap-8 py-8">
      {/* Text */}
      <div className="flex-1 flex flex-col gap-4 text-center sm:text-left">
        {role && (
          <p className="text-lg sm:text-xl font-medium text-zinc-600 dark:text-zinc-400">
            {role}
          </p>
        )}
        {tagline && (
          <p className="text-base text-zinc-700 dark:text-zinc-300 max-w-lg">
            {tagline}
          </p>
        )}
        {ctaLabel && ctaUrl && (
          <div className="mt-2">
            <Link
              href={ctaUrl}
              className="inline-block rounded-md bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 text-sm font-medium hover:opacity-80 transition-opacity"
            >
              {ctaLabel}
            </Link>
          </div>
        )}
      </div>

      {/* Photo */}
      {photo && (
        <div className="flex-shrink-0">
          <Image
            src={photo}
            alt={name ?? "Profile photo"}
            width={240}
            height={240}
            className="rounded-full object-cover w-40 h-40 sm:w-56 sm:h-56"
            priority
          />
        </div>
      )}
    </section>
  );
};
