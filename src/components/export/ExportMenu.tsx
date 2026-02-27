import React from 'react';
import type { JsonValue } from '@/types/json';
import { useExport } from '@/hooks/useExport';
import Button from '@/components/ui/Button';

interface ExportMenuProps {
  data: JsonValue;
}

const ExportMenu: React.FC<ExportMenuProps> = ({ data }) => {
  const { exportJson, exportMinified, exportCsv, exportYaml, copyToClipboard } = useExport(data);

  const items = [
    { label: '{ } JSON (formatted)', icon: '{ }', action: exportJson },
    { label: '{ } JSON (minified)', icon: '⊞', action: exportMinified },
    { label: '⊟ CSV', icon: '⊟', action: exportCsv },
    { label: '≡ YAML', icon: '≡', action: exportYaml },
    { label: '⎘ Copy to Clipboard', icon: '⎘', action: copyToClipboard },
  ];

  return (
    <div className="bg-bg-secondary border border-border rounded-card p-2 shadow-md flex flex-col gap-1">
      <h3 className="text-xs font-serif font-semibold text-text-secondary px-2 py-1">
        Export Options
      </h3>
      {items.map((item) => (
        <Button
          key={item.label}
          variant="secondary"
          size="sm"
          className="w-full text-left justify-start"
          onClick={item.action}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
};

export default ExportMenu;
