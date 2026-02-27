# JSON Viewer

A Chrome extension for viewing, beautifying, comparing, and navigating JSON with a warm Claude AI-inspired aesthetic.

## Features

- **Beautify** — Paste JSON and get syntax-highlighted, formatted output
- **Tree View** — Collapsible tree navigation with JSONPath copy
- **Compare** — Side-by-side JSON diff with color-coded changes
- **Search** — Find keys and values with highlighted matches
- **Export** — Download as JSON, CSV, YAML, or copy to clipboard
- **Auto-detect** — Automatically renders JSON pages with the viewer

## Development

```bash
npm install
npm run dev
```

Load the extension in Chrome:
1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `dist` folder

## Build

```bash
npm run build
```

## Tech Stack

- TypeScript (strict mode)
- React 19
- Tailwind CSS with custom theme
- Vite + @crxjs/vite-plugin
- Chrome Manifest V3
