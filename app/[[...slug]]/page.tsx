import { notFound } from "next/navigation";

import { fetchCMS } from "@/lib/strapi";
import { Page as StrapiPage } from "@/types/strapi";

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

async function getPageByUrl(url: string) {
  const data = await fetchCMS<{ data: StrapiPage[] }>({
    endpoint: `/api/pages?filters[Url][$eq]=${encodeURIComponent(url)}&populate=*`,
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

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-zinc-600 dark:text-zinc-400">
            Current path: {url}
          </p>
          {/* Add more page content here as you expand your Strapi schema */}
        </div>
      </main>
    </div>
  );
}

// Generate static params for all pages by calling Strapi directly
export async function generateStaticParams() {
  try {
    const data = await fetchCMS<{ data: StrapiPage[] }>({
      endpoint: "/api/pages?populate=*",
    });

    const pages: StrapiPage[] = data.data || [];

    return pages.map((page) => {
      const url = page.Url || "/";
      // Remove leading slash and split into segments
      const slug = url === "/" ? undefined : url.replace(/^\//, "").split("/");
      return { slug };
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error generating static params:", error);
    return [];
  }
}
