import { PortableText } from "@portabletext/react";
import Image from "next/image";

import { RichText } from "@/components/atoms/RichText";
import { getSimpleIcon } from "@/lib/simpleIcons";
import type { ImageWithDescriptionBlock } from "@/types/blocks";

type ImageWithDescriptionProps = Pick<
  ImageWithDescriptionBlock,
  "icon" | "image" | "description" | "textPosition"
> & {
  /** Fixed square size in px (used inside the carousel). */
  imageSize?: number;
};

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
      className={`flex ${flexDirection} ${isHorizontal ? "items-center lg:items-start" : "items-center"} h-full gap-2`}
      style={{ justifyContent: "left" }}
    >
      {simpleIcon ? (
        <div
          className={`flex flex-shrink-0 items-center justify-center ${isHorizontal ? "w-full lg:w-1/3" : "w-full"}`}
        >
          <svg
            viewBox="0 0 24 24"
            aria-label={simpleIcon.title}
            className="h-24 w-24"
            style={{ fill: `#${simpleIcon.hex}` }}
          >
            <path d={simpleIcon.path} />
          </svg>
        </div>
      ) : image ? (
        <Image
          src={image}
          // Decorative: the description beside it carries the meaning (the CMS
          // has no alt text field yet).
          alt=""
          className={`mx-3 flex-shrink-0 rounded-lg object-contain ${imageSize ? "" : isHorizontal ? "h-auto w-full lg:w-1/3" : "h-auto w-full"}`}
          width={imageSize ?? 600}
          height={imageSize ?? 400}
          sizes={
            imageSize ? `${imageSize}px` : "(max-width: 600px) 100vw, 600px"
          }
          style={
            imageSize
              ? { width: imageSize, height: imageSize }
              : isHorizontal
                ? undefined
                : { maxHeight: "60%" }
          }
        />
      ) : null}
      {description && description.length > 0 && (
        <RichText
          className={`overflow-auto ${isHorizontal ? "text-center lg:w-2/3 lg:text-left" : "text-center"}`}
        >
          <PortableText value={description} />
        </RichText>
      )}
    </div>
  );
};
