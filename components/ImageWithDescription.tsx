
import { PortableText } from "@portabletext/react";
import Image from "next/image";

import type { SanityBlock, SanityKeyed } from "@/types/generated/sanity";

interface ImageWithDescriptionProps {
  image?: string | null;
  description?: SanityKeyed<SanityBlock>[];
}

export const ImageWithDescription = ({ image, description }: ImageWithDescriptionProps) => {
  return (
    <div className="flex flex-col items-center gap-2 h-full">
      {image && (
        <Image
          src={image}
          alt="Image with description"
          className="rounded-lg w-full h-auto object-contain flex-shrink-0"
          width={600}
          height={400}
          sizes="(max-width: 600px) 100vw, 600px"
          style={{ maxHeight: '60%' }}
        />
      )}
      {description && description.length > 0 && (
        <div className="prose prose-sm prose-gray dark:prose-invert text-center max-w-none overflow-auto">
          <PortableText value={description} />
        </div>
      )}
    </div>
  );
};
