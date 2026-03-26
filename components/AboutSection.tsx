import { PortableText } from "@portabletext/react";
import Image from "next/image";

import type { AboutSectionBlock } from "@/types/blocks";

import { AppLink } from "./AppLink";

export const AboutSection = ({ photo, bio, links }: AboutSectionBlock) => {
  return (
    <section className="flex flex-col sm:flex-row gap-8 items-start py-4">
      {photo && (
        <div className="flex-shrink-0 mx-auto sm:mx-0">
          <Image
            src={photo}
            alt="About photo"
            width={200}
            height={200}
            className="rounded-xl object-cover w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56"
          />
        </div>
      )}
      <div className="flex flex-col gap-4 flex-1">
        {bio && bio.length > 0 && (
          <div className="prose prose-sm prose-gray dark:prose-invert max-w-none">
            <PortableText value={bio} />
          </div>
        )}
        {links && links.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-2">
            {links.map((link, idx) => (
              <AppLink
                key={link._key ?? idx}
                href={link.url ?? "#"}
                variant="secondary"
              >
                {link.label}
              </AppLink>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
