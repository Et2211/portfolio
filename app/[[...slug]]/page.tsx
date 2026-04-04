// Fallback ISR revalidation — on-demand revalidation via /api/revalidate webhook is the primary mechanism
export const revalidate = 3600;

import { notFound } from "next/navigation";

import { DynamicComponentRenderer } from "@/components/DynamicComponentRenderer";
import { buildImageUrlsForComponents, fetchSanity } from "@/lib/sanity";
import type { Page } from "@/types/generated/sanity";

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

async function getPageByUrl(url: string): Promise<Page | null> {
  // GROQ query to fetch page by url and its components with full expansion
  const query = `*[_type == "page" && url == $url][0]{
    _id,
    heading,
    url,
    pageComponents[]{
      ...,
      component[]{
        ...,
        items[]{
          ...,
          items[]{
            ...
          }
        }
      }
    }
  }`;
  // Tag this fetch with the page URL so we can invalidate it specifically when this page changes
  return await fetchSanity<Page | null>(
    query,
    { url },
    { tags: [`page-${url}`] },
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const url = slug ? `/${slug.join("/")}` : "/";
  const page = await getPageByUrl(url);
  if (!page?.heading) return {};
  return {
    title: page.heading,
    openGraph: { title: page.heading },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  // Build the URL path - default to "/" for homepage
  const url = slug ? `/${slug.join("/")}` : "/";

  // Fetch the page from Sanity
  const page: Page | null = await getPageByUrl(url);

  if (!page) {
    notFound();
  }

  // Build image URLs server-side to prevent hydration mismatch
  const pageWithBuiltUrls = page.pageComponents
    ? {
        ...page,

        pageComponents: buildImageUrlsForComponents(page.pageComponents),
      }
    : page;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <main className="container mx-auto py-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-black dark:text-white">
          {pageWithBuiltUrls.heading}
        </h1>

        {/* Render dynamic components from Sanity */}
        {pageWithBuiltUrls.pageComponents &&
        pageWithBuiltUrls.pageComponents.length > 0 ? (
          <DynamicComponentRenderer
            components={pageWithBuiltUrls.pageComponents}
          />
        ) : (
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-zinc-600 dark:text-zinc-400">
              No content available for this page.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

// Generate static params for all pages by calling Sanity
export async function generateStaticParams() {
  try {
    const query = `*[_type == "page"]{url}`;
    const pages: Page[] = await fetchSanity(query);
    return pages.map((page) => {
      const url = page.url || "/";
      // Remove leading slash and split into segments
      const slug = url === "/" ? undefined : url.replace(/^\//, "").split("/");
      return { slug };
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-console
    console.error(
      "\n❌ Failed to generate static params for pages:\n",
      message,
      "\n",
    );
    // Return empty array to allow build to continue
    return [];
  }
}
