import { createImageUrlBuilder } from "@sanity/image-url";
import { createClient } from "next-sanity";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name} (see .env.example).`);
  }
  return value;
}

const projectId = requireEnv("SANITY_PROJECT_ID");
const dataset = requireEnv("SANITY_DATASET");

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2023-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const builder = createImageUrlBuilder({ projectId, dataset });

export async function fetchSanity<T>(
  query: string,
  params: Record<string, string | number | boolean | null> = {},
): Promise<T> {
  return await sanityClient.fetch<T>(query, params);
}

/** A Sanity image field as returned by GROQ (`...` keeps `_type` and `asset`). */
interface SanityImageField {
  _type?: "image";
  asset: { _ref: string };
}

/**
 * The type of `value` after `buildImageUrls`: every image field becomes its
 * CDN URL string, everything else is unchanged.
 */
export type WithBuiltImages<T> = T extends { _type: "image"; asset: unknown }
  ? string
  : T extends readonly (infer U)[]
    ? WithBuiltImages<U>[]
    : T extends object
      ? { [K in keyof T]: WithBuiltImages<T[K]> }
      : T;

// File assets share the image shape; only refs starting "image-" are images.
const isSanityImageField = (value: unknown): value is SanityImageField => {
  if (typeof value !== "object" || value === null || !("asset" in value)) {
    return false;
  }
  const { asset } = value;
  return (
    typeof asset === "object" &&
    asset !== null &&
    "_ref" in asset &&
    typeof asset._ref === "string" &&
    asset._ref.startsWith("image-")
  );
};

const transformImages = (value: unknown): unknown => {
  if (isSanityImageField(value)) {
    return builder.image(value).url();
  }
  if (Array.isArray(value)) {
    return value.map(transformImages);
  }
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [
        key,
        transformImages(child),
      ]),
    );
  }
  return value;
};

/**
 * Replace every Sanity image field in `value` (at any depth) with its CDN URL,
 * on the server, so client components receive plain strings.
 */
export function buildImageUrls<T>(value: T): WithBuiltImages<T> {
  // The walk mirrors WithBuiltImages; TypeScript can't follow it through
  // `unknown`, so this is the one place the result is asserted.
  return transformImages(value) as WithBuiltImages<T>;
}
