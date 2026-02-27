import type { JsonValue } from '@/types/json';

export type ValueType = 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array';

export function getValueType(value: JsonValue): ValueType {
  if (value === null) {
    return 'null';
  }
  if (Array.isArray(value)) {
    return 'array';
  }
  const t = typeof value;
  if (t === 'string') return 'string';
  if (t === 'number') return 'number';
  if (t === 'boolean') return 'boolean';
  if (t === 'object') return 'object';
  return 'null';
}

const typeClassMap: Record<string, string> = {
  key: 'text-syn-key font-bold',
  string: 'text-syn-string',
  number: 'text-syn-number',
  boolean: 'text-syn-boolean',
  null: 'text-syn-null italic',
  object: 'text-syn-bracket',
  array: 'text-syn-bracket',
  bracket: 'text-syn-bracket',
  punctuation: 'text-syn-punctuation',
};

export function getTypeClass(type: string): string {
  return typeClassMap[type] ?? '';
}
