export type SidebarView = 'beautify' | 'tree' | 'compare' | 'search' | 'export' | 'settings';

export interface SidebarItem {
  id: SidebarView;
  icon: string;
  label: string;
}
