import Link from "next/link";

interface DropdownMenuItemProps {
  href: string;
  label: string;
  onClose: () => void;
}

export const DropdownMenuItem = ({
  href,
  label,
  onClose,
}: DropdownMenuItemProps) => {
  return (
    <li>
      <Link
        href={href}
        onClick={onClose}
        className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring"
      >
        {label}
      </Link>
    </li>
  );
};
