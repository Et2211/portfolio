"use client";

import { PortableText } from "@portabletext/react";
import { Github, Linkedin, Mail } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import { useIsPointerDevice } from "@/hooks/useIsPointerDevice";
import type { ContactSectionBlock } from "@/types/blocks";

const iconMap = {
  email: Mail,
  github: Github,
  linkedin: Linkedin,
};

type ContactType = keyof typeof iconMap;

const ContactLink = ({
  href,
  label,
  type,
  isPointer,
}: {
  href: string;
  label: string;
  type: ContactType;
  isPointer: boolean;
}) => {
  const Icon = iconMap[type];
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={href}
      target={type !== "email" ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:border-[var(--accent-vivid)] hover:text-[var(--accent-vivid)] dark:border-zinc-700 dark:text-zinc-300"
      onHoverStart={() => isPointer && setHovered(true)}
      onHoverEnd={() => isPointer && setHovered(false)}
      whileHover={
        isPointer
          ? {
              y: -3,
              boxShadow:
                "0 0 20px oklch(0.56 0.28 280 / 0.2), 0 4px 12px oklch(0 0 0 / 0.08)",
            }
          : undefined
      }
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
    >
      <motion.span
        className="inline-flex flex-shrink-0"
        animate={{
          rotate: hovered && isPointer ? 12 : 0,
          scale: hovered && isPointer ? 1.2 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <Icon className="h-4 w-4" />
      </motion.span>
      {label}
    </motion.a>
  );
};

export const ContactSection = ({
  heading,
  intro,
  email,
  githubUrl,
  linkedinUrl,
}: ContactSectionBlock) => {
  const isPointer = useIsPointerDevice();

  return (
    <section className="flex flex-col items-center gap-6 py-8 text-center">
      {heading && (
        <h2 className="text-2xl font-bold text-black dark:text-white">
          {heading}
        </h2>
      )}
      {intro && intro.length > 0 && (
        <div className="prose prose-sm dark:prose-invert max-w-lg dark:[&_a]:text-zinc-300 dark:[&_p]:text-zinc-300">
          <PortableText value={intro} />
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-4">
        {email && (
          <ContactLink
            href={`mailto:${email}`}
            label="Email"
            type="email"
            isPointer={isPointer}
          />
        )}
        {githubUrl && (
          <ContactLink
            href={githubUrl}
            label="GitHub"
            type="github"
            isPointer={isPointer}
          />
        )}
        {linkedinUrl && (
          <ContactLink
            href={linkedinUrl}
            label="LinkedIn"
            type="linkedin"
            isPointer={isPointer}
          />
        )}
      </div>
    </section>
  );
};
