import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
} from '@xyflow/react';
import dagre from 'dagre';
import type { JsonValue } from '@/types/json';
import GraphNode from './GraphNode';
import type { GraphNodeData } from './GraphNode';

const nodeTypes = { graphNode: GraphNode };

const NODE_WIDTH = 180;
const NODE_HEIGHT = 44;

function formatValue(value: JsonValue): string {
  if (value === null) return 'null';
  if (typeof value === 'string') return `"${value}"`;
  return String(value);
}

function getValueType(
  value: JsonValue
): 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null' {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  return typeof value as 'string' | 'number' | 'boolean';
}

interface FlowData {
  nodes: Node[];
  edges: Edge[];
}

function jsonToFlow(data: JsonValue): FlowData {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  function walk(value: JsonValue, path: string, label: string) {
    const type = getValueType(value);
    const isContainer = type === 'object' || type === 'array';

    const nodeData: GraphNodeData = {
      label,
      type,
      ...(isContainer
        ? {
            childCount: Array.isArray(value)
              ? value.length
              : Object.keys(value as Record<string, JsonValue>).length,
          }
        : { value: formatValue(value) }),
      isRoot: path === '$',
    };

    nodes.push({
      id: path,
      type: 'graphNode',
      position: { x: 0, y: 0 },
      data: nodeData,
    });

    if (type === 'object' && value !== null) {
      const entries = Object.entries(value as Record<string, JsonValue>);
      for (const [key, child] of entries) {
        const childPath = `${path}.${key}`;
        edges.push({
          id: `${path}->${childPath}`,
          source: path,
          target: childPath,
        });
        walk(child, childPath, key);
      }
    } else if (type === 'array') {
      const arr = value as JsonValue[];
      for (let i = 0; i < arr.length; i++) {
        const childPath = `${path}[${i}]`;
        edges.push({
          id: `${path}->${childPath}`,
          source: path,
          target: childPath,
        });
        walk(arr[i], childPath, String(i));
      }
    }
  }

  walk(data, '$', 'root');
  return { nodes, edges };
}

function applyDagreLayout(nodes: Node[], edges: Edge[]): Node[] {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', nodesep: 30, ranksep: 80 });

  for (const node of nodes) {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }
  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  return nodes.map((node) => {
    const pos = g.node(node.id);
    return {
      ...node,
      position: {
        x: pos.x - NODE_WIDTH / 2,
        y: pos.y - NODE_HEIGHT / 2,
      },
    };
  });
}

interface GraphViewProps {
  data: JsonValue;
}

const GraphView: React.FC<GraphViewProps> = ({ data }) => {
  const { nodes, edges } = useMemo(() => {
    const { nodes: rawNodes, edges } = jsonToFlow(data);
    const nodes = applyDagreLayout(rawNodes, edges);
    return { nodes, edges };
  }, [data]);

  return (
    <div className="h-[500px] w-full border border-border rounded-card overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={24} size={1} color="#D5CFC4" />
        <Controls
          showInteractive={false}
          className="!bg-bg-secondary !border-border !shadow-sm [&>button]:!bg-bg-secondary [&>button]:!border-border [&>button]:!fill-text-secondary hover:[&>button]:!bg-surface"
        />
      </ReactFlow>
    </div>
  );
};

export default GraphView;
