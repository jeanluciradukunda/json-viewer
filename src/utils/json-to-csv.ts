import type { JsonValue, JsonObject } from '@/types/json';
import { Parser } from '@json2csv/plainjs';

function isObjectArray(data: JsonValue): data is JsonObject[] {
  if (!Array.isArray(data)) return false;
  if (data.length === 0) return false;
  return data.every(
    (item) => item !== null && typeof item === 'object' && !Array.isArray(item)
  );
}

function isPlainObject(data: JsonValue): data is JsonObject {
  return data !== null && typeof data === 'object' && !Array.isArray(data);
}

export function jsonToCsv(data: JsonValue): string {
  let rows: JsonObject[];

  if (isObjectArray(data)) {
    rows = data;
  } else if (isPlainObject(data)) {
    rows = [data];
  } else {
    throw new Error(
      'Cannot convert to CSV: data must be an object or an array of objects'
    );
  }

  const parser = new Parser();
  return parser.parse(rows);
}
