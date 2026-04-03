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
import { CvDownload as CvDownloadComponent } from "./CvDownload";
import { ProjectBento as ProjectBentoComponent } from "./ProjectBento";
import { ProjectSpotlight as ProjectSpotlightComponent } from "./ProjectSpotlight";
import { ScrollReveal } from "./ScrollReveal";
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

        const blockKey = block._key || index;
        const delay = Math.min(index * 80, 320);

        let content: React.ReactNode = null;
        switch (block._type) {
          case "timeline":
            content = <TimelineComponent items={block.items || []} />;
            break;
          case "imageWithDescription":
            content = (
              <ImageWithDescriptionComponent
                icon={block.icon}
                image={block.image}
                description={block.description}
                textPosition={block.textPosition}
              />
            );
            break;
          case "carousel":
            content = <CarouselComponent carousel={block} />;
            break;
          case "systemArchitecture":
            content = <SystemArchitectureComponent block={block} />;
            break;
          case "heroPanel":
            content = <HeroPanelComponent {...block} />;
            break;
          case "skillsBar":
            content = <SkillsBarComponent {...block} />;
            break;
          case "featuredProjects":
            content = <FeaturedProjectsComponent {...block} />;
            break;
          case "statsBanner":
            content = <StatsBannerComponent {...block} />;
            break;
          case "aboutSection":
            content = <AboutSectionComponent {...block} />;
            break;
          case "testimonialsSection":
            content = <TestimonialsSectionComponent {...block} />;
            break;
          case "contactSection":
            content = <ContactSectionComponent {...block} />;
            break;
          case "techStack":
            content = <TechStackComponent {...block} />;
            break;
          case "featureAccordion":
            content = <FeatureAccordionComponent {...block} />;
            break;
          case "skillsGlobe":
            content = <SkillsGlobeComponent {...block} />;
            break;
          case "gridLayout":
            content = (
              <GridComponent
                {...block}
                renderItem={(item, idx) => (
                  <DynamicComponentRenderer
                    key={item._key ?? idx}
                    components={[item]}
                  />
                )}
              />
            );
            break;
          case "ctaButton":
            content = <CtaButtonComponent {...block} />;
            break;
          case "projectSpotlight":
            content = <ProjectSpotlightComponent {...block} />;
            break;
          case "projectBento":
            content = <ProjectBentoComponent {...block} />;
            break;
          case "cvDownload":
            content = <CvDownloadComponent {...block} />;
            break;
          default:
            return null;
        }

        return (
          <ScrollReveal key={blockKey} delay={delay}>
            {content}
          </ScrollReveal>
        );
      })}
    </div>
  );
};
