export function buildJsonPath(segments: (string | number)[]): string {
  let path = '$';
  for (const segment of segments) {
    if (typeof segment === 'number') {
      path += `[${segment}]`;
    } else if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(segment)) {
      path += `.${segment}`;
    } else {
      path += `["${segment.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"]`;
    }
  }
  return path;
}

export function pathToSegments(path: string): (string | number)[] {
  const segments: (string | number)[] = [];

  if (!path.startsWith('$')) {
    return segments;
  }

  let i = 1;
  while (i < path.length) {
    if (path[i] === '.') {
      i++;
      let key = '';
      while (i < path.length && path[i] !== '.' && path[i] !== '[') {
        key += path[i];
        i++;
      }
      if (key.length > 0) {
        segments.push(key);
      }
    } else if (path[i] === '[') {
      i++;
      if (path[i] === '"') {
        i++;
        let key = '';
        while (i < path.length && path[i] !== '"') {
          if (path[i] === '\\' && i + 1 < path.length) {
            i++;
            key += path[i];
          } else {
            key += path[i];
          }
          i++;
        }
        i++; // skip closing "
        i++; // skip closing ]
        segments.push(key);
      } else {
        let numStr = '';
        while (i < path.length && path[i] !== ']') {
          numStr += path[i];
          i++;
        }
        i++; // skip closing ]
        const num = parseInt(numStr, 10);
        if (!isNaN(num)) {
          segments.push(num);
        } else {
          segments.push(numStr);
        }
      }
    } else {
      i++;
    }
  }

  return segments;
}
