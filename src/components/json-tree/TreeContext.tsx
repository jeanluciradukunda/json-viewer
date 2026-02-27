import React, { createContext, useContext } from 'react';
import type { JsonValue } from '@/types/json';
import { useJsonTree } from '@/hooks/useJsonTree';
import { useJsonPath } from '@/hooks/useJsonPath';

interface TreeContextValue {
  isExpanded: (path: string) => boolean;
  toggle: (path: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  expandToDepth: (depth: number) => void;
  copyPath: (path: string) => void;
  copiedPath: string | null;
  searchQuery: string;
  matchPaths: Set<string>;
  onShowInGraph?: (path: string) => void;
}

const TreeCtx = createContext<TreeContextValue | null>(null);

interface TreeProviderProps {
  data: JsonValue;
  children: React.ReactNode;
  searchQuery?: string;
  matchPaths?: Set<string>;
  onShowInGraph?: (path: string) => void;
}

export const TreeProvider: React.FC<TreeProviderProps> = ({
  data,
  children,
  searchQuery = '',
  matchPaths = new Set<string>(),
  onShowInGraph,
}) => {
  const { isExpanded, toggle, expandAll, collapseAll, expandToDepth } = useJsonTree(data);
  const { copyPath, copiedPath } = useJsonPath();

  return (
    <TreeCtx.Provider
      value={{
        isExpanded,
        toggle,
        expandAll,
        collapseAll,
        expandToDepth,
        copyPath,
        copiedPath,
        searchQuery,
        matchPaths,
        onShowInGraph,
      }}
    >
      {children}
    </TreeCtx.Provider>
  );
};

export const useTreeContext = (): TreeContextValue => {
  const ctx = useContext(TreeCtx);
  if (!ctx) {
    throw new Error('useTreeContext must be used within a TreeProvider');
  }
  return ctx;
};
