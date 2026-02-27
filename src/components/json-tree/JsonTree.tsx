import React, { useState, useCallback } from 'react';
import type { JsonValue } from '@/types/json';
import { TreeProvider, useTreeContext } from '@/components/json-tree/TreeContext';
import TreeNode from '@/components/json-tree/TreeNode';
import GraphView from '@/components/json-tree/GraphView';
import Button from '@/components/ui/Button';

type ViewMode = 'list' | 'graph';

interface JsonTreeProps {
  data: JsonValue;
}

const TreeToolbar: React.FC<{
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  depth: number;
  onDepthChange: (depth: number) => void;
}> = ({ viewMode, onViewModeChange, depth, onDepthChange }) => {
  const { expandAll, collapseAll, expandToDepth } = useTreeContext();

  return (
    <div className="flex items-center gap-2 mb-2 flex-wrap">
      <div className="flex items-center border border-border rounded-btn overflow-hidden">
        <button
          onClick={() => onViewModeChange('list')}
          className={`px-2.5 py-1 text-xs font-serif transition-colors ${
            viewMode === 'list'
              ? 'bg-terra-light text-terra'
              : 'bg-bg-secondary text-text-secondary hover:bg-surface'
          }`}
        >
          List
        </button>
        <button
          onClick={() => onViewModeChange('graph')}
          className={`px-2.5 py-1 text-xs font-serif transition-colors ${
            viewMode === 'graph'
              ? 'bg-terra-light text-terra'
              : 'bg-bg-secondary text-text-secondary hover:bg-surface'
          }`}
        >
          Graph
        </button>
      </div>

      {viewMode === 'list' && (
        <>
          <Button variant="ghost" size="sm" onClick={expandAll}>
            Expand All
          </Button>
          <Button variant="ghost" size="sm" onClick={collapseAll}>
            Collapse All
          </Button>
        </>
      )}

      <div className="flex items-center gap-1">
        <span className="text-xs text-text-secondary font-serif px-2 py-1">
          Depth:
        </span>
        <input
          type="number"
          min={0}
          max={20}
          value={depth}
          onChange={(e) => {
            const val = Number(e.target.value);
            onDepthChange(val);
            if (viewMode === 'list') {
              expandToDepth(val);
            }
          }}
          className="w-12 px-1 py-0.5 text-xs font-mono border border-border rounded-btn bg-bg-input text-text-primary text-center focus:outline-none focus:shadow-focus"
        />
      </div>
    </div>
  );
};

const TreeContent: React.FC<{ data: JsonValue }> = ({ data }) => {
  if (data === null || typeof data !== 'object') {
    return (
      <TreeNode name="root" value={data} path="$" depth={0} />
    );
  }

  if (Array.isArray(data)) {
    return (
      <div>
        <span className="text-syn-bracket font-mono text-sm">[</span>
        {data.map((item, index) => (
          <TreeNode
            key={index}
            name={index}
            value={item}
            path={`$[${index}]`}
            depth={1}
          />
        ))}
        <span className="text-syn-bracket font-mono text-sm">]</span>
      </div>
    );
  }

  const entries = Object.entries(data);
  return (
    <div>
      <span className="text-syn-bracket font-mono text-sm">{'{'}</span>
      {entries.map(([key, value]) => (
        <TreeNode
          key={key}
          name={key}
          value={value as JsonValue}
          path={`$.${key}`}
          depth={1}
        />
      ))}
      <span className="text-syn-bracket font-mono text-sm">{'}'}</span>
    </div>
  );
};

const JsonTree: React.FC<JsonTreeProps> = ({ data }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [depth, setDepth] = useState(2);
  const [focusNodeId, setFocusNodeId] = useState<string | undefined>();

  const onShowInGraph = useCallback((path: string) => {
    // Calculate the depth of the target node from its path
    // Each '.' or '[' after '$' indicates a level deeper
    const segments = path.replace(/\$/,'').split(/(?=\.)|(?=\[)/).filter(Boolean);
    const nodeDepth = segments.length;
    setDepth((prev) => Math.max(prev, nodeDepth));
    setViewMode('graph');
    setFocusNodeId(path);
  }, []);

  return (
    <TreeProvider data={data} onShowInGraph={onShowInGraph}>
      <TreeToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        depth={depth}
        onDepthChange={setDepth}
      />
      {viewMode === 'list' ? (
        <div className="font-mono text-sm overflow-auto">
          <TreeContent data={data} />
        </div>
      ) : (
        <GraphView data={data} depth={depth} focusNodeId={focusNodeId} />
      )}
    </TreeProvider>
  );
};

export default JsonTree;
