import React from 'react';

interface ExportOptionsProps {
  onSelect: (format: string) => void;
}

const formats = [
  { id: 'json', label: 'JSON (formatted)', icon: '{ }' },
  { id: 'json-min', label: 'JSON (minified)', icon: '⊞' },
  { id: 'csv', label: 'CSV', icon: '⊟' },
  { id: 'yaml', label: 'YAML', icon: '≡' },
  { id: 'clipboard', label: 'Copy to Clipboard', icon: '⎘' },
];

const ExportOptions: React.FC<ExportOptionsProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col gap-0.5">
      {formats.map((format) => (
        <button
          key={format.id}
          onClick={() => onSelect(format.id)}
          className="flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-surface rounded-btn transition-colors text-left font-serif"
        >
          <span className="text-text-secondary w-5 text-center">{format.icon}</span>
          <span>{format.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ExportOptions;
