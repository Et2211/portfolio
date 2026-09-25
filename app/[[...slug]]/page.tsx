import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DynamicComponentRenderer } from "@/components/DynamicComponentRenderer";
import { getPageByUrl, getPageUrls } from "@/lib/content";
import { slugToUrl, urlToSlug } from "@/lib/routes";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const page = await getPageByUrl(slugToUrl((await params).slug));
  if (!page?.heading) {
    return {};
  }
  return {
    title: page.heading,
    openGraph: { title: page.heading },
  };
}

export default async function CmsPage({ params }: PageProps) {
  const page = await getPageByUrl(slugToUrl((await params).slug));

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <main className="container mx-auto py-4">
        {page.heading && (
          <h1 className="mb-8 text-3xl font-bold text-black sm:text-4xl dark:text-white">
            {page.heading}
          </h1>
        )}

        {page.pageComponents?.length ? (
          <DynamicComponentRenderer components={page.pageComponents} />
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

// Prerender every CMS page at build time.
export async function generateStaticParams() {
  try {
    const urls = await getPageUrls();
    return urls.map((url) => ({ slug: urlToSlug(url) }));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-console
    console.error(
      "\n❌ Failed to generate static params for pages:\n",
      message,
    );
    // Pages will still render on demand; don't fail the build.
    return [];
  }
}
