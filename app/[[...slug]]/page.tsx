// Revalidate this page every 60 seconds (ISR)
export const revalidate = 60;

import { notFound } from "next/navigation";
import './../globals.css';

import { DynamicComponentRenderer } from "@/components/DynamicComponentRenderer";
import { buildImageUrl, fetchSanity } from "@/lib/sanity";
import type { Page, SanityImage } from "@/types/generated/sanity";

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

interface TimelineItem {
  image?: SanityImage | null;
  [key: string]: unknown;
}

interface TimelineComponent {
  _type: "timeline";
  items: TimelineItem[];
  [key: string]: unknown;
}

interface ImageWithDescriptionComponent {
  _type: "imageWithDescription";
  image?: SanityImage | null;
  [key: string]: unknown;
}

interface CarouselComponent {
  _type: "carousel";
  items?: (TimelineComponent | ImageWithDescriptionComponent)[];
  [key: string]: unknown;
}

interface DynamicComponent {
  _type: "dynamicComponent";
  component?: (TimelineComponent | ImageWithDescriptionComponent | CarouselComponent)[];
  [key: string]: unknown;
}

type PageComponent = Record<string, unknown>;

function buildImageUrlForItem(item: unknown): unknown {
  if (typeof item !== "object" || item === null) return item;
  
  const obj = item as Record<string, unknown>;
  
  // Handle timeline items
  if ("items" in obj && Array.isArray(obj.items)) {
    return {
      ...obj,
      items: obj.items.map((subItem: unknown) => buildImageUrlForItem(subItem)),
    };
  }
  
  // Handle image fields
  if ("image" in obj && obj.image && typeof obj.image === "object" && "asset" in obj.image) {
    return {
      ...obj,
      image: buildImageUrl(obj.image as SanityImage),
    };
  }
  
  return obj;
}

function buildImageUrlsForComponents(
  components: PageComponent[],
): PageComponent[] {
  return components.map((component): PageComponent => {
    if (typeof component !== "object" || component === null) return component;
    
    // Handle dynamicComponent wrapper
    if ("_type" in component && component._type === "dynamicComponent" && "component" in component && Array.isArray(component.component)) {
      const dynamicComp = component as DynamicComponent;
      return {
        ...dynamicComp,
        component: dynamicComp.component?.map((block) => buildImageUrlForItem(block)),
      };
    }
    
    // Fallback for non-wrapped components
    return buildImageUrlForItem(component) as PageComponent;
  });
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
  return await fetchSanity<Page | null>(query, { url });
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
        <h1 className="text-4xl font-bold mb-8 text-black dark:text-white">
          {pageWithBuiltUrls.heading}
        </h1>

        {/* Render dynamic components from Sanity */}
        {pageWithBuiltUrls.pageComponents && pageWithBuiltUrls.pageComponents.length > 0 ? (
          <DynamicComponentRenderer components={pageWithBuiltUrls.pageComponents} />
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
