import React from 'react';
import ReactDOM from 'react-dom/client';
import Viewer from '@/viewer/Viewer';

export function injectViewer() {
  const jsonText = document.body.textContent || '';

  // Hide original content
  document.body.style.display = 'none';

  // Create shadow DOM host
  const host = document.createElement('div');
  host.id = 'json-viewer-root';
  document.documentElement.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });

  // Inject styles into shadow DOM
  const style = document.createElement('style');
  style.textContent = `
    :host {
      all: initial;
      display: block;
      width: 100vw;
      height: 100vh;
      font-family: Georgia, 'Times New Roman', ui-serif, serif;
      color: #2D2B28;
      background-color: #F4F3EE;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
  `;
  shadow.appendChild(style);

  const container = document.createElement('div');
  container.style.width = '100%';
  container.style.height = '100%';
  shadow.appendChild(container);

  ReactDOM.createRoot(container).render(
    React.createElement(Viewer, { initialJson: jsonText }),
  );
}
