# JSON Viewer

A Chrome extension for viewing, beautifying, comparing, and navigating JSON with a warm Claude AI-inspired aesthetic.

## Features

- **Beautify** — Paste JSON and get syntax-highlighted, formatted output
- **Tree View** — Collapsible tree navigation with JSONPath copy
- **Compare** — Side-by-side JSON diff with color-coded changes
- **Search** — Find keys and values with highlighted matches
- **Export** — Download as JSON, CSV, YAML, or copy to clipboard
- **Auto-detect** — Automatically renders JSON pages with the viewer

## Getting Started

```bash
git clone <repo-url>
cd json-viewer
npm install
npm run build
```

Then load in Chrome:
1. Open `chrome://extensions`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `dist` folder

## Development

For development with hot reload:

```bash
npm run dev
```

This starts Vite in watch mode and outputs to `dist/`. Load the `dist` folder as an unpacked extension (same steps above). Changes to source files will automatically rebuild — just refresh the extension in Chrome.

## Tech Stack

- TypeScript (strict mode)
- React 19
- Tailwind CSS with custom theme
- Vite + @crxjs/vite-plugin
- Chrome Manifest V3
