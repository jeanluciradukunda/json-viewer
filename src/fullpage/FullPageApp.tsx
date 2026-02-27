import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import JsonInput from '@/components/json-editor/JsonInput';
import JsonFormatter from '@/components/json-editor/JsonFormatter';
import JsonTree from '@/components/json-tree/JsonTree';
import CompareView from '@/components/json-compare/CompareView';
import SearchOverlay from '@/components/json-search/SearchOverlay';
import ExportMenu from '@/components/export/ExportMenu';
import { useJsonParser } from '@/hooks/useJsonParser';
import type { SidebarView } from '@/types/ui';

export default function FullPageApp() {
  const [view, setView] = useState<SidebarView>('beautify');
  const [rawInput, setRawInput] = useState('');
  const { parsed, error, stats } = useJsonParser(rawInput);

  return (
    <AppShell activeView={view} onViewChange={setView} stats={stats}>
      {view === 'beautify' && (
        <div className="flex flex-col h-full gap-3">
          <JsonInput value={rawInput} onChange={setRawInput} error={error} />
          {parsed !== undefined && <JsonFormatter data={parsed} />}
        </div>
      )}
      {view === 'tree' && (
        <div className="flex flex-col h-full gap-3">
          <JsonInput value={rawInput} onChange={setRawInput} error={error} />
          {parsed !== undefined && <JsonTree data={parsed} />}
        </div>
      )}
      {view === 'compare' && <CompareView />}
      {view === 'search' && (
        <div className="flex flex-col h-full gap-3">
          <JsonInput value={rawInput} onChange={setRawInput} error={error} />
          {parsed !== undefined && (
            <>
              <SearchOverlay data={parsed} />
              <JsonTree data={parsed} />
            </>
          )}
        </div>
      )}
      {view === 'export' && (
        <div className="flex flex-col h-full gap-3">
          <JsonInput value={rawInput} onChange={setRawInput} error={error} />
          {parsed !== undefined && <ExportMenu data={parsed} />}
        </div>
      )}
    </AppShell>
  );
}
