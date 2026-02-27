import { useState, useRef, useCallback } from 'react';
import { useJsonDiff } from '@/hooks/useJsonDiff';
import JsonInput from '@/components/json-editor/JsonInput';
import DiffPanel from '@/components/json-compare/DiffPanel';
import DiffSummary from '@/components/json-compare/DiffSummary';

const CompareView = () => {
  const [leftInput, setLeftInput] = useState('');
  const [rightInput, setRightInput] = useState('');
  const { result, leftError, rightError } = useJsonDiff(leftInput, rightInput);

  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const syncing = useRef(false);

  const syncScroll = useCallback((source: 'left' | 'right', scrollTop: number) => {
    if (syncing.current) return;
    syncing.current = true;
    const target = source === 'left' ? rightPanelRef : leftPanelRef;
    if (target.current) {
      target.current.scrollTop = scrollTop;
    }
    requestAnimationFrame(() => { syncing.current = false; });
  }, []);

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Input area */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-serif text-text-secondary mb-1">Original</label>
          <JsonInput
            value={leftInput}
            onChange={setLeftInput}
            error={leftError}
            placeholder="Paste original JSON..."
          />
        </div>
        <div>
          <label className="block text-xs font-serif text-text-secondary mb-1">Modified</label>
          <JsonInput
            value={rightInput}
            onChange={setRightInput}
            error={rightError}
            placeholder="Paste modified JSON..."
          />
        </div>
      </div>

      {/* Diff output */}
      {result && (
        <>
          <DiffSummary summary={result.summary} />
          <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
            <DiffPanel
              lines={result.left}
              label="Original"
              syncRef={leftPanelRef}
              onScroll={(st) => syncScroll('left', st)}
            />
            <DiffPanel
              lines={result.right}
              label="Modified"
              syncRef={rightPanelRef}
              onScroll={(st) => syncScroll('right', st)}
            />
          </div>
        </>
      )}

      {!result && leftInput && rightInput && !leftError && !rightError && (
        <div className="text-center text-text-muted text-sm font-mono py-8">
          Processing diff...
        </div>
      )}

      {(!leftInput || !rightInput) && (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-text-muted text-sm font-serif">
            Paste JSON in both panels to compare
          </span>
        </div>
      )}
    </div>
  );
};

export default CompareView;
