import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    // Turbopack's persistent disk cache has served stale Tailwind CSS: both
    // the dev server and `next build` kept outputting old globals.css /
    // missed newly used classes until .next/cache was deleted. Vercel keeps
    // .next/cache between deploys, so a stale build cache could ship. Keep it
    // off until that's fixed upstream (cold builds of this site are quick).
    turbopackFileSystemCacheForDev: false,
    turbopackFileSystemCacheForBuild: false,
  },
  images: {
    // Images are served straight from the Sanity CDN. Whether to route them
    // through next/image optimisation (Vercel quota) is still to be decided.
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;
