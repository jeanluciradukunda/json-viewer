import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { JsonValue } from '@/types/json';
import { useJsonSearch } from '@/hooks/useJsonSearch';
import Button from '@/components/ui/Button';

interface SearchOverlayProps {
  data: JsonValue;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ data }) => {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const searchState = useJsonSearch(data, query);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        setVisible((prev) => {
          if (!prev) {
            setTimeout(() => inputRef.current?.focus(), 0);
          }
          return !prev;
        });
      }
      if (e.key === 'Escape' && visible) {
        setVisible(false);
        setQuery('');
      }
    },
    [visible]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!visible) return null;

  const { matches, currentIndex, next, prev } = searchState;

  return (
    <div className="sticky top-0 z-40 flex items-center gap-2 p-2 bg-bg-secondary border border-border rounded-card shadow-md mb-2">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search in JSON..."
        className="flex-1 font-mono text-sm px-2 py-1 rounded-btn border border-border bg-bg-input text-text-primary focus:outline-none focus:shadow-focus"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.shiftKey ? prev() : next();
          }
        }}
      />
      <span className="text-xs text-text-muted font-mono whitespace-nowrap">
        {matches.length > 0
          ? `${currentIndex + 1} of ${matches.length}`
          : query
          ? 'No matches'
          : ''}
      </span>
      <Button variant="ghost" size="sm" onClick={prev} disabled={matches.length === 0}>
        ▲
      </Button>
      <Button variant="ghost" size="sm" onClick={next} disabled={matches.length === 0}>
        ▼
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setVisible(false);
          setQuery('');
        }}
      >
        ✕
      </Button>
    </div>
  );
};

export default SearchOverlay;
