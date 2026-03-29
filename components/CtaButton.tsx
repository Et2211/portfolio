import type { CtaButtonBlock } from "@/types/blocks";

import { AppLink } from "./AppLink";

export const CtaButton = ({ label, url, variant = "primary" }: CtaButtonBlock) => {
  if (!label || !url) return null;
  return (
    <div>
      <AppLink href={url} variant={variant}>
        {label}
      </AppLink>
    </div>
  );
};
