
import { PortableText } from "@portabletext/react";
import Image from "next/image";

import type { SanityBlock, SanityKeyed } from "@/types/generated/sanity";

interface ImageWithDescriptionProps {
  image?: string | null;
  description?: SanityKeyed<SanityBlock>[];
  textPosition?: 'above' | 'below' | 'before' | 'after';
}

export const ImageWithDescription = ({ image, description, textPosition = 'below' }: ImageWithDescriptionProps) => {
  const isHorizontal = textPosition === 'before' || textPosition === 'after';
  const flexDirection = {
    above: 'flex-col-reverse',
    below: 'flex-col',
    before: 'flex-row-reverse',
    after: 'flex-row'
  }[textPosition];

  return (
    <div className={`flex ${flexDirection} ${isHorizontal ? 'items-start' : 'items-center'} gap-2 h-full`} style={{ justifyContent: 'left' }}>
      {image && (
        <Image
          src={image}
          alt="Image with description"
          className={`rounded-lg object-contain flex-shrink-0 ${isHorizontal ? 'w-1/2 h-auto' : 'w-full h-auto'}`}
          width={600}
          height={400}
          sizes="(max-width: 600px) 100vw, 600px"
          style={isHorizontal ? undefined : { maxHeight: '60%' }}
        />
      )}
      {description && description.length > 0 && (
        <div className={`prose prose-sm prose-gray dark:prose-invert max-w-none overflow-auto ${isHorizontal ? 'w-1/2' : 'text-center'}`}>
          <PortableText value={description} />
        </div>
      )}
    </div>
  );
};
