import { useState, useCallback, useEffect } from 'react';
import type { JsonValue } from '@/types/json';
import { DEFAULT_EXPAND_DEPTH } from '@/constants/defaults';
import { MAX_EXPAND_DEPTH } from '@/constants/limits';

function collectPathsToDepth(
  value: JsonValue,
  currentPath: string,
  currentDepth: number,
  maxDepth: number,
  paths: Map<string, boolean>
): void {
  if (currentDepth >= maxDepth) return;
  if (value === null || typeof value !== 'object') return;

  paths.set(currentPath, true);

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const childPath = `${currentPath}[${i}]`;
      collectPathsToDepth(value[i], childPath, currentDepth + 1, maxDepth, paths);
    }
  } else {
    for (const key of Object.keys(value)) {
      const childPath = `${currentPath}.${key}`;
      collectPathsToDepth(value[key], childPath, currentDepth + 1, maxDepth, paths);
    }
  }
}

function collectAllPaths(
  value: JsonValue,
  currentPath: string,
  paths: Map<string, boolean>,
  depth: number,
  maxDepth: number
): void {
  if (depth >= maxDepth) return;
  if (value === null || typeof value !== 'object') return;

  paths.set(currentPath, true);

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const childPath = `${currentPath}[${i}]`;
      collectAllPaths(value[i], childPath, paths, depth + 1, maxDepth);
    }
  } else {
    for (const key of Object.keys(value)) {
      const childPath = `${currentPath}.${key}`;
      collectAllPaths(value[key], childPath, paths, depth + 1, maxDepth);
    }
  }
}

export function useJsonTree(
  data: JsonValue | undefined,
  defaultDepth: number = DEFAULT_EXPAND_DEPTH
) {
  const [expandedPaths, setExpandedPaths] = useState<Map<string, boolean>>(
    () => new Map()
  );

  // Initialize expanded state when data or defaultDepth changes
  useEffect(() => {
    if (data === undefined || data === null || typeof data !== 'object') {
      setExpandedPaths(new Map());
      return;
    }

    const initial = new Map<string, boolean>();
    collectPathsToDepth(data, '$', 0, defaultDepth, initial);
    setExpandedPaths(initial);
  }, [data, defaultDepth]);

  const isExpanded = useCallback(
    (path: string): boolean => {
      return expandedPaths.get(path) === true;
    },
    [expandedPaths]
  );

  const toggle = useCallback((path: string): void => {
    setExpandedPaths((prev) => {
      const next = new Map(prev);
      if (next.get(path)) {
        next.delete(path);
      } else {
        next.set(path, true);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback((): void => {
    if (data === undefined || data === null || typeof data !== 'object') return;

    const paths = new Map<string, boolean>();
    collectAllPaths(data, '$', paths, 0, MAX_EXPAND_DEPTH);
    setExpandedPaths(paths);
  }, [data]);

  const collapseAll = useCallback((): void => {
    setExpandedPaths(new Map());
  }, []);

  const expandToDepth = useCallback(
    (depth: number): void => {
      if (data === undefined || data === null || typeof data !== 'object') return;

      const clampedDepth = Math.min(depth, MAX_EXPAND_DEPTH);
      const paths = new Map<string, boolean>();
      collectPathsToDepth(data, '$', 0, clampedDepth, paths);
      setExpandedPaths(paths);
    },
    [data]
  );

  return {
    isExpanded,
    toggle,
    expandAll,
    collapseAll,
    expandToDepth,
  };
}
