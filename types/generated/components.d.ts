import type { Schema, Struct } from '@strapi/strapi';

export interface NavGroupsNavGroup extends Struct.ComponentSchema {
  collectionName: 'components_nav_groups_nav_groups';
  info: {
    displayName: 'Nav_group';
    icon: 'folder';
  };
  attributes: {
    Nav_header: Schema.Attribute.String & Schema.Attribute.Required;
    Nav_list: Schema.Attribute.DynamicZone<['nav-items.nav-item']> &
      Schema.Attribute.Required;
  };
}

export interface NavItemsNavItem extends Struct.ComponentSchema {
  collectionName: 'components_nav_items_nav_items';
  info: {
    displayName: 'Nav_item';
    icon: 'bulletList';
  };
  attributes: {
    Nav_title: Schema.Attribute.String;
    URL: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'nav-groups.nav-group': NavGroupsNavGroup;
      'nav-items.nav-item': NavItemsNavItem;
    }
  }
}
