import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { fetchCMS } from "@/lib/strapi";
import { NavGroup } from "@/types/strapi";

async function getNavGroups() {
  try {
    const data = await fetchCMS<{ data: NavGroup[] }>({
      endpoint: "/api/nav-groups?populate=*",
      revalidate: 60, // Cache for 1 minute
    });

    return data.data || [];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching nav groups:", error);
    return [];
  }
}

const Navbar = async function (): Promise<React.ReactElement> {
  const navGroups: NavGroup[] = await getNavGroups();

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
              {navGroups.map((group) => (
                <NavigationMenuItem key={group.id}>
                  <NavigationMenuTrigger>
                    {group.Nav_header}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-1 p-2">
                      {group.Nav_list && group.Nav_list.length > 0 && (
                        <>
                          {group.Nav_list.map((item) => (
                            <li key={item.id}>
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
                          ))}
                        </>
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
