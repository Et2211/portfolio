import { PortableText } from "@portabletext/react";
import { Github, Linkedin, Mail } from "lucide-react";

import { SectionHeading } from "@/components/atoms/SectionHeading";
import type { ContactSectionBlock } from "@/types/blocks";

const iconMap = {
  email: Mail,
  github: Github,
  linkedin: Linkedin,
};

type ContactType = keyof typeof iconMap;

// Hover lift/glow and icon spin are CSS; Tailwind's `hover:` only applies on
// devices that can hover, so touch screens don't get stuck in a hover state.
const ContactLink = ({
  href,
  label,
  type,
}: {
  href: string;
  label: string;
  type: ContactType;
}) => {
  const Icon = iconMap[type];

  return (
    <a
      href={href}
      target={type !== "email" ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="group flex items-center gap-2.5 rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-600 transition-[color,border-color,box-shadow,translate] duration-300 ease-out-back hover:-translate-y-[3px] hover:border-accent-vivid hover:text-accent-vivid hover:shadow-glow-md dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-accent-vivid dark:hover:text-accent-vivid"
    >
      <span className="inline-flex flex-shrink-0 transition-[rotate,scale] duration-300 ease-out-back group-hover:scale-120 group-hover:rotate-12">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      {label}
    </a>
  );
};

export const ContactSection = ({
  heading,
  intro,
  email,
  githubUrl,
  linkedinUrl,
}: ContactSectionBlock) => {
  return (
    <section className="flex flex-col items-center gap-6 py-8 text-center">
      {heading && (
        <SectionHeading align="center" className="mb-0">
          {heading}
        </SectionHeading>
      )}
      {intro && intro.length > 0 && (
        <div className="max-w-lg">
          <div className="prose prose-sm max-w-none dark:prose-invert dark:[&_a]:text-zinc-300 dark:[&_p]:text-zinc-300">
            <PortableText value={intro} />
          </div>
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-4">
        {email && (
          <ContactLink href={`mailto:${email}`} label="Email" type="email" />
        )}
        {githubUrl && (
          <ContactLink href={githubUrl} label="GitHub" type="github" />
        )}
        {linkedinUrl && (
          <ContactLink href={linkedinUrl} label="LinkedIn" type="linkedin" />
        )}
      </div>
    </section>
  );
};
