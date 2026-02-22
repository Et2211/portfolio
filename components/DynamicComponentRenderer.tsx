import type { DynamicComponent } from "@/lib/strapi";

import { Timeline } from "./Timeline";

interface DynamicComponentRendererProps {
  components: DynamicComponent[];
}

export const DynamicComponentRenderer = ({
  components,
}: DynamicComponentRendererProps) => {
  if (!components || components.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12">
      {components.map((component, index) => {
        switch (component.__component) {
          case "timeline.timeline":
            return (
              <Timeline key={component.id || index} items={component.items} />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};
