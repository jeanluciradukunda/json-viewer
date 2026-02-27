import React from 'react';

interface SearchHighlightProps {
  text: string;
  query: string;
}

const SearchHighlight: React.FC<SearchHighlightProps> = ({ text, query }) => {
  if (!query || query.length === 0) {
    return <>{text}</>;
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let matchIndex = lowerText.indexOf(lowerQuery);
  let keyIndex = 0;

  while (matchIndex !== -1) {
    if (matchIndex > lastIndex) {
      parts.push(
        <span key={keyIndex++}>{text.slice(lastIndex, matchIndex)}</span>
      );
    }
    parts.push(
      <span
        key={keyIndex++}
        className="bg-terra-light text-terra font-bold"
      >
        {text.slice(matchIndex, matchIndex + query.length)}
      </span>
    );
    lastIndex = matchIndex + query.length;
    matchIndex = lowerText.indexOf(lowerQuery, lastIndex);
  }

  if (lastIndex < text.length) {
    parts.push(
      <span key={keyIndex++}>{text.slice(lastIndex)}</span>
    );
  }

  return <>{parts}</>;
};

export default SearchHighlight;
