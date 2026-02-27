import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

export interface GraphNodeData {
  [key: string]: unknown;
  label: string;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  value?: string;
  childCount?: number;
  isRoot?: boolean;
}

const typeBadge: Record<string, string> = {
  object: '{}',
  array: '[]',
};

function valueColorClass(type: string): string {
  switch (type) {
    case 'string':
      return 'text-syn-string';
    case 'number':
      return 'text-syn-number';
    case 'boolean':
      return 'text-syn-boolean';
    case 'null':
      return 'text-syn-null italic';
    default:
      return 'text-text-primary';
  }
}

const GraphNode: React.FC<NodeProps> = ({ data }) => {
  const d = data as unknown as GraphNodeData;
  const isContainer = d.type === 'object' || d.type === 'array';

  return (
    <div className="bg-bg-secondary border border-border rounded-card shadow-sm px-3 py-2 min-w-[100px] max-w-[240px]">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-terra !w-2 !h-2 !border-none"
      />

      {isContainer ? (
        <div className="flex items-center gap-2">
          <span className="text-syn-key font-mono text-sm font-medium truncate">
            {d.label}
          </span>
          <span className="text-xs font-mono text-text-muted bg-surface px-1.5 py-0.5 rounded-btn">
            {typeBadge[d.type]}
          </span>
          {d.childCount !== undefined && (
            <span className="text-xs text-text-secondary">
              {d.childCount}
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-1.5 font-mono text-sm">
          <span className="text-syn-key font-medium truncate">{d.label}:</span>
          <span className={`${valueColorClass(d.type)} truncate`}>
            {d.value}
          </span>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-terra !w-2 !h-2 !border-none"
      />
    </div>
  );
};

export default GraphNode;
