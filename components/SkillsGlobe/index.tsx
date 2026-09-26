import { getSimpleIcon } from "@/lib/simpleIcons";
import type { SkillsGlobeBlock } from "@/types/blocks";

import { SkillsGlobeCanvas } from "./SkillsGlobeCanvas";
import type { GlobeSkill } from "./types";

// The globe is WebGL, drawn only in the browser. Without JavaScript this
// list shows the same skills instead (hidden whenever scripting is enabled).
const SkillsList = ({ skills }: { skills: GlobeSkill[] }) => (
  <ul className="grid w-full gap-3 sm:grid-cols-2 scripting:hidden">
    {skills.map((skill, idx) => (
      <li
        key={skill._key ?? idx}
        className="flex items-start gap-3 surface-muted p-4"
      >
        {skill.iconData && (
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="mt-0.5 h-6 w-6 shrink-0"
            style={{ fill: `#${skill.iconData.hex}` }}
          >
            <path d={skill.iconData.path} />
          </svg>
        )}
        <div>
          <p className="font-semibold text-black dark:text-white">
            {skill.url ? <a href={skill.url}>{skill.name}</a> : skill.name}
          </p>
          {skill.description && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {skill.description}
            </p>
          )}
        </div>
      </li>
    ))}
  </ul>
);

// Server wrapper: resolves each skill's icon here so the (multi-megabyte)
// simple-icons package never reaches the browser.
export const SkillsGlobe = ({
  heading,
  skills = [],
  rotationSpeed,
}: SkillsGlobeBlock) => {
  const withIcons: GlobeSkill[] = skills.map((skill) => ({
    ...skill,
    iconData: getSimpleIcon(skill.icon),
  }));

  return (
    <SkillsGlobeCanvas
      heading={heading}
      rotationSpeed={rotationSpeed}
      skills={withIcons}
      fallback={<SkillsList skills={withIcons} />}
    />
  );
};
