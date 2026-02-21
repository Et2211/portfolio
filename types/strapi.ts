/**
 * TypeScript types for Strapi CMS content
 * Auto-generated types are in types/generated/
 */

import type {
  NavGroupsNavGroup,
  NavItemsNavItem,
} from "@/types/generated/components";
import type {
  ApiNavigationNavigation,
  ApiPagePage,
} from "@/types/generated/contentTypes";

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Extract attributes from Strapi schema types
export type Navigation = ApiNavigationNavigation["attributes"];
export type Page = ApiPagePage["attributes"];
export type NavGroup = NavGroupsNavGroup["attributes"];
export type NavItem = NavItemsNavItem["attributes"] & { __component?: string };

export type NavigationResponse = StrapiResponse<Navigation>;
export type PageResponse = StrapiResponse<Page>;
export type SinglePageResponse = StrapiResponse<Page>;
