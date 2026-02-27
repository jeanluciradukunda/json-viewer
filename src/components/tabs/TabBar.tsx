import React from 'react';
import type { TabData } from '@/types/tabs';

interface TabBarProps {
  tabs: TabData[];
  activeTabId: string;
  onSwitch: (id: string) => void;
  onClose: (id: string) => void;
  onAdd: () => void;
}

const TabBar: React.FC<TabBarProps> = ({ tabs, activeTabId, onSwitch, onClose, onAdd }) => {
  return (
    <div className="flex items-center gap-1 px-3 py-1.5 border-b border-border bg-bg-secondary overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <button
            key={tab.id}
            onClick={() => onSwitch(tab.id)}
            className={`group flex items-center gap-1.5 px-3 py-1 rounded-btn text-sm font-mono whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-terra-light text-terra border-b-2 border-terra'
                : 'text-text-secondary hover:bg-surface'
            }`}
          >
            <span>{tab.label}</span>
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose(tab.id);
              }}
              className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-xs leading-none transition-colors ${
                isActive
                  ? 'text-terra hover:bg-terra hover:text-white'
                  : 'text-text-muted opacity-0 group-hover:opacity-100 hover:bg-surface hover:text-text-primary'
              }`}
            >
              ✕
            </span>
          </button>
        );
      })}
      <button
        onClick={onAdd}
        className="flex items-center justify-center w-7 h-7 text-text-secondary hover:bg-surface rounded-btn transition-colors text-md"
        aria-label="New tab"
      >
        +
      </button>
    </div>
  );
};

export default TabBar;
