import type { DiffLine as DiffLineType } from '@/types/diff';

interface DiffLineProps {
  line: DiffLineType;
  maxLineNumWidth: number;
}

const bgClasses: Record<string, string> = {
  added: 'bg-diff-added-bg',
  removed: 'bg-diff-removed-bg',
  modified: 'bg-diff-modified-bg',
  unchanged: '',
};

const textClasses: Record<string, string> = {
  added: 'text-diff-added-text',
  removed: 'text-diff-removed-text',
  modified: 'text-diff-modified-text',
  unchanged: 'text-text-primary',
};

const prefixes: Record<string, string> = {
  added: '+',
  removed: '-',
  modified: '~',
  unchanged: ' ',
};

const DiffLine = ({ line, maxLineNumWidth }: DiffLineProps) => {
  const lineNum = line.lineNumber && line.lineNumber > 0
    ? String(line.lineNumber).padStart(maxLineNumWidth, ' ')
    : ' '.repeat(maxLineNumWidth);

  return (
    <div className={`flex items-stretch font-mono text-sm leading-6 ${bgClasses[line.type] ?? ''}`}>
      <span className="shrink-0 text-text-muted select-none text-right px-2 border-r border-border-subtle opacity-60"
        style={{ minWidth: `${maxLineNumWidth + 2}ch` }}
      >
        {lineNum}
      </span>
      <span className={`shrink-0 w-5 text-center select-none font-bold ${textClasses[line.type] ?? ''}`}>
        {prefixes[line.type] ?? ' '}
      </span>
      <span className={`flex-1 whitespace-pre ${textClasses[line.type] ?? ''}`}>
        {line.content}
      </span>
    </div>
  );
};

export default DiffLine;
