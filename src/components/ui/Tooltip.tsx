import React from 'react';

interface TooltipProps {
  children: React.ReactNode;
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, text }) => {
  return (
    <div className="relative group">
      {children}
      <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-text-primary text-white text-xs rounded-btn whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
        {text}
      </span>
    </div>
  );
};

export default Tooltip;
