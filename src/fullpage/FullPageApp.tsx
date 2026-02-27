import AppShell from '@/components/layout/AppShell';
import EmptyState from '@/components/layout/EmptyState';
import TabBar from '@/components/tabs/TabBar';
import JsonInput from '@/components/json-editor/JsonInput';
import JsonFormatter from '@/components/json-editor/JsonFormatter';
import JsonTree from '@/components/json-tree/JsonTree';
import CompareView from '@/components/json-compare/CompareView';
import SearchOverlay from '@/components/json-search/SearchOverlay';
import ExportMenu from '@/components/export/ExportMenu';
import { useJsonParser } from '@/hooks/useJsonParser';
import { useTabsStore } from '@/hooks/useTabsStore';

export default function FullPageApp() {
  const { tabs, activeTab, loaded, addTab, closeTab, switchTab, updateTabInput, updateTabView } =
    useTabsStore();

  const rawInput = activeTab?.rawInput ?? '';
  const view = activeTab?.sidebarView ?? 'beautify';
  const { parsed, error, stats } = useJsonParser(rawInput);

  if (!loaded) return null;

  const handleInputChange = (value: string) => {
    if (activeTab) updateTabInput(activeTab.id, value);
  };

  const handleViewChange = (newView: typeof view) => {
    if (activeTab) updateTabView(activeTab.id, newView);
  };

  return (
    <AppShell
      activeView={view}
      onViewChange={handleViewChange}
      stats={stats}
      tabBar={
        <TabBar
          tabs={tabs}
          activeTabId={activeTab?.id ?? ''}
          onSwitch={switchTab}
          onClose={closeTab}
          onAdd={() => addTab()}
        />
      }
    >
      {view === 'beautify' && (
        <div className="flex flex-col h-full gap-3">
          <JsonInput value={rawInput} onChange={handleInputChange} error={error} />
          {parsed !== undefined ? <JsonFormatter data={parsed} /> : <EmptyState />}
        </div>
      )}
      {view === 'tree' && (
        <div className="flex flex-col h-full gap-3">
          <JsonInput value={rawInput} onChange={handleInputChange} error={error} />
          {parsed !== undefined ? <JsonTree data={parsed} /> : <EmptyState />}
        </div>
      )}
      {view === 'compare' && <CompareView />}
      {view === 'search' && (
        <div className="flex flex-col h-full gap-3">
          <JsonInput value={rawInput} onChange={handleInputChange} error={error} />
          {parsed !== undefined ? (
            <>
              <SearchOverlay data={parsed} />
              <JsonTree data={parsed} />
            </>
          ) : <EmptyState />}
        </div>
      )}
      {view === 'export' && (
        <div className="flex flex-col h-full gap-3">
          <JsonInput value={rawInput} onChange={handleInputChange} error={error} />
          {parsed !== undefined ? <ExportMenu data={parsed} /> : <EmptyState />}
        </div>
      )}
    </AppShell>
  );
}
