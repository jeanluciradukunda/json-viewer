import React from 'react';
import type { JsonValue } from '@/types/json';
import { useTreeContext } from '@/components/json-tree/TreeContext';
import TreeKey from '@/components/json-tree/TreeKey';
import TreeValue from '@/components/json-tree/TreeValue';
import CollapsibleBracket from '@/components/json-tree/CollapsibleBracket';
import CopyButton from '@/components/ui/CopyButton';

interface TreeNodeProps {
  name: string | number;
  value: JsonValue;
  path: string;
  depth: number;
}

const isObject = (val: JsonValue): val is Record<string, JsonValue> =>
  val !== null && typeof val === 'object' && !Array.isArray(val);

const isArray = (val: JsonValue): val is JsonValue[] =>
  Array.isArray(val);

const isPrimitive = (val: JsonValue): val is string | number | boolean | null =>
  val === null || typeof val !== 'object';

const TreeNode: React.FC<TreeNodeProps> = React.memo(({ name, value, path, depth }) => {
  const { isExpanded, toggle, matchPaths } = useTreeContext();
  const highlighted = matchPaths.has(path);

  if (isPrimitive(value)) {
    return (
      <div
        className={`group flex items-center py-0.5 ${highlighted ? 'bg-terra-light/30 rounded' : ''}`}
        style={{ paddingLeft: `${depth * 16}px` }}
      >
        <TreeKey name={name} path={path} />
        <span className="text-syn-punctuation font-mono text-sm mx-1">:</span>
        <TreeValue value={value} />
        <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <span className="text-text-muted text-xs font-mono">{path}</span>
          <CopyButton text={path} />
        </span>
      </div>
    );
  }

  const isObj = isObject(value);
  const isArr = isArray(value);
  const entries = isObj
    ? Object.entries(value)
    : isArr
    ? value.map((v, i) => [i, v] as [number, JsonValue])
    : [];
  const bracketType = isObj ? '{' as const : '[' as const;
  const closingBracket = isObj ? '}' : ']';
  const expanded = isExpanded(path);

  return (
    <div>
      <div
        className={`group flex items-center py-0.5 ${highlighted ? 'bg-terra-light/30 rounded' : ''}`}
        style={{ paddingLeft: `${depth * 16}px` }}
      >
        <TreeKey name={name} path={path} />
        <span className="text-syn-punctuation font-mono text-sm mx-1">:</span>
        <CollapsibleBracket
          expanded={expanded}
          onToggle={() => toggle(path)}
          bracketType={bracketType}
          childCount={entries.length}
        />
        <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <span className="text-text-muted text-xs font-mono">{path}</span>
          <CopyButton text={path} />
        </span>
      </div>
      {expanded && (
        <>
          {entries.map(([key, val]) => {
            const childPath = isObj ? `${path}.${key}` : `${path}[${key}]`;
            return (
              <TreeNode
                key={String(key)}
                name={isObj ? (key as string) : (key as number)}
                value={val as JsonValue}
                path={childPath}
                depth={depth + 1}
              />
            );
          })}
          <div
            className="py-0.5"
            style={{ paddingLeft: `${depth * 16}px` }}
          >
            <span className="text-syn-bracket font-mono text-sm">{closingBracket}</span>
          </div>
        </>
      )}
    </div>
  );
});

TreeNode.displayName = 'TreeNode';

export default TreeNode;
