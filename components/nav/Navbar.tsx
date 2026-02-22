import Link from "next/link";
import React from "react";

import {
  type NavGroup,
  type NavItem,
  type NavigationResponse,
  fetchCMS,
} from "@/lib/strapi";

import { DropdownMenu } from "./DropdownMenu";

async function getNavigation() {
  try {
    // Note: Strapi has limitations populating relations within dynamic zones
    // For now, we use the manual URL field. The getNavItemUrl helper will
    // automatically use page.URL when Strapi supports it or if populated differently
    const data = await fetchCMS<NavigationResponse>({
      endpoint:
        "/api/navigation?populate=Nav_groups.Nav_list.*&publicationState=preview",
      revalidate: 60,
    });

    return (data.data?.Nav_groups as NavGroup[] | undefined) || [];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching navigation:", error);
    return [];
  }
}

// Helper to get URL from either page relation or manual URL field
function getNavItemUrl(item: NavItem): string {
  let url: string | null | undefined;
  // Prefer page relation URL over manual URL
  if (item.page?.data?.URL) {
    url = item.page.data.URL;
  } else {
    // Fallback to manual URL
    url = item.URL;
  }

  if (!url || url === "#") {
    return "#";
  }

  // Ensure URL is absolute (starts with /)
  return url.startsWith("/") ? url : `/${url}`;
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
            Portfolio
          </Link>

          {/* Navigation Menu */}
          <div className="flex items-center gap-2">
            {navGroups.map((group, groupIdx) => (
              <DropdownMenu
                key={groupIdx}
                trigger={group.Nav_header}
                items={
                  group.Nav_list?.map((item: NavItem) => ({
                    label: item.Nav_title,
                    href: getNavItemUrl(item),
                  })) || []
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
