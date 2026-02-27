import React, { useState, useEffect } from 'react';
import { useTreeContext } from '@/components/json-tree/TreeContext';

interface TreeKeyProps {
  name: string | number;
  path: string;
}

const TreeKey: React.FC<TreeKeyProps> = ({ name, path }) => {
  const { copyPath, copiedPath } = useTreeContext();
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    if (copiedPath === path) {
      setShowCopied(true);
      const timer = setTimeout(() => setShowCopied(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [copiedPath, path]);

  const handleClick = () => {
    copyPath(path);
  };

  return (
    <span className="relative inline-flex items-center gap-1">
      <span
        className="text-syn-key font-bold font-mono text-sm cursor-pointer hover:underline"
        onClick={handleClick}
        title={`Click to copy path: ${path}`}
      >
        {typeof name === 'string' ? `"${name}"` : name}
      </span>
      {showCopied && (
        <span className="absolute -top-5 left-0 px-1.5 py-0.5 bg-text-primary text-white text-xs rounded-btn whitespace-nowrap z-50">
          Copied!
        </span>
      )}
    </span>
  );
};

export default TreeKey;
