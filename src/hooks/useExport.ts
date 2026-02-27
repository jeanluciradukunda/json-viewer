import { useCallback } from 'react';
import type { JsonValue } from '@/types/json';
import { formatJson, minifyJson } from '@/utils/json-formatter';
import { jsonToCsv } from '@/utils/json-to-csv';
import { jsonToYaml } from '@/utils/json-to-yaml';
import { downloadFile } from '@/utils/download';

interface UseExportResult {
  exportJson: () => void;
  exportMinified: () => void;
  exportCsv: () => void;
  exportYaml: () => void;
  copyToClipboard: () => Promise<void>;
}

export function useExport(data: JsonValue | undefined): UseExportResult {
  const exportJson = useCallback((): void => {
    if (data === undefined) return;
    const content = formatJson(data);
    downloadFile(content, 'data.json', 'application/json');
  }, [data]);

  const exportMinified = useCallback((): void => {
    if (data === undefined) return;
    const content = minifyJson(data);
    downloadFile(content, 'data.min.json', 'application/json');
  }, [data]);

  const exportCsv = useCallback((): void => {
    if (data === undefined) return;
    const content = jsonToCsv(data);
    downloadFile(content, 'data.csv', 'text/csv');
  }, [data]);

  const exportYaml = useCallback((): void => {
    if (data === undefined) return;
    const content = jsonToYaml(data);
    downloadFile(content, 'data.yaml', 'application/x-yaml');
  }, [data]);

  const copyToClipboard = useCallback(async (): Promise<void> => {
    if (data === undefined) return;
    const content = formatJson(data);
    await navigator.clipboard.writeText(content);
  }, [data]);

  return {
    exportJson,
    exportMinified,
    exportCsv,
    exportYaml,
    copyToClipboard,
  };
}
