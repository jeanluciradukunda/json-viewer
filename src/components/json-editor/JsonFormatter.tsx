import { useMemo } from 'react';
import type { JsonValue } from '@/types/json';
import { formatJson } from '@/utils/json-formatter';
import CopyButton from '@/components/ui/CopyButton';

type TokenType = 'key' | 'string' | 'number' | 'boolean' | 'null' | 'bracket' | 'punctuation' | 'whitespace';

interface Token {
  type: TokenType;
  value: string;
}

const tokenClassMap: Record<TokenType, string> = {
  key: 'text-syn-key font-bold',
  string: 'text-syn-string',
  number: 'text-syn-number',
  boolean: 'text-syn-boolean',
  null: 'text-syn-null italic',
  bracket: 'text-syn-bracket',
  punctuation: 'text-syn-punctuation',
  whitespace: '',
};

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < line.length) {
    // Whitespace
    if (line[i] === ' ' || line[i] === '\t') {
      let start = i;
      while (i < line.length && (line[i] === ' ' || line[i] === '\t')) i++;
      tokens.push({ type: 'whitespace', value: line.slice(start, i) });
      continue;
    }

    // Brackets
    if ('{[}]'.includes(line[i])) {
      tokens.push({ type: 'bracket', value: line[i] });
      i++;
      continue;
    }

    // Punctuation (colon, comma)
    if (line[i] === ':' || line[i] === ',') {
      tokens.push({ type: 'punctuation', value: line[i] });
      i++;
      continue;
    }

    // String (key or value)
    if (line[i] === '"') {
      let start = i;
      i++; // skip opening quote
      while (i < line.length && line[i] !== '"') {
        if (line[i] === '\\') i++; // skip escaped char
        i++;
      }
      i++; // skip closing quote
      const str = line.slice(start, i);

      // Look ahead to determine if this is a key (followed by optional whitespace and colon)
      let lookahead = i;
      while (lookahead < line.length && (line[lookahead] === ' ' || line[lookahead] === '\t')) lookahead++;
      const isKey = lookahead < line.length && line[lookahead] === ':';

      tokens.push({ type: isKey ? 'key' : 'string', value: str });
      continue;
    }

    // Numbers
    if (line[i] === '-' || (line[i] >= '0' && line[i] <= '9')) {
      let start = i;
      if (line[i] === '-') i++;
      while (i < line.length && ((line[i] >= '0' && line[i] <= '9') || line[i] === '.' || line[i] === 'e' || line[i] === 'E' || line[i] === '+' || line[i] === '-')) {
        if ((line[i] === '+' || line[i] === '-') && line[i - 1] !== 'e' && line[i - 1] !== 'E') break;
        i++;
      }
      tokens.push({ type: 'number', value: line.slice(start, i) });
      continue;
    }

    // Boolean: true
    if (line.slice(i, i + 4) === 'true') {
      tokens.push({ type: 'boolean', value: 'true' });
      i += 4;
      continue;
    }

    // Boolean: false
    if (line.slice(i, i + 5) === 'false') {
      tokens.push({ type: 'boolean', value: 'false' });
      i += 5;
      continue;
    }

    // Null
    if (line.slice(i, i + 4) === 'null') {
      tokens.push({ type: 'null', value: 'null' });
      i += 4;
      continue;
    }

    // Fallback: single character
    tokens.push({ type: 'punctuation', value: line[i] });
    i++;
  }

  return tokens;
}

interface JsonFormatterProps {
  data: JsonValue;
}

const JsonFormatter = ({ data }: JsonFormatterProps) => {
  const formatted = useMemo(() => formatJson(data), [data]);
  const lines = useMemo(() => formatted.split('\n'), [formatted]);

  const lineNumberWidth = String(lines.length).length;

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10">
        <CopyButton text={formatted} label="Copy" />
      </div>
      <pre className="font-mono text-sm bg-bg-input border border-border rounded-card p-3 pr-20 overflow-auto">
        <code>
        {lines.map((line, index) => (
          <div key={index} className="flex">
            <span
              className="text-text-muted select-none text-right pr-3 shrink-0"
              style={{ minWidth: `${lineNumberWidth + 1}ch` }}
            >
              {index + 1}
            </span>
            <span className="flex-1">
              {tokenizeLine(line).map((token, tokenIdx) => (
                <span key={tokenIdx} className={tokenClassMap[token.type]}>
                  {token.value}
                </span>
              ))}
            </span>
          </div>
        ))}
      </code>
    </pre>
    </div>
  );
};

export default JsonFormatter;
