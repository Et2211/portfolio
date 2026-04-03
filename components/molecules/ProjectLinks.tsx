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
  className = "",
}: ProjectLinksProps) => {
  if (!liveUrl && !githubUrl && !moreInfoUrl) return null;

  const linkClass = `font-medium text-black dark:text-white underline underline-offset-2 hover:opacity-70 transition-opacity ${
    size === "xs" ? "text-xs" : "text-sm"
  }`;

  return (
    <div className={`flex gap-3 ${className}`}>
      {liveUrl && (
        <a href={liveUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
          Live ↗
        </a>
      )}
      {githubUrl && (
        <a href={githubUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
          GitHub ↗
        </a>
      )}
      {moreInfoUrl && (
        <a href={moreInfoUrl} className={linkClass}>
          More info ↗
        </a>
      )}
    </div>
  );
};
