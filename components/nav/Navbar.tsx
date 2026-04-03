import Link from "next/link";
import React from "react";

import { fetchSanity } from "@/lib/sanity";
import type { NavGroup, NavItem, Navigation } from "@/types/generated/sanity";

import { DropdownMenu } from "./DropdownMenu";

async function getNavigation() {
  try {
    const query = `*[_type == 'navigation'][0]{navGroups[]{navHeader,navList[]{navTitle,externalUrl,page->{url}}}}`;
    const data: Navigation = await fetchSanity(query);
    return data?.navGroups || [];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching navigation:", error);
    return [];
  }
}

// Helper to get URL from either page reference or externalUrl
function getNavItemUrl(
  item: NavItem & { page?: { url?: string }; externalUrl?: string },
): string {
  if (item.externalUrl) {
    return item.externalUrl;
  }
  if (item.page && item.page.url) {
    return item.page.url;
  }
  return "#";
}

const Navbar = async (): Promise<React.ReactElement> => {
  const navGroups: NavGroup[] = await getNavigation();
  return (
    <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link
            href="/"
            className="text-xl font-bold text-black dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            Etienne Sharkey
          </Link>

          {/* Navigation Menu */}
          <div className="flex items-center gap-2">
            {navGroups.map((group, groupIdx) => (
              <DropdownMenu
                key={groupIdx}
                trigger={group.navHeader ?? ""}
                items={
                  (group.navList?.map(
                    (
                      item: NavItem & {
                        page?: { url?: string };
                        externalUrl?: string;
                      },
                    ) => ({
                      label: item.navTitle ?? "",
                      href: getNavItemUrl(item),
                    }),
                  ) || []) as { label: string; href: string }[]
                }
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
