import { Badge } from "@/components/atoms/Badge";
import { cn } from "@/lib/utils";

/** A wrapping row of tag badges; renders nothing when there are no tags. */
export const TagList = ({
  tags,
  compact = false,
  className,
}: {
  tags?: string[];
  compact?: boolean;
  className?: string;
}) => {
  if (!tags?.length) {
    return null;
  }
  return (
    <div
      className={cn("flex flex-wrap", compact ? "gap-1" : "gap-1.5", className)}
    >
      {tags.map((tag, idx) => (
        <Badge key={`${idx}-${tag}`} variant="tag">
          {tag}
        </Badge>
      ))}
    </div>
  );
};
