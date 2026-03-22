import { PortableText } from "@portabletext/react";

import { AppLink } from "./AppLink";
import type { ContactSectionBlock } from "./DynamicComponentRenderer";

export const ContactSection = ({ heading, intro, email, githubUrl, linkedinUrl }: ContactSectionBlock) => {
  return (
    <section className="py-8 flex flex-col items-center text-center gap-6">
      {heading && (
        <h2 className="text-2xl font-bold text-black dark:text-white">{heading}</h2>
      )}
      {intro && intro.length > 0 && (
        <div className="prose prose-sm dark:prose-invert max-w-lg dark:[&_p]:text-zinc-300 dark:[&_a]:text-zinc-300">
          <PortableText value={intro} />
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-4">
        {email && (
          <AppLink href={`mailto:${email}`} variant="secondary">
            Email
          </AppLink>
        )}
        {githubUrl && (
          <AppLink href={githubUrl} variant="secondary">
            GitHub
          </AppLink>
        )}
        {linkedinUrl && (
          <AppLink href={linkedinUrl} variant="secondary">
            LinkedIn
          </AppLink>
        )}
      </div>
    </section>
  );
};
