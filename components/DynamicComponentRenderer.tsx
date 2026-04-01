import type { DynamicComponentWithBuiltUrls } from "@/types/dynamicComponent";

import { AboutSection as AboutSectionComponent } from "./AboutSection";
import { Carousel as CarouselComponent } from "./Carousel";
import { ContactSection as ContactSectionComponent } from "./ContactSection";
import { CtaButton as CtaButtonComponent } from "./CtaButton";
import { FeatureAccordion as FeatureAccordionComponent } from "./FeatureAccordion";
import { FeaturedProjects as FeaturedProjectsComponent } from "./FeaturedProjects";
import { Grid as GridComponent } from "./Grid";
import { HeroPanel as HeroPanelComponent } from "./HeroPanel";
import { ImageWithDescription as ImageWithDescriptionComponent } from "./ImageWithDescription";
import { SkillsBar as SkillsBarComponent } from "./SkillsBar";
import { SkillsGlobe as SkillsGlobeComponent } from "./SkillsGlobe";
import { StatsBanner as StatsBannerComponent } from "./StatsBanner";
import { SystemArchitecture as SystemArchitectureComponent } from "./SystemArchitecture";
import { TechStack as TechStackComponent } from "./TechStack";
import { TestimonialsSection as TestimonialsSectionComponent } from "./TestimonialsSection";
import { Timeline as TimelineComponent } from "./Timeline";

interface DynamicComponentRendererProps {
  components: DynamicComponentWithBuiltUrls[];
}

export const DynamicComponentRenderer = ({
  components,
}: DynamicComponentRendererProps) => {
  if (!components || components.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12">
      {components.map((dynamicComponent, index) => {
        if (
          !dynamicComponent.component ||
          dynamicComponent.component.length === 0
        ) {
          return null;
        }
        // Only one block per dynamicComponent.component due to validation
        const block = dynamicComponent.component[0];
        if (!block) return null;

        switch (block._type) {
          case "timeline":
            return (
              <TimelineComponent
                key={block._key || index}
                items={block.items || []}
              />
            );
          case "imageWithDescription":
            return (
              <ImageWithDescriptionComponent
                key={block._key || index}
                icon={block.icon}
                image={block.image}
                description={block.description}
                textPosition={block.textPosition}
              />
            );
          case "carousel":
            return (
              <CarouselComponent key={block._key || index} carousel={block} />
            );
          case "systemArchitecture":
            return (
              <SystemArchitectureComponent
                key={block._key || index}
                block={block}
              />
            );
          case "heroPanel":
            return <HeroPanelComponent key={block._key || index} {...block} />;
          case "skillsBar":
            return <SkillsBarComponent key={block._key || index} {...block} />;
          case "featuredProjects":
            return (
              <FeaturedProjectsComponent key={block._key || index} {...block} />
            );
          case "statsBanner":
            return (
              <StatsBannerComponent key={block._key || index} {...block} />
            );
          case "aboutSection":
            return (
              <AboutSectionComponent key={block._key || index} {...block} />
            );
          case "testimonialsSection":
            return (
              <TestimonialsSectionComponent
                key={block._key || index}
                {...block}
              />
            );
          case "contactSection":
            return (
              <ContactSectionComponent key={block._key || index} {...block} />
            );
          case "techStack":
            return <TechStackComponent key={block._key || index} {...block} />;
          case "featureAccordion":
            return (
              <FeatureAccordionComponent key={block._key || index} {...block} />
            );
          case "skillsGlobe":
            return (
              <SkillsGlobeComponent key={block._key || index} {...block} />
            );
          case "gridLayout":
            return (
              <GridComponent
                key={block._key || index}
                {...block}
                renderItem={(item, idx) => (
                  <DynamicComponentRenderer
                    key={item._key ?? idx}
                    components={[item]}
                  />
                )}
              />
            );
          case "ctaButton":
            return <CtaButtonComponent key={block._key || index} {...block} />;
          default:
            return null;
        }
      })}
    </div>
  );
};
