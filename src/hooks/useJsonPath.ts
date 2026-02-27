import { useState, useCallback, useRef } from 'react';

interface UseJsonPathResult {
  copyPath: (path: string) => void;
  copiedPath: string | null;
}

export function useJsonPath(): UseJsonPathResult {
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyPath = useCallback((path: string): void => {
    navigator.clipboard.writeText(path).then(() => {
      setCopiedPath(path);

      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setCopiedPath(null);
        timeoutRef.current = null;
      }, 2000);
    }).catch(() => {
      // Clipboard write failed silently
    });
  }, []);

  return { copyPath, copiedPath };
}
