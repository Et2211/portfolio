"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { Eyebrow } from "@/components/atoms/Eyebrow";
import type { NavSection } from "@/lib/content";

interface MobileMenuProps {
  sections: NavSection[];
}

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

// aria-modal promises focus stays inside the drawer: wrap Tab / Shift+Tab
// at its ends, and pull focus back in if it has somehow left.
const trapFocus = (e: KeyboardEvent, container: HTMLElement | null) => {
  if (!container) {
    return;
  }
  const focusable = [...container.querySelectorAll<HTMLElement>(FOCUSABLE)];
  if (!focusable.length) {
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;
  const outside = !container.contains(active);
  if (e.shiftKey && (active === first || outside)) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && (active === last || outside)) {
    e.preventDefault();
    first.focus();
  }
};

export const MobileMenu = ({ sections }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const drawerId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  // Any link click closes the menu
  const close = () => setIsOpen(false);

  useEffect(() => {
    // Prevent body scroll while open
    document.body.style.overflow = isOpen ? "hidden" : "";

    // Move focus into the drawer on open, and back to the toggle on close
    if (isOpen) {
      closeRef.current?.focus();
    } else if (wasOpen.current) {
      toggleRef.current?.focus();
    }
    wasOpen.current = isOpen;

    if (!isOpen) {
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (e.key === "Tab") {
        trapFocus(e, drawerRef.current);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls={drawerId}
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

      {/* Drawer — inert while closed so its links leave the tab order */}
      <div
        ref={drawerRef}
        id={drawerId}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!isOpen}
        className={`fixed top-0 right-0 z-50 h-full w-72 border-l border-zinc-200 bg-white shadow-xl transition-transform duration-300 dark:border-zinc-800 dark:bg-black ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
          <span className="font-semibold text-black dark:text-white">Menu</span>
          <button
            ref={closeRef}
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
              <Eyebrow className="mb-2 px-2">{group.heading}</Eyebrow>
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
