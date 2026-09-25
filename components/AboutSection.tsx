import { PortableText } from "@portabletext/react";
import Image from "next/image";

import { RichText } from "@/components/atoms/RichText";
import type { AboutSectionBlock } from "@/types/blocks";

import { AppLink } from "./AppLink";

export const AboutSection = ({ photo, bio, links }: AboutSectionBlock) => {
  return (
    <section className="flex flex-col items-start gap-8 py-4 sm:flex-row">
      {photo && (
        <div className="mx-auto flex-shrink-0 sm:mx-0">
          <Image
            src={photo}
            alt=""
            width={200}
            height={200}
            className="h-40 w-40 rounded-xl object-cover sm:h-48 sm:w-48 md:h-56 md:w-56"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-4">
        {bio && bio.length > 0 && (
          <RichText>
            <PortableText value={bio} />
          </RichText>
        )}
        {links && links.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-3">
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
