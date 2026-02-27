import React from 'react';

interface HeaderProps {
  onExpand?: () => void;
  isPopup?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onExpand, isPopup }) => {
  return (
    <header className="flex items-center px-3 py-2 border-b border-border bg-bg-secondary">
      <div className="flex-1">
        <span className="font-serif text-md font-semibold text-text-primary">
          ◈ JSON Viewer
        </span>
      </div>
      {isPopup && (
        <div className="flex items-center gap-1">
          {onExpand && (
            <button
              onClick={onExpand}
              className="flex items-center justify-center w-7 h-7 text-text-secondary hover:bg-surface rounded-btn transition-colors"
              aria-label="Expand"
            >
              ⊞
            </button>
          )}
          <button
            onClick={() => window.close()}
            className="flex items-center justify-center w-7 h-7 text-text-secondary hover:bg-surface rounded-btn transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
