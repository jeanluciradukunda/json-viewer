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
 * Similarity ratio between two strings (0 to 1).
 * Uses LCS length / max length — fast enough for line-level comparisons.
 */
function lineSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  const n = a.length;
  const m = b.length;
  if (n === 0 || m === 0) return 0;

  // LCS length via single-row DP (space-efficient)
  let prev = new Array(m + 1).fill(0);
  let curr = new Array(m + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (a[i - 1] === b[j - 1]) {
        curr[j] = prev[j - 1] + 1;
      } else {
        curr[j] = Math.max(prev[j], curr[j - 1]);
      }
    }
    [prev, curr] = [curr, prev];
    curr.fill(0);
  }
  const lcsLen = prev[m];
  return lcsLen / Math.max(n, m);
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

    // Pair deletes with inserts by similarity (best match first)
    const pairedDeletes = new Set<number>();
    const pairedInserts = new Set<number>();
    const pairs: { dIdx: number; iIdx: number }[] = [];

    if (deletes.length > 0 && inserts.length > 0) {
      // Build similarity scores for all delete-insert combinations
      const scores: { dIdx: number; iIdx: number; sim: number }[] = [];
      for (let d = 0; d < deletes.length; d++) {
        for (let ins = 0; ins < inserts.length; ins++) {
          const sim = lineSimilarity(leftLines[deletes[d]], rightLines[inserts[ins]]);
          // Only consider pairing if lines are at least 40% similar
          if (sim >= 0.4) {
            scores.push({ dIdx: d, iIdx: ins, sim });
          }
        }
      }

      // Greedy: pick best similarity pairs first
      scores.sort((a, b) => b.sim - a.sim);
      for (const s of scores) {
        if (pairedDeletes.has(s.dIdx) || pairedInserts.has(s.iIdx)) continue;
        pairedDeletes.add(s.dIdx);
        pairedInserts.add(s.iIdx);
        pairs.push({ dIdx: s.dIdx, iIdx: s.iIdx });
      }
    }

    // Emit paired lines as modifications with char-level diff
    // Sort pairs by delete index to keep output order stable
    pairs.sort((a, b) => a.dIdx - b.dIdx);

    // Emit unpaired deletes, paired modifications, and unpaired inserts
    for (let d = 0; d < deletes.length; d++) {
      if (pairedDeletes.has(d)) {
        const pair = pairs.find(p => p.dIdx === d)!;
        const { oldSegs, newSegs } = computeCharDiff(leftLines[deletes[d]], rightLines[inserts[pair.iIdx]]);
        leftDiffLines.push({
          type: 'modified',
          content: leftLines[deletes[d]],
          segments: oldSegs,
          lineNumber: deletes[d] + 1,
        });
        rightDiffLines.push({
          type: 'modified',
          content: rightLines[inserts[pair.iIdx]],
          segments: newSegs,
          lineNumber: inserts[pair.iIdx] + 1,
        });
        summary.modified++;
      } else {
        leftDiffLines.push({
          type: 'removed',
          content: leftLines[deletes[d]],
          segments: [{ text: leftLines[deletes[d]], highlight: true }],
          lineNumber: deletes[d] + 1,
        });
        summary.removed++;
      }
    }

    // Unpaired inserts
    for (let ins = 0; ins < inserts.length; ins++) {
      if (pairedInserts.has(ins)) continue;
      rightDiffLines.push({
        type: 'added',
        content: rightLines[inserts[ins]],
        segments: [{ text: rightLines[inserts[ins]], highlight: true }],
        lineNumber: inserts[ins] + 1,
      });
      summary.added++;
    }
  }

  return { left: leftDiffLines, right: rightDiffLines, summary };
}
