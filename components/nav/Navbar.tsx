import Link from "next/link";
import React from "react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { getNavigation } from "@/lib/content";
import type { NavSection } from "@/lib/content";

import { DropdownMenu } from "./DropdownMenu";
import { MobileMenu } from "./MobileMenu";

// Outside the cached fetcher, so a failed fetch renders an empty menu for
// this request only instead of being cached.
const loadNavigation = async (): Promise<NavSection[]> => {
  try {
    return await getNavigation();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching navigation:", error);
    return [];
  }
};

export const Navbar = async (): Promise<React.ReactElement> => {
  const sections = await loadNavigation();
  return (
    <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <Link
            href="/"
            className="text-xl font-bold text-black transition-colors hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300"
          >
            Etienne Sharkey
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-2 md:flex">
            {sections.map((section) => (
              <DropdownMenu
                key={section.heading}
                trigger={section.heading}
                items={section.links}
              />
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile nav */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <MobileMenu sections={sections} />
          </div>
        </div>
      </div>
    </nav>
  );
};
