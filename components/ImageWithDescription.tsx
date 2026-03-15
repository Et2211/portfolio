
import { PortableText } from "@portabletext/react";
import Image from "next/image";

import { buildImageUrl } from "@/lib/sanity";
import type { SanityBlock, SanityImage, SanityKeyed } from "@/types/generated/sanity";

interface ImageWithDescriptionProps {
  image?: SanityImage | string | null;
  description?: SanityKeyed<SanityBlock>[];
}

export const ImageWithDescription = ({ image, description }: ImageWithDescriptionProps) => {
  const imageUrl = typeof image === "string" ? image : image ? buildImageUrl(image) : null;
  return (
    <div className="flex flex-col items-center gap-4">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt="Image with description"
          className="rounded-lg max-w-full h-auto shadow"
          width={600}
          height={400}
          sizes="(max-width: 600px) 100vw, 600px"
        />
      )}
      {description && description.length > 0 && (
        <div className="prose dark:prose-invert text-center">
          <PortableText value={description} />
        </div>
      )}
    </div>
  );
};
