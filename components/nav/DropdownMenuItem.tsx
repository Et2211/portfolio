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
    <li role="none">
      <Link
        href={href}
        role="menuitem"
        onClick={onClose}
        className="block rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        {label}
      </Link>
    </li>
  );
};
