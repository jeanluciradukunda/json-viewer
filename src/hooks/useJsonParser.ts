import { useMemo } from 'react';
import { safeJsonParse } from '@/utils/json-parser';
import type { JsonValue, ParseError, JsonStats } from '@/types/json';

interface UseJsonParserResult {
  parsed: JsonValue | undefined;
  error: ParseError | null;
  stats: JsonStats | null;
}

export function useJsonParser(input: string): UseJsonParserResult {
  return useMemo(() => {
    if (!input || input.trim().length === 0) {
      return { parsed: undefined, error: null, stats: null };
    }

    const result = safeJsonParse(input);

    if (result.success) {
      return {
        parsed: result.data,
        error: null,
        stats: result.stats ?? null,
      };
    }

    return {
      parsed: undefined,
      error: result.error ?? null,
      stats: null,
    };
  }, [input]);
}
