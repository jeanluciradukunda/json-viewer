import React from 'react';

type JsonPrimitive = string | number | boolean | null;

interface TreeValueProps {
  value: JsonPrimitive;
}

const TreeValue: React.FC<TreeValueProps> = ({ value }) => {
  if (value === null) {
    return <span className="text-syn-null italic font-mono text-sm">null</span>;
  }

  if (typeof value === 'boolean') {
    return (
      <span className="text-syn-boolean font-mono text-sm">
        {value ? 'true' : 'false'}
      </span>
    );
  }

  if (typeof value === 'number') {
    return (
      <span className="text-syn-number font-mono text-sm">
        {String(value)}
      </span>
    );
  }

  // string
  return (
    <span className="text-syn-string font-mono text-sm">
      &quot;{value}&quot;
    </span>
  );
};

export default TreeValue;
