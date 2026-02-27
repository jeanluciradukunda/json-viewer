import type { DiffLine as DiffLineType, DiffSegment } from '@/types/diff';

interface DiffLineProps {
  line: DiffLineType;
  maxLineNumWidth: number;
}

const lineBg: Record<string, string> = {
  added: 'bg-diff-added-bg/50',
  removed: 'bg-diff-removed-bg/50',
  modified: 'bg-diff-modified-bg/40',
  unchanged: '',
};

const lineNumBg: Record<string, string> = {
  added: 'bg-diff-added-bg',
  removed: 'bg-diff-removed-bg',
  modified: 'bg-diff-modified-bg/60',
  unchanged: '',
};

const textColor: Record<string, string> = {
  added: 'text-diff-added-text',
  removed: 'text-diff-removed-text',
  modified: 'text-diff-modified-text',
  unchanged: 'text-text-primary',
};

const highlightBg: Record<string, string> = {
  added: 'bg-diff-added-bg',
  removed: 'bg-diff-removed-bg',
  modified: 'bg-diff-modified-bg',
  unchanged: '',
};

const prefixes: Record<string, string> = {
  added: '+',
  removed: '-',
  modified: '~',
  unchanged: ' ',
};

function renderSegments(segments: DiffSegment[], type: string) {
  return segments.map((seg, i) => (
    <span
      key={i}
      className={seg.highlight ? `${highlightBg[type]} rounded-sm` : ''}
    >
      {seg.text}
    </span>
  ));
}

const DiffLine = ({ line, maxLineNumWidth }: DiffLineProps) => {
  const lineNum = line.lineNumber && line.lineNumber > 0
    ? String(line.lineNumber).padStart(maxLineNumWidth, ' ')
    : ' '.repeat(maxLineNumWidth);

  return (
    <div className={`flex items-stretch font-mono text-sm leading-6 ${lineBg[line.type] ?? ''} border-b border-border-subtle/30`}>
      <span
        className={`shrink-0 select-none text-right px-2 text-text-muted/70 ${lineNumBg[line.type] ?? ''}`}
        style={{ minWidth: `${maxLineNumWidth + 2}ch` }}
      >
        {lineNum}
      </span>
      <span className={`shrink-0 w-6 text-center select-none font-bold ${textColor[line.type] ?? ''}`}>
        {prefixes[line.type] ?? ' '}
      </span>
      <span className={`flex-1 whitespace-pre ${textColor[line.type] ?? ''}`}>
        {line.segments ? renderSegments(line.segments, line.type) : line.content}
      </span>
    </div>
  );
};

export default DiffLine;
