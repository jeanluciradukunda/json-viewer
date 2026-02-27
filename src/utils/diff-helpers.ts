import type { JsonValue } from '@/types/json';
import type { DiffLine, DiffResult, DiffSummary } from '@/types/diff';

function sortKeys(value: JsonValue): JsonValue {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(sortKeys);
  return Object.keys(value)
    .sort()
    .reduce<Record<string, JsonValue>>((acc, key) => {
      acc[key] = sortKeys(value[key]);
      return acc;
    }, {});
}

/**
 * LCS-based line diff.
 */
function computeLineDiff(
  a: string[],
  b: string[],
): { type: 'equal' | 'insert' | 'delete'; aIdx: number; bIdx: number }[] {
  const n = a.length;
  const m = b.length;

  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      if (a[i] === b[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const ops: { type: 'equal' | 'insert' | 'delete'; aIdx: number; bIdx: number }[] = [];
  let i = 0;
  let j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && a[i] === b[j]) {
      ops.push({ type: 'equal', aIdx: i, bIdx: j });
      i++;
      j++;
    } else if (j < m && (i >= n || dp[i][j + 1] >= dp[i + 1][j])) {
      ops.push({ type: 'insert', aIdx: i, bIdx: j });
      j++;
    } else {
      ops.push({ type: 'delete', aIdx: i, bIdx: j });
      i++;
    }
  }
  return ops;
}

export function computeDiff(left: JsonValue, right: JsonValue): DiffResult {
  const sortedLeft = sortKeys(left);
  const sortedRight = sortKeys(right);

  const leftFormatted = JSON.stringify(sortedLeft, null, 2);
  const rightFormatted = JSON.stringify(sortedRight, null, 2);

  const summary: DiffSummary = {
    added: 0,
    removed: 0,
    modified: 0,
    unchanged: 0,
  };

  const leftLines = leftFormatted.split('\n');
  const rightLines = rightFormatted.split('\n');

  // Identical
  if (leftFormatted === rightFormatted) {
    const unchangedLines: DiffLine[] = leftLines.map((content, idx) => ({
      type: 'unchanged' as const,
      content,
      lineNumber: idx + 1,
    }));
    summary.unchanged = leftLines.length;
    return { left: unchangedLines, right: [...unchangedLines], summary };
  }

  const leftDiffLines: DiffLine[] = [];
  const rightDiffLines: DiffLine[] = [];

  const ops = computeLineDiff(leftLines, rightLines);

  for (const op of ops) {
    if (op.type === 'equal') {
      leftDiffLines.push({ type: 'unchanged', content: leftLines[op.aIdx], lineNumber: op.aIdx + 1 });
      rightDiffLines.push({ type: 'unchanged', content: rightLines[op.bIdx], lineNumber: op.bIdx + 1 });
      summary.unchanged = (summary.unchanged ?? 0) + 1;
    } else if (op.type === 'delete') {
      leftDiffLines.push({ type: 'removed', content: leftLines[op.aIdx], lineNumber: op.aIdx + 1 });
      summary.removed++;
    } else {
      rightDiffLines.push({ type: 'added', content: rightLines[op.bIdx], lineNumber: op.bIdx + 1 });
      summary.added++;
    }
  }

  return { left: leftDiffLines, right: rightDiffLines, summary };
}
