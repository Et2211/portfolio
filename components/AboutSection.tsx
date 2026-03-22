import { PortableText } from "@portabletext/react";
import Image from "next/image";

import type { AboutSectionBlock } from "./DynamicComponentRenderer";

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
            className="rounded-xl object-cover w-40 h-40 sm:w-48 sm:h-48"
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
              <a
                key={link._key ?? idx}
                href={link.url}
                rel="noopener noreferrer"
                className="inline-block rounded-md border border-zinc-300 dark:border-zinc-600 px-4 py-1.5 text-sm font-medium text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
