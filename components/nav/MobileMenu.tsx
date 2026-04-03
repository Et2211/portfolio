"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface NavItem {
  label: string;
  href: string;
}

interface NavGroup {
  heading: string;
  items: NavItem[];
}

interface MobileMenuProps {
  navGroups: NavGroup[];
}

export const MobileMenu = ({ navGroups }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close on route change (any link click closes the menu)
  const close = () => setIsOpen(false);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        className="flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <span
          className={`block h-0.5 w-5 bg-black dark:bg-white rounded transition-all duration-300 origin-center ${
            isOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-5 bg-black dark:bg-white rounded transition-all duration-300 ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-5 bg-black dark:bg-white rounded transition-all duration-300 origin-center ${
            isOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 dark:bg-black/50"
          onClick={close}
          aria-hidden
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white dark:bg-black border-l border-zinc-200 dark:border-zinc-800 shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-200 dark:border-zinc-800">
          <span className="font-semibold text-black dark:text-white">Menu</span>
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-black dark:text-white"
          >
            ✕
          </button>
        </div>

        <nav className="overflow-y-auto h-[calc(100%-4rem)] p-4 space-y-6">
          {navGroups.map((group) => (
            <div key={group.heading}>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 px-2">
                {group.heading}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      className="block rounded-lg px-3 py-2 text-sm text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};
