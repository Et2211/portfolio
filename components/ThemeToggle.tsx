"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

function subscribe(cb: () => void) {
  const observer = new MutationObserver(cb);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

export const ThemeToggle = () => {
  const isDark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );

  const toggle = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Storage blocked — the choice just won't persist.
    }
  };

  // The icon is chosen with CSS from the `dark` class (set before first
  // paint), so it's right before hydration; the server can't know the theme.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Dark mode"
      aria-pressed={isDark}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-black focus-visible:outline-2 focus-visible:outline-ring dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
    >
      <Sun aria-hidden="true" size={18} className="hidden dark:block" />
      <Moon aria-hidden="true" size={18} className="dark:hidden" />
    </button>
  );
};
