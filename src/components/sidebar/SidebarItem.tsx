import React from 'react';

interface SidebarItemProps {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center justify-center w-10 h-10 font-serif transition-colors ${
        active
          ? 'bg-terra-light text-terra'
          : 'text-text-secondary hover:bg-surface'
      }`}
      aria-label={label}
    >
      <span className="text-lg">{icon}</span>
      <span className="absolute left-full ml-2 px-2 py-1 bg-text-primary text-white text-xs rounded-btn whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
        {label}
      </span>
    </button>
  );
};

export default SidebarItem;
