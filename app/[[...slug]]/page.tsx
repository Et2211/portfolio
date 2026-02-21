import { Page as StrapiPage } from "@/types/strapi";
import { notFound } from "next/navigation";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

async function getPageByUrl(url: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (STRAPI_API_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
  }

  const response = await fetch(
    `${STRAPI_URL}/api/pages?filters[Url][$eq]=${encodeURIComponent(url)}&populate=*`,
    {
      headers,
      next: { revalidate: 3600 },
    },
  );

  if (!response.ok) {
    console.error("Failed to fetch page from Strapi");
    return null;
  }

  const data = await response.json();
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

// Generate static params for all pages
export async function generateStaticParams() {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (STRAPI_API_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
  }

  try {
    const response = await fetch(`${STRAPI_URL}/api/pages?populate=*`, {
      headers,
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const pages: StrapiPage[] = data.data || [];

    return pages.map((page) => {
      const url = page.Url || "/";
      // Remove leading slash and split into segments
      const slug = url === "/" ? undefined : url.replace(/^\//, "").split("/");
      return { slug };
    });
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}
