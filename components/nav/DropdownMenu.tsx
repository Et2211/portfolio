"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { useOutsideClick } from "@/hooks/useOutsideClick";
import type { NavLink } from "@/lib/content";

import { DropdownMenuItem } from "./DropdownMenuItem";

interface DropdownMenuProps {
  trigger: string;
  items: NavLink[];
}

// Disclosure pattern (button + list of links) rather than an ARIA menu:
// site navigation doesn't need menu semantics or arrow-key roving focus.
export const DropdownMenu = ({ trigger, items }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useOutsideClick<HTMLDivElement>(() => setIsOpen(false));

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="nav-underline inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {trigger}
        <ChevronDown
          aria-hidden="true"
          className={`ml-1 h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        id={panelId}
        hidden={!isOpen}
        className="absolute top-full left-0 z-50 min-w-[200px] overflow-visible pt-1"
      >
        <div className="rounded-md border bg-popover text-popover-foreground shadow-md">
          <ul className="p-1">
            {items.map((item) => (
              <DropdownMenuItem
                key={item.href}
                href={item.href}
                label={item.label}
                onClose={() => setIsOpen(false)}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
