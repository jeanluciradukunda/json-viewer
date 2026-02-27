export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

export interface ParseResult {
  success: boolean;
  data?: JsonValue;
  error?: ParseError | null;
  stats?: JsonStats;
}

export interface ParseError {
  message: string;
  line?: number;
  column?: number;
}

export interface JsonStats {
  nodeCount: number;
  byteSize: number;
  depth: number;
  maxDepth?: number;
}
