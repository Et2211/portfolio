import { AppLink } from "@/components/AppLink";
import { cn } from "@/lib/utils";

interface ProjectLinksProps {
  liveUrl?: string;
  githubUrl?: string;
  moreInfoUrl?: string;
  size?: "sm" | "xs";
  className?: string;
}

export const ProjectLinks = ({
  liveUrl,
  githubUrl,
  moreInfoUrl,
  size = "sm",
  className,
}: ProjectLinksProps) => {
  const links = [
    { href: liveUrl, label: "Live ↗" },
    { href: githubUrl, label: "GitHub ↗" },
    { href: moreInfoUrl, label: "More info ↗" },
  ].filter((link): link is { href: string; label: string } => !!link.href);

  if (!links.length) {
    return null;
  }

  return (
    <div className={cn("flex gap-3", className)}>
      {links.map((link) => (
        <AppLink
          key={link.label}
          href={link.href}
          variant="text"
          className={size === "xs" ? "text-xs" : "text-sm"}
        >
          {link.label}
        </AppLink>
      ))}
    </div>
  );
};
