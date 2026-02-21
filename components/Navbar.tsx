import Link from "next/link";
import React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  type NavGroup,
  type NavItem,
  type NavigationResponse,
  fetchCMS,
} from "@/lib/strapi";

async function getNavigation() {
  try {
    const data = await fetchCMS<NavigationResponse>({
      endpoint:
        "/api/navigation?populate=Nav_groups.Nav_list.*&publicationState=preview",
      revalidate: 60, // Cache for 1 minute
    });

    // eslint-disable-next-line no-console
    console.log(
      "🔵 [getNavigation] Raw response:",
      JSON.stringify(data, null, 2),
    );

    const groups = (data.data?.Nav_groups as NavGroup[] | undefined) || [];
    // eslint-disable-next-line no-console
    console.log("🔵 [getNavigation] Returning groups:", groups.length);
    return groups;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching navigation:", error);
    return [];
  }
}

const Navbar = async function (): Promise<React.ReactElement> {
  const navGroups: NavGroup[] = await getNavigation();
  // eslint-disable-next-line no-console
  console.log("🔵 [Navbar] Groups received:", navGroups.length);
  navGroups.forEach((group, gIdx) => {
    // eslint-disable-next-line no-console
    console.log(
      `🔵 [Navbar] Group ${gIdx} "${group.Nav_header}": ${group.Nav_list?.length} items`,
    );
  });
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
          <NavigationMenu>
            <NavigationMenuList>
              {navGroups.map((group, groupIdx) => (
                <NavigationMenuItem key={groupIdx}>
                  <NavigationMenuTrigger>
                    {group.Nav_header}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-1 p-2">
                      {group.Nav_list && group.Nav_list.length > 0 ? (
                        (() => {
                          const items = group.Nav_list.map(
                            (item: NavItem, itemIdx: number) => {
                              // eslint-disable-next-line no-console
                              console.log(
                                `🔵 [Navbar] Rendering item ${itemIdx}:`,
                                {
                                  title: item.Nav_title,
                                  url: item.URL,
                                  keys: Object.keys(item),
                                },
                              );
                              if (!item.URL || !item.Nav_title) {
                                // eslint-disable-next-line no-console
                                console.warn(
                                  `🔴 [Navbar] Skipping item ${itemIdx} in ${group.Nav_header}: missing URL or Nav_title`,
                                  item,
                                );
                                return null;
                              }
                              const element = (
                                <li
                                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                  key={`${groupIdx}-${itemIdx}-${(item as any).id}`}
                                >
                                  <NavigationMenuLink asChild>
                                    <Link
                                      href={item.URL}
                                      className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                    >
                                      <div className="text-sm font-medium">
                                        {item.Nav_title}
                                      </div>
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                              );
                              return element;
                            },
                          );
                          // eslint-disable-next-line no-console
                          console.log(
                            `🔵 [Navbar] Group "${group.Nav_header}" returning ${items.filter(Boolean).length} items (${items.length} total with nulls)`,
                          );
                          return items;
                        })()
                      ) : (
                        <li className="text-sm text-zinc-500 p-2">No items</li>
                      )}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
