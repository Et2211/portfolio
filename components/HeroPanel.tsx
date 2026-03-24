import Image from "next/image";

import { AppLink } from "./AppLink";
import type { HeroPanelBlock } from "./DynamicComponentRenderer";

export const HeroPanel = ({ name, role, tagline, photo, ctaLabel, ctaUrl, imagePosition = "left" }: HeroPanelBlock) => {
  const isRight = imagePosition === "right";
  return (
    <section className={`flex flex-col items-center gap-8 py-8 ${isRight ? "sm:flex-row-reverse" : "sm:flex-row"}`}>
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
      {/* Text */}
      <div className={`flex-1 flex flex-col gap-4 text-center ${isRight ? "sm:text-right" : "sm:text-left"}`}>
        {role && (
          <p className="text-lg sm:text-xl font-medium text-zinc-600 dark:text-zinc-400">
            {role}
          </p>
        )}
        {tagline && (
          <p className="text-base text-zinc-700 dark:text-zinc-300">
            {tagline}
          </p>
        )}
        {ctaLabel && ctaUrl && (
          <div className="mt-2">
            <AppLink href={ctaUrl} variant="primary">
              {ctaLabel}
            </AppLink>
          </div>
        )}
      </div>
    </section>
  );
};
