import type { JsonValue, ParseResult, JsonStats } from '@/types/json';

function countNodes(value: JsonValue): number {
  if (value === null || typeof value !== 'object') {
    return 1;
  }

  if (Array.isArray(value)) {
    let count = 1;
    for (const item of value) {
      count += countNodes(item);
    }
    return count;
  }

  let count = 1;
  for (const key of Object.keys(value)) {
    count += 1 + countNodes(value[key]);
  }
  return count;
}

function computeMaxDepth(value: JsonValue, currentDepth: number = 0): number {
  if (value === null || typeof value !== 'object') {
    return currentDepth;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return currentDepth;
    }
    let max = currentDepth;
    for (const item of value) {
      const d = computeMaxDepth(item, currentDepth + 1);
      if (d > max) max = d;
    }
    return max;
  }

  const keys = Object.keys(value);
  if (keys.length === 0) {
    return currentDepth;
  }
  let max = currentDepth;
  for (const key of keys) {
    const d = computeMaxDepth(value[key], currentDepth + 1);
    if (d > max) max = d;
  }
  return max;
}

function computeStats(data: JsonValue, rawInput: string): JsonStats {
  return {
    nodeCount: countNodes(data),
    byteSize: new TextEncoder().encode(rawInput).length,
    depth: computeMaxDepth(data),
  };
}

function getLineAndColumn(input: string, position: number): { line: number; column: number } {
  let line = 1;
  let column = 1;
  for (let i = 0; i < position && i < input.length; i++) {
    if (input[i] === '\n') {
      line++;
      column = 1;
    } else {
      column++;
    }
  }
  return { line, column };
}

function extractPositionFromError(message: string): number | null {
  const posMatch = message.match(/position\s+(\d+)/i);
  if (posMatch) {
    return parseInt(posMatch[1], 10);
  }
  const colMatch = message.match(/column\s+(\d+)/i);
  if (colMatch) {
    return parseInt(colMatch[1], 10);
  }
  return null;
}

function tryRecoverTrailingCommas(input: string): string {
  return input.replace(/,\s*([\]}])/g, '$1');
}

export function safeJsonParse(input: string): ParseResult {
  if (!input || input.trim().length === 0) {
    return {
      success: false,
      error: {
        message: 'Input is empty',
        line: 1,
        column: 1,
      },
    };
  }

  const trimmed = input.trim();

  // First attempt: standard JSON.parse
  try {
    const data = JSON.parse(trimmed) as JsonValue;
    return {
      success: true,
      data,
      stats: computeStats(data, trimmed),
    };
  } catch (firstError) {
    // Second attempt: try recovering trailing commas (JSON5-like)
    try {
      const recovered = tryRecoverTrailingCommas(trimmed);
      const data = JSON.parse(recovered) as JsonValue;
      return {
        success: true,
        data,
        stats: computeStats(data, trimmed),
      };
    } catch {
      // Recovery failed, report the original error
      const errorMessage =
        firstError instanceof Error ? firstError.message : 'Unknown parse error';
      const position = extractPositionFromError(errorMessage);
      const { line, column } =
        position !== null
          ? getLineAndColumn(trimmed, position)
          : { line: 1, column: 1 };

      return {
        success: false,
        error: {
          message: errorMessage,
          line,
          column,
        },
      };
    }
  }
}
