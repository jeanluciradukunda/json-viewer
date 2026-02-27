export type DiffType = 'added' | 'removed' | 'modified' | 'unchanged';

export interface DiffLine {
  type: DiffType;
  content: string;
  lineNumber?: number;
}

export interface DiffResult {
  left: DiffLine[];
  right: DiffLine[];
  summary: DiffSummary;
}

export interface DiffSummary {
  added: number;
  removed: number;
  modified: number;
  unchanged?: number;
}
