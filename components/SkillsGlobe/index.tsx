import { getSimpleIcon } from "@/lib/simpleIcons";
import type { SkillsGlobeBlock } from "@/types/blocks";

import { SkillsGlobeCanvas } from "./SkillsGlobeCanvas";

// Server wrapper: resolves each skill's icon here so the (multi-megabyte)
// simple-icons package never reaches the browser.
export const SkillsGlobe = ({
  heading,
  skills = [],
  rotationSpeed,
}: SkillsGlobeBlock) => (
  <SkillsGlobeCanvas
    heading={heading}
    rotationSpeed={rotationSpeed}
    skills={skills.map((skill) => ({
      ...skill,
      iconData: getSimpleIcon(skill.icon),
    }))}
  />
);
