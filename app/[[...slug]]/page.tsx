import { notFound } from "next/navigation";

import { DynamicComponentRenderer } from "@/components/DynamicComponentRenderer";
import { type Page as StrapiPage, fetchCMS } from "@/lib/strapi";

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

interface PageResponse {
  data: StrapiPage[];
}

async function getPageByUrl(url: string) {
  const data = await fetchCMS<PageResponse>({
    // Explicitly populate nested timeline items within dynamic zone components
    endpoint: `/api/pages?filters[Url][$eq]=${encodeURIComponent(url)}&populate[Page_components][on][timeline.timeline][populate][items][populate]=*`,
    revalidate: 3600, // Cache for 1 hour
  });

  return data.data && data.data.length > 0 ? data.data[0] : null;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  // Build the URL path - default to "/" for homepage
  const url = slug ? `/${slug.join("/")}` : "/";

  // Fetch the page from Strapi
  const page: StrapiPage | null = await getPageByUrl(url);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-black dark:text-white">
          {page.Heading}
        </h1>

        {/* Render dynamic components from Strapi */}
        {page.Page_components && page.Page_components.length > 0 ? (
          <DynamicComponentRenderer components={page.Page_components} />
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

// Generate static params for all pages by calling Strapi directly
export async function generateStaticParams() {
  try {
    const data = await fetchCMS<PageResponse>({
      endpoint: "/api/pages?fields[0]=Url",
    });

    const pages: StrapiPage[] = data.data || [];

    return pages.map((page) => {
      const url = page.Url || "/";
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
