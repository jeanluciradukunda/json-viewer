import { useState, useEffect, useCallback, useRef } from 'react';
import type { JsonValue } from '@/types/json';
import type { SearchMatch, SearchState } from '@/types/search';
import { SEARCH_DEBOUNCE_MS } from '@/constants/defaults';

function searchRecursive(
  value: JsonValue,
  query: string,
  currentPath: string,
  matches: SearchMatch[]
): void {
  const lowerQuery = query.toLowerCase();

  if (value === null) return;

  if (typeof value === 'string') {
    if (value.toLowerCase().includes(lowerQuery)) {
      matches.push({
        path: currentPath,
        key: undefined,
        value: value,
        type: 'value',
      });
    }
    return;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    if (String(value).toLowerCase().includes(lowerQuery)) {
      matches.push({
        path: currentPath,
        key: undefined,
        value: value,
        type: 'value',
      });
    }
    return;
  }

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const childPath = `${currentPath}[${i}]`;
      searchRecursive(value[i], query, childPath, matches);
    }
    return;
  }

  if (typeof value === 'object') {
    for (const key of Object.keys(value)) {
      const childPath = `${currentPath}.${key}`;

      if (key.toLowerCase().includes(lowerQuery)) {
        matches.push({
          path: childPath,
          key,
          value: value[key],
          type: 'key',
        });
      }

      searchRecursive(value[key], query, childPath, matches);
    }
  }
}

export function useJsonSearch(
  data: JsonValue | undefined,
  query: string
): SearchState {
  const [matches, setMatches] = useState<SearchMatch[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current !== null) {
      clearTimeout(debounceRef.current);
    }

    if (!query || query.trim().length === 0 || data === undefined) {
      setMatches([]);
      setCurrentIndex(0);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    debounceRef.current = setTimeout(() => {
      const found: SearchMatch[] = [];
      searchRecursive(data, query.trim(), '$', found);
      setMatches(found);
      setCurrentIndex(0);
      setIsSearching(false);
      debounceRef.current = null;
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [data, query]);

  const next = useCallback((): void => {
    if (matches.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % matches.length);
  }, [matches.length]);

  const prev = useCallback((): void => {
    if (matches.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + matches.length) % matches.length);
  }, [matches.length]);

  return {
    matches,
    currentIndex,
    isSearching,
    next,
    prev,
  };
}
