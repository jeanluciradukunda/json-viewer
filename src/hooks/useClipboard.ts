import { useState, useCallback, useRef } from 'react';

interface UseClipboardResult {
  copy: (text: string) => Promise<void>;
  copied: boolean;
}

export function useClipboard(): UseClipboardResult {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setCopied(false);
        timeoutRef.current = null;
      }, 2000);
    } catch {
      setCopied(false);
    }
  }, []);

  return { copy, copied };
}
