export type DiffType = 'added' | 'removed' | 'modified' | 'unchanged';

export interface DiffSegment {
  text: string;
  highlight: boolean;
}

export interface DiffLine {
  type: DiffType;
  content: string;
  segments?: DiffSegment[];
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
