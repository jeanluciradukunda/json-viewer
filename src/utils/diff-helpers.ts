import type { JsonValue } from '@/types/json';
import type { DiffLine, DiffSegment, DiffResult, DiffSummary } from '@/types/diff';

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

/**
 * Character-level LCS to produce highlight segments.
 * Returns segments where `highlight: true` marks the changed parts.
 */
function computeCharDiff(oldStr: string, newStr: string): { oldSegs: DiffSegment[]; newSegs: DiffSegment[] } {
  const a = oldStr;
  const b = newStr;
  const n = a.length;
  const m = b.length;

  // LCS on characters
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

  // Walk to get char-level ops
  const ops: { type: 'equal' | 'delete' | 'insert'; aChar?: string; bChar?: string }[] = [];
  let i = 0;
  let j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && a[i] === b[j]) {
      ops.push({ type: 'equal', aChar: a[i], bChar: b[j] });
      i++;
      j++;
    } else if (j < m && (i >= n || dp[i][j + 1] >= dp[i + 1][j])) {
      ops.push({ type: 'insert', bChar: b[j] });
      j++;
    } else {
      ops.push({ type: 'delete', aChar: a[i] });
      i++;
    }
  }

  // Build segments for old side (equal + delete)
  const oldSegs: DiffSegment[] = [];
  let buf = '';
  let isHl = false;
  for (const op of ops) {
    if (op.type === 'equal') {
      if (isHl && buf) { oldSegs.push({ text: buf, highlight: true }); buf = ''; }
      isHl = false;
      buf += op.aChar;
    } else if (op.type === 'delete') {
      if (!isHl && buf) { oldSegs.push({ text: buf, highlight: false }); buf = ''; }
      isHl = true;
      buf += op.aChar;
    }
  }
  if (buf) oldSegs.push({ text: buf, highlight: isHl });

  // Build segments for new side (equal + insert)
  const newSegs: DiffSegment[] = [];
  buf = '';
  isHl = false;
  for (const op of ops) {
    if (op.type === 'equal') {
      if (isHl && buf) { newSegs.push({ text: buf, highlight: true }); buf = ''; }
      isHl = false;
      buf += op.bChar;
    } else if (op.type === 'insert') {
      if (!isHl && buf) { newSegs.push({ text: buf, highlight: false }); buf = ''; }
      isHl = true;
      buf += op.bChar;
    }
  }
  if (buf) newSegs.push({ text: buf, highlight: isHl });

  return { oldSegs, newSegs };
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

  const ops = computeLineDiff(leftLines, rightLines);

  const leftDiffLines: DiffLine[] = [];
  const rightDiffLines: DiffLine[] = [];

  // Process ops: collect consecutive non-equal ops into batches,
  // then pair deletes with inserts for character-level diffing.
  let oi = 0;
  while (oi < ops.length) {
    if (ops[oi].type === 'equal') {
      leftDiffLines.push({ type: 'unchanged', content: leftLines[ops[oi].aIdx], lineNumber: ops[oi].aIdx + 1 });
      rightDiffLines.push({ type: 'unchanged', content: rightLines[ops[oi].bIdx], lineNumber: ops[oi].bIdx + 1 });
      summary.unchanged = (summary.unchanged ?? 0) + 1;
      oi++;
      continue;
    }

    // Collect a batch of consecutive deletes and inserts
    const deletes: number[] = [];
    const inserts: number[] = [];
    while (oi < ops.length && ops[oi].type !== 'equal') {
      if (ops[oi].type === 'delete') deletes.push(ops[oi].aIdx);
      else inserts.push(ops[oi].bIdx);
      oi++;
    }

    // Pair up deletes and inserts as modifications (char-level diff)
    const paired = Math.min(deletes.length, inserts.length);
    for (let p = 0; p < paired; p++) {
      const { oldSegs, newSegs } = computeCharDiff(leftLines[deletes[p]], rightLines[inserts[p]]);
      leftDiffLines.push({
        type: 'modified',
        content: leftLines[deletes[p]],
        segments: oldSegs,
        lineNumber: deletes[p] + 1,
      });
      rightDiffLines.push({
        type: 'modified',
        content: rightLines[inserts[p]],
        segments: newSegs,
        lineNumber: inserts[p] + 1,
      });
      summary.modified++;
    }

    // Remaining unpaired deletes
    for (let p = paired; p < deletes.length; p++) {
      leftDiffLines.push({
        type: 'removed',
        content: leftLines[deletes[p]],
        segments: [{ text: leftLines[deletes[p]], highlight: true }],
        lineNumber: deletes[p] + 1,
      });
      summary.removed++;
    }

    // Remaining unpaired inserts
    for (let p = paired; p < inserts.length; p++) {
      rightDiffLines.push({
        type: 'added',
        content: rightLines[inserts[p]],
        segments: [{ text: rightLines[inserts[p]], highlight: true }],
        lineNumber: inserts[p] + 1,
      });
      summary.added++;
    }
  }

  return { left: leftDiffLines, right: rightDiffLines, summary };
}
