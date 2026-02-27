import type { SidebarView } from './ui';

export interface TabData {
  id: string;
  label: string;
  rawInput: string;
  sidebarView: SidebarView;
  createdAt: number;
}

export interface TabsState {
  tabs: TabData[];
  activeTabId: string;
}
