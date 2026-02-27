import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 select-none opacity-60">
      <div className="relative">
        <span
          className="text-5xl text-terra/40 block animate-[breathe_3s_ease-in-out_infinite]"
          style={{ fontFamily: 'serif' }}
        >
          ◈
        </span>
        <span
          className="absolute inset-0 text-5xl text-terra/20 block animate-[breathe_3s_ease-in-out_infinite] blur-md"
          style={{ fontFamily: 'serif' }}
        >
          ◈
        </span>
      </div>
      <div className="text-center">
        <p className="text-sm font-serif text-text-muted">
          Paste or drop JSON to get started
        </p>
        <p className="text-xs font-mono text-text-muted/60 mt-1">
          { } &middot; [ ] &middot; beautify &middot; compare &middot; explore
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
