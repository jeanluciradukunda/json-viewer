import { useState } from 'react';
import JsonTree from '@/components/json-tree/JsonTree';
import JsonFormatter from '@/components/json-editor/JsonFormatter';
import SearchOverlay from '@/components/json-search/SearchOverlay';
import ExportMenu from '@/components/export/ExportMenu';
import { useJsonParser } from '@/hooks/useJsonParser';

interface ViewerProps {
  initialJson: string;
}

type ViewerMode = 'tree' | 'raw' | 'search' | 'export';

export default function Viewer({ initialJson }: ViewerProps) {
  const [mode, setMode] = useState<ViewerMode>('tree');
  const { parsed, stats } = useJsonParser(initialJson);

  if (parsed === undefined) {
    return (
      <div style={{ padding: 20, fontFamily: 'monospace', color: '#A8302A' }}>
        Failed to parse JSON content.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F4F3EE' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px',
        borderBottom: '1px solid #DDD8CE', background: '#FAF8F4',
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>◈ JSON Viewer</span>
        <div style={{ flex: 1 }} />
        {(['tree', 'raw', 'search', 'export'] as ViewerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
              fontSize: 12, fontFamily: 'inherit',
              background: mode === m ? '#F0D6C8' : 'transparent',
              color: mode === m ? '#C15F3C' : '#6B6560',
            }}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
        {mode === 'tree' && <JsonTree data={parsed} />}
        {mode === 'raw' && <JsonFormatter data={parsed} />}
        {mode === 'search' && (
          <>
            <SearchOverlay data={parsed} />
            <JsonTree data={parsed} />
          </>
        )}
        {mode === 'export' && <ExportMenu data={parsed} />}
      </div>

      {stats && (
        <div style={{
          padding: '4px 16px', borderTop: '1px solid #DDD8CE', background: '#FAF8F4',
          fontSize: 11, color: '#9C958C', fontFamily: "'JetBrains Mono', monospace",
        }}>
          {stats.nodeCount} nodes · {stats.byteSize < 1024 ? `${stats.byteSize} bytes` : `${(stats.byteSize / 1024).toFixed(1)} KB`} · Depth: {stats.depth}
        </div>
      )}
    </div>
  );
}
