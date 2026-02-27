import { useMemo } from 'react';
import { safeJsonParse } from '@/utils/json-parser';
import { computeDiff } from '@/utils/diff-helpers';
import type { ParseError } from '@/types/json';
import type { DiffResult } from '@/types/diff';

interface UseJsonDiffResult {
  result: DiffResult | null;
  leftError: ParseError | null;
  rightError: ParseError | null;
}

export function useJsonDiff(left: string, right: string): UseJsonDiffResult {
  return useMemo(() => {
    const leftResult = safeJsonParse(left);
    const rightResult = safeJsonParse(right);

    const leftError = leftResult.success ? null : (leftResult.error ?? null);
    const rightError = rightResult.success ? null : (rightResult.error ?? null);

    if (!leftResult.success || !rightResult.success) {
      return {
        result: null,
        leftError,
        rightError,
      };
    }

    const result = computeDiff(leftResult.data!, rightResult.data!);

    return {
      result,
      leftError: null,
      rightError: null,
    };
  }, [left, right]);
}
