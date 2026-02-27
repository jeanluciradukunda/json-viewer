import React from 'react';
import type { SidebarView } from '@/types/ui';
import SidebarItem from '@/components/sidebar/SidebarItem';

interface SidebarProps {
  activeView: SidebarView;
  onViewChange: (view: SidebarView) => void;
  onExpand?: () => void;
}

const topItems: { id: SidebarView; icon: string; label: string }[] = [
  { id: 'beautify', icon: '▦', label: 'Beautify' },
  { id: 'tree', icon: '⊟', label: 'Tree View' },
  { id: 'compare', icon: '⇅', label: 'Compare' },
  { id: 'search', icon: '⌕', label: 'Search' },
  { id: 'export', icon: '↗', label: 'Export' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, onExpand }) => {
  return (
    <div className="w-10 bg-bg-secondary border-r border-border flex flex-col justify-between shrink-0">
      <div className="flex flex-col">
        {topItems.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeView === item.id}
            onClick={() => onViewChange(item.id)}
          />
        ))}
      </div>
      <div className="flex flex-col">
        {onExpand && (
          <SidebarItem
            icon="⊞"
            label="Expand"
            active={false}
            onClick={onExpand}
          />
        )}
        <SidebarItem
          icon="⚙"
          label="Settings"
          active={activeView === 'settings'}
          onClick={() => onViewChange('settings')}
        />
      </div>
    </div>
  );
};

export default Sidebar;
