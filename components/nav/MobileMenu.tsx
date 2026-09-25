"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { NavSection } from "@/lib/content";

interface MobileMenuProps {
  sections: NavSection[];
}

export const MobileMenu = ({ sections }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close on route change (any link click closes the menu)
  const close = () => setIsOpen(false);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        <span
          className={`block h-0.5 w-5 origin-center rounded bg-black transition-all duration-300 dark:bg-white ${
            isOpen ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-5 rounded bg-black transition-all duration-300 dark:bg-white ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-5 origin-center rounded bg-black transition-all duration-300 dark:bg-white ${
            isOpen ? "-translate-y-2 -rotate-45" : ""
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
        className={`fixed top-0 right-0 z-50 h-full w-72 border-l border-zinc-200 bg-white shadow-xl transition-transform duration-300 dark:border-zinc-800 dark:bg-black ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
          <span className="font-semibold text-black dark:text-white">Menu</span>
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-black transition-colors hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>

        <nav className="h-[calc(100%-4rem)] space-y-6 overflow-y-auto p-4">
          {sections.map((group) => (
            <div key={group.heading}>
              <p className="mb-2 px-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                {group.heading}
              </p>
              <ul className="space-y-1">
                {group.links.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      className="block rounded-lg px-3 py-2 text-sm text-black transition-colors hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800"
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
