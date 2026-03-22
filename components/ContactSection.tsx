import { PortableText } from "@portabletext/react";

import type { ContactSectionBlock } from "./DynamicComponentRenderer";

export const ContactSection = ({ heading, intro, email, githubUrl, linkedinUrl }: ContactSectionBlock) => {
  return (
    <section className="py-8 flex flex-col items-center text-center gap-6">
      {heading && (
        <h2 className="text-2xl font-bold text-black dark:text-white">{heading}</h2>
      )}
      {intro && intro.length > 0 && (
        <div className="prose prose-sm prose-gray dark:prose-invert max-w-lg">
          <PortableText value={intro} />
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-4">
        {email && (
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 rounded-md border border-zinc-300 dark:border-zinc-600 px-5 py-2 text-sm font-medium text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Email
          </a>
        )}
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-zinc-300 dark:border-zinc-600 px-5 py-2 text-sm font-medium text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            GitHub
          </a>
        )}
        {linkedinUrl && (
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-zinc-300 dark:border-zinc-600 px-5 py-2 text-sm font-medium text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            LinkedIn
          </a>
        )}
      </div>
    </section>
  );
};
