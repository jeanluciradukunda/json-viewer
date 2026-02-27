import { useState, useEffect, useCallback, useRef } from 'react';
import type { TabData, TabsState } from '@/types/tabs';
import type { SidebarView } from '@/types/ui';

const STORAGE_KEY = 'jsonviewer_tabs';
const SAVE_DEBOUNCE_MS = 500;

let nextTabNumber = 1;

function createTab(initialInput = '', label?: string): TabData {
  const num = nextTabNumber++;
  return {
    id: crypto.randomUUID(),
    label: label ?? `Tab ${num}`,
    rawInput: initialInput,
    sidebarView: 'beautify',
    createdAt: Date.now(),
  };
}

function readPendingJson(): string | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('json');
  if (!encoded) return null;
  try {
    const decoded = decodeURIComponent(atob(encoded));
    // Clear the URL param so it doesn't re-trigger
    const url = new URL(window.location.href);
    url.searchParams.delete('json');
    history.replaceState(null, '', url.toString());
    return decoded;
  } catch {
    return null;
  }
}

export function useTabsStore() {
  const [state, setState] = useState<TabsState>({ tabs: [], activeTabId: '' });
  const [loaded, setLoaded] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from storage on mount
  useEffect(() => {
    chrome.storage.local.get(STORAGE_KEY, (result) => {
      let stored: TabsState | null = result[STORAGE_KEY] ?? null;

      // Restore nextTabNumber from existing tabs
      if (stored && stored.tabs.length > 0) {
        const maxNum = stored.tabs.reduce((max, tab) => {
          const match = tab.label.match(/^Tab (\d+)$/);
          return match ? Math.max(max, parseInt(match[1], 10)) : max;
        }, 0);
        nextTabNumber = maxNum + 1;
      }

      const pendingJson = readPendingJson();

      if (pendingJson) {
        // Create a new tab with the pending JSON
        const newTab = createTab(pendingJson);
        if (stored && stored.tabs.length > 0) {
          stored = {
            tabs: [...stored.tabs, newTab],
            activeTabId: newTab.id,
          };
        } else {
          stored = { tabs: [newTab], activeTabId: newTab.id };
        }
      }

      if (!stored || stored.tabs.length === 0) {
        const defaultTab = createTab();
        stored = { tabs: [defaultTab], activeTabId: defaultTab.id };
      }

      // Validate activeTabId points to existing tab
      if (!stored.tabs.find((t) => t.id === stored!.activeTabId)) {
        stored.activeTabId = stored.tabs[0].id;
      }

      setState(stored);
      setLoaded(true);
    });
  }, []);

  // Debounced save to storage on state change
  useEffect(() => {
    if (!loaded) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      chrome.storage.local.set({ [STORAGE_KEY]: state });
    }, SAVE_DEBOUNCE_MS);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [state, loaded]);

  const activeTab = state.tabs.find((t) => t.id === state.activeTabId) ?? state.tabs[0];

  const addTab = useCallback((initialInput = '') => {
    const newTab = createTab(initialInput);
    setState((prev) => ({
      tabs: [...prev.tabs, newTab],
      activeTabId: newTab.id,
    }));
  }, []);

  const closeTab = useCallback((id: string) => {
    setState((prev) => {
      const remaining = prev.tabs.filter((t) => t.id !== id);
      if (remaining.length === 0) {
        const newTab = createTab();
        return { tabs: [newTab], activeTabId: newTab.id };
      }
      const newActiveId =
        prev.activeTabId === id
          ? remaining[Math.min(prev.tabs.findIndex((t) => t.id === id), remaining.length - 1)]?.id ?? remaining[0].id
          : prev.activeTabId;
      return { tabs: remaining, activeTabId: newActiveId };
    });
  }, []);

  const switchTab = useCallback((id: string) => {
    setState((prev) => ({ ...prev, activeTabId: id }));
  }, []);

  const updateTabInput = useCallback((id: string, rawInput: string) => {
    setState((prev) => ({
      ...prev,
      tabs: prev.tabs.map((t) => (t.id === id ? { ...t, rawInput } : t)),
    }));
  }, []);

  const updateTabView = useCallback((id: string, sidebarView: SidebarView) => {
    setState((prev) => ({
      ...prev,
      tabs: prev.tabs.map((t) => (t.id === id ? { ...t, sidebarView } : t)),
    }));
  }, []);

  return {
    tabs: state.tabs,
    activeTab,
    loaded,
    addTab,
    closeTab,
    switchTab,
    updateTabInput,
    updateTabView,
  };
}
