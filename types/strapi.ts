/**
 * TypeScript types for Strapi CMS content
 */

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

export interface StrapiEntity<T> {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Page extends StrapiEntity<any> {
  Heading: string;
  Url: string;
}

export interface NavItem {
  id: number;
  __component: "nav-items.nav-item";
  Nav_title: string;
  URL: string;
}

export interface NavGroup extends StrapiEntity<any> {
  Nav_header: string;
  Nav_list: NavItem[];
}

export type PageResponse = StrapiResponse<StrapiEntity<Page>[]>;
export type SinglePageResponse = StrapiResponse<StrapiEntity<Page>>;
export type NavGroupResponse = StrapiResponse<StrapiEntity<NavGroup>[]>;
