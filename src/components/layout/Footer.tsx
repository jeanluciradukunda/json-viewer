import React from 'react';
import type { JsonStats } from '@/types/json';

interface FooterProps {
  stats: JsonStats | null;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} bytes`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const Footer: React.FC<FooterProps> = ({ stats }) => {
  return (
    <footer className="px-3 py-1.5 border-t border-border bg-bg-secondary text-xs text-text-muted font-mono">
      {stats ? (
        <span>
          {stats.nodeCount} nodes · {formatBytes(stats.byteSize)} · Depth: {stats.depth}
        </span>
      ) : (
        <span>&nbsp;</span>
      )}
    </footer>
  );
};

export default Footer;
