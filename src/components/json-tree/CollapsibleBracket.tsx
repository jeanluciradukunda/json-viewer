import React from 'react';

interface CollapsibleBracketProps {
  expanded: boolean;
  onToggle: () => void;
  bracketType: '{' | '[';
  childCount: number;
}

const CollapsibleBracket: React.FC<CollapsibleBracketProps> = ({
  expanded,
  onToggle,
  bracketType,
  childCount,
}) => {
  const closingBracket = bracketType === '{' ? '}' : ']';
  const countLabel = bracketType === '{' ? `${childCount} keys` : `${childCount} items`;

  return (
    <span className="inline-flex items-center gap-0.5">
      <button
        onClick={onToggle}
        className="text-text-muted hover:text-text-primary transition-colors focus:outline-none inline-flex items-center"
        aria-label={expanded ? 'Collapse' : 'Expand'}
      >
        <span className="text-xs w-4 inline-block text-center">
          {expanded ? '▾' : '▸'}
        </span>
      </button>
      <span className="text-syn-bracket font-mono text-sm">{bracketType}</span>
      {!expanded && (
        <>
          <span className="text-text-muted font-mono text-xs mx-1">
            ... {countLabel}
          </span>
          <span className="text-syn-bracket font-mono text-sm">{closingBracket}</span>
        </>
      )}
    </span>
  );
};

export default CollapsibleBracket;
