import { DynamicComponentRenderer } from "@/components/DynamicComponentRenderer";
import { buildImageUrlsForComponents, fetchSanity } from "@/lib/sanity";

type FooterComponent = Record<string, unknown>;

type FooterDocument = {
  components?: FooterComponent[];
};

async function getFooter(): Promise<FooterDocument | null> {
  const query = `*[_type == "footer"][0]{
    components[]{
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
  return await fetchSanity<FooterDocument | null>(query);
}

export const Footer = async () => {
  const footerDoc = await getFooter();
  if (!footerDoc?.components?.length) return null;

  const components = buildImageUrlsForComponents(footerDoc.components);

  return (
    <footer className="dark mt-16 bg-zinc-900 dark:bg-zinc-950">
      <div className="container mx-auto py-12">
        <DynamicComponentRenderer components={components as Parameters<typeof DynamicComponentRenderer>[0]["components"]} />
      </div>
    </footer>
  );
};
