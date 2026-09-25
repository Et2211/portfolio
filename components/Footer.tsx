import { DynamicComponentRenderer } from "@/components/DynamicComponentRenderer";
import { buildImageUrls, fetchSanity } from "@/lib/sanity";
import type { Page } from "@/types/generated/sanity";

// The footer document holds the same dynamic components as a page.
type FooterDocument = {
  components?: Page["pageComponents"];
};

async function getFooter(): Promise<FooterDocument | null> {
  const query = `*[_type == "footer"][0]{
    components[]{
      ...,
      component[]{
        ...,
        "fileUrl": file.asset->url,
        items[]{
          ...,
          items[]{
            ...
          }
        }
      }
    }
  }`;
  return await fetchSanity<FooterDocument | null>(query);
}

export const Footer = async () => {
  const footerDoc = await getFooter();
  if (!footerDoc?.components?.length) {
    return null;
  }

  const components = buildImageUrls(footerDoc.components);

  return (
    <footer className="dark mt-16 bg-zinc-900 dark:bg-zinc-950">
      <div className="container mx-auto py-12">
        <DynamicComponentRenderer components={components} />
      </div>
    </footer>
  );
};
