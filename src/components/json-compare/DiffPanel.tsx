import { useRef, useEffect } from 'react';
import type { DiffLine as DiffLineType } from '@/types/diff';
import DiffLine from '@/components/json-compare/DiffLine';

interface DiffPanelProps {
  lines: DiffLineType[];
  label: string;
  syncRef?: React.RefObject<HTMLDivElement | null>;
  onScroll?: (scrollTop: number) => void;
  scrollTop?: number;
}

const DiffPanel = ({ lines, label, syncRef, onScroll, scrollTop }: DiffPanelProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ref = syncRef ?? containerRef;

  const maxLineNum = lines.reduce((max, l) => Math.max(max, l.lineNumber ?? 0), 0);
  const maxLineNumWidth = Math.max(String(maxLineNum).length, 2);

  useEffect(() => {
    if (scrollTop !== undefined && ref.current) {
      ref.current.scrollTop = scrollTop;
    }
  }, [scrollTop, ref]);

  const handleScroll = () => {
    if (onScroll && ref.current) {
      onScroll(ref.current.scrollTop);
    }
  };

  return (
    <div className="flex flex-col border border-border rounded-card overflow-hidden bg-bg-input">
      <div className="px-3 py-2 border-b border-border bg-bg-secondary flex items-center justify-between">
        <span className="text-xs font-serif font-semibold text-text-secondary">{label}</span>
        <span className="text-xs font-mono text-text-muted">{lines.length} lines</span>
      </div>
      <div
        ref={ref}
        className="flex-1 overflow-auto"
        onScroll={handleScroll}
      >
        {lines.length > 0 ? (
          <div className="min-w-fit">
            {lines.map((line, index) => (
              <DiffLine key={index} line={line} maxLineNumWidth={maxLineNumWidth} />
            ))}
          </div>
        ) : (
          <div className="p-4 text-text-muted text-xs font-mono text-center">
            No content
          </div>
        )}
      </div>
    </div>
  );
};

export default DiffPanel;
