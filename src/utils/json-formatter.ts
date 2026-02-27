import type { JsonValue } from '@/types/json';
import { DEFAULT_INDENT } from '@/constants/defaults';

export function formatJson(data: JsonValue, indent: number = DEFAULT_INDENT): string {
  return JSON.stringify(data, null, indent);
}

export function minifyJson(data: JsonValue): string {
  return JSON.stringify(data);
}
