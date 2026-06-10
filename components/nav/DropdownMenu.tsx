"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { useOutsideClick } from "@/hooks/useOutsideClick";

import { DropdownMenuItem } from "./DropdownMenuItem";

interface DropdownItem {
  label: string;
  href: string;
}

interface DropdownMenuProps {
  trigger: string;
  items: DropdownItem[];
}

export const DropdownMenu = ({ trigger, items }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useOutsideClick<HTMLDivElement>(() => setIsOpen(false));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setIsOpen(false);
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onKeyDown={handleKeyDown}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="nav-underline inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground outline-none transition-colors"
      >
        {trigger}
        <ChevronDown
          className={`ml-1 h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 pt-1 min-w-[200px] overflow-visible z-50">
          <div className="rounded-md border bg-popover text-popover-foreground shadow-md">
            <ul role="menu" className="p-1">
              {items.map((item, idx) => (
                <DropdownMenuItem
                  key={idx}
                  href={item.href}
                  label={item.label}
                  onClose={() => setIsOpen(false)}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
