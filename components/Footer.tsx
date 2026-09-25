import { DynamicComponentRenderer } from "@/components/DynamicComponentRenderer";
import { getFooter } from "@/lib/content";

export const Footer = async () => {
  const footer = await getFooter();
  const components = footer?.components;
  if (!components?.length) {
    return null;
  }

  return (
    <footer className="dark mt-16 bg-zinc-900 dark:bg-zinc-950">
      <div className="container mx-auto py-12">
        <DynamicComponentRenderer components={components} />
      </div>
    </footer>
  );
};
