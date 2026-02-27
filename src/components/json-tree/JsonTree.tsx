import React, { useState } from 'react';
import type { JsonValue } from '@/types/json';
import { TreeProvider, useTreeContext } from '@/components/json-tree/TreeContext';
import TreeNode from '@/components/json-tree/TreeNode';
import Button from '@/components/ui/Button';

interface JsonTreeProps {
  data: JsonValue;
}

const TreeToolbar: React.FC = () => {
  const { expandAll, collapseAll, expandToDepth } = useTreeContext();
  const [depth, setDepth] = useState(2);

  return (
    <div className="flex items-center gap-2 mb-2 flex-wrap">
      <Button variant="ghost" size="sm" onClick={expandAll}>
        Expand All
      </Button>
      <Button variant="ghost" size="sm" onClick={collapseAll}>
        Collapse All
      </Button>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => expandToDepth(depth)}
        >
          Expand to depth:
        </Button>
        <input
          type="number"
          min={0}
          max={20}
          value={depth}
          onChange={(e) => setDepth(Number(e.target.value))}
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
  return (
    <TreeProvider data={data}>
      <TreeToolbar />
      <div className="font-mono text-sm overflow-auto">
        <TreeContent data={data} />
      </div>
    </TreeProvider>
  );
};

export default JsonTree;
