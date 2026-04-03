import { PortableText } from "@portabletext/react";
import Image from "next/image";

import { getSimpleIcon } from "@/components/SkillsGlobe/simpleIconsRegistry";
import type { SanityBlock, SanityKeyed } from "@/types/generated/sanity";

interface ImageWithDescriptionProps {
  icon?: string | null;
  image?: string | null;
  description?: SanityKeyed<SanityBlock>[];
  textPosition?: "above" | "below" | "before" | "after";
  imageSize?: number;
}

export const ImageWithDescription = ({
  icon,
  image,
  description,
  textPosition = "below",
  imageSize,
}: ImageWithDescriptionProps) => {
  const isHorizontal = textPosition === "before" || textPosition === "after";
  const flexDirection = {
    above: "flex-col-reverse",
    below: "flex-col",
    before: "flex-col lg:flex-row-reverse",
    after: "flex-col lg:flex-row",
  }[textPosition];

  const simpleIcon = icon ? getSimpleIcon(icon) : null;

  return (
    <div
      className={`flex ${flexDirection} ${isHorizontal ? "items-center lg:items-start" : "items-center"} gap-2 h-full`}
      style={{ justifyContent: "left" }}
    >
      {simpleIcon ? (
        <div
          className={`flex items-center justify-center flex-shrink-0 ${isHorizontal ? "w-full lg:w-1/3" : "w-full"}`}
        >
          <svg
            viewBox="0 0 24 24"
            aria-label={simpleIcon.title}
            className="w-24 h-24"
            style={{ fill: `#${simpleIcon.hex}` }}
          >
            <path d={simpleIcon.path} />
          </svg>
        </div>
      ) : image ? (
        <Image
          src={image}
          alt="Image with description"
          className={`rounded-lg mx-3 object-contain flex-shrink-0 ${imageSize ? "" : isHorizontal ? "w-full lg:w-1/3 h-auto" : "w-full h-auto"}`}
          width={imageSize ?? 600}
          height={imageSize ?? 400}
          sizes={imageSize ? `${imageSize}px` : "(max-width: 600px) 100vw, 600px"}
          style={imageSize ? { width: imageSize, height: imageSize } : isHorizontal ? undefined : { maxHeight: "60%" }}
        />
      ) : null}
      {description && description.length > 0 && (
        <div
          className={`prose prose-sm prose-gray dark:prose-invert max-w-none overflow-auto ${isHorizontal ? "text-center lg:text-left lg:w-2/3" : "text-center"}`}
        >
          <PortableText value={description} />
        </div>
      )}
    </div>
  );
};
