export interface SearchMatch {
  path: string;
  key?: string;
  value?: unknown;
  type: 'key' | 'value' | 'both';
}

export interface SearchState {
  query?: string;
  matches: SearchMatch[];
  currentIndex: number;
  matchPaths?: Set<string>;
  isSearching?: boolean;
  next: () => void;
  prev: () => void;
}
