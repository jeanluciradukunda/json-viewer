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

function formatPrimitive(value: string | number | boolean | null): string {
  if (value === null) return 'null';
  if (typeof value === 'string') return value;
  return String(value);
}

function formatKeyValue(name: string | number, value: string | number | boolean | null): string {
  const key = typeof name === 'number' ? `[${name}]` : name;
  const val = value === null ? 'null' : typeof value === 'string' ? `"${value}"` : String(value);
  return `"${key}": ${val}`;
}

const TreeNode: React.FC<TreeNodeProps> = React.memo(({ name, value, path, depth }) => {
  const { isExpanded, toggle, matchPaths, onShowInGraph } = useTreeContext();
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
        <span className="ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 pl-3">
          <CopyButton text={formatPrimitive(value)} label="val" />
          <CopyButton text={formatKeyValue(name, value)} label="pair" />
          <CopyButton text={path} label="path" />
          {onShowInGraph && (
            <button
              onClick={(e) => { e.stopPropagation(); onShowInGraph(path); }}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-btn text-xs font-mono
                bg-surface/80 hover:bg-terra-light text-text-secondary hover:text-terra
                transition-colors cursor-pointer border border-transparent hover:border-terra/20"
              title="Show in graph"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="4" cy="4" r="2" />
                <circle cx="12" cy="4" r="2" />
                <circle cx="8" cy="13" r="2" />
                <line x1="4" y1="6" x2="8" y2="11" />
                <line x1="12" y1="6" x2="8" y2="11" />
              </svg>
              <span>graph</span>
            </button>
          )}
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
        <span className="ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 pl-3">
          <CopyButton text={JSON.stringify(value, null, 2)} label="val" />
          <CopyButton text={path} label="path" />
          {onShowInGraph && (
            <button
              onClick={(e) => { e.stopPropagation(); onShowInGraph(path); }}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-btn text-xs font-mono
                bg-surface/80 hover:bg-terra-light text-text-secondary hover:text-terra
                transition-colors cursor-pointer border border-transparent hover:border-terra/20"
              title="Show in graph"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="4" cy="4" r="2" />
                <circle cx="12" cy="4" r="2" />
                <circle cx="8" cy="13" r="2" />
                <line x1="4" y1="6" x2="8" y2="11" />
                <line x1="12" y1="6" x2="8" y2="11" />
              </svg>
              <span>graph</span>
            </button>
          )}
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
