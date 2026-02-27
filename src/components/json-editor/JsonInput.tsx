import React from 'react';
import type { ParseError } from '@/types/json';

interface JsonInputProps {
  value: string;
  onChange: (value: string) => void;
  error: ParseError | null;
  placeholder?: string;
}

const JsonInput: React.FC<JsonInputProps> = ({
  value,
  onChange,
  error,
  placeholder = 'Paste or drop JSON here...',
}) => {
  return (
    <div className="flex flex-col gap-1">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`font-mono text-sm bg-bg-input border rounded-card p-3 resize-none min-h-[100px] w-full focus:outline-none focus:shadow-focus transition-colors ${
          error ? 'border-diff-removed-text' : 'border-border'
        }`}
        spellCheck={false}
      />
      {error && (
        <p className="text-diff-removed-text text-xs font-mono">
          {error.message}
          {error.line != null && ` (line ${error.line}, column ${error.column})`}
        </p>
      )}
    </div>
  );
};

export default JsonInput;
