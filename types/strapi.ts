// Strapi Response Types
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Base Strapi entity with common fields
export interface StrapiEntity {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

// Page entity
export interface Page extends StrapiEntity {
  Heading: string;
  Url: string;
  Page_components?: Array<TimelineItem>;
}

export interface PageResponse {
  data: Page[];
}

// Navigation Item with page relation
export interface NavItem {
  __component: "nav-items.nav-item";
  id: number;
  Nav_title: string;
  URL: string | null;
  page?: {
    data: Page | null;
  };
}

// Navigation Group
export interface NavGroup {
  __component: "nav-groups.nav-group";
  id: number;
  Nav_header: string;
  Nav_list: NavItem[];
}

// Navigation (single type)
export interface Navigation {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  Nav_groups: NavGroup[];
}

export interface NavigationResponse {
  data: Navigation;
}

// Timeline component
export interface TimelineItem {
  __component: "timeline.timeline-item";
  id: number;
  Title: string;
  description: unknown; // Strapi Blocks content
  Image?: {
    data: {
      id: number;
      attributes: {
        url: string;
        alternativeText?: string;
        caption?: string;
        width: number;
        height: number;
      };
    };
  };
}
