/** Absolute http(s) URLs open in a new tab; site paths stay in-app. */
export const isExternalUrl = (href: string) => /^https?:\/\//i.test(href);

/** `target`/`rel` for a link, so external links always open safely. */
export const externalLinkProps = (href: string) =>
  isExternalUrl(href)
    ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
    : {};
