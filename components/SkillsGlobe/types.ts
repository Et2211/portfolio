import type { IconData } from "@/lib/simpleIcons";
import type { SkillGlobeItem } from "@/types/blocks";

/** A skill with its brand icon already resolved on the server. */
export type GlobeSkill = SkillGlobeItem & { iconData: IconData | null };

/** Radius of the wireframe globe and the sphere the skill icons sit on. */
export const GLOBE_RADIUS = 1.7;
