import { MAX_AUTO_DETECT_SIZE } from '@/constants/limits';
import type { ChromeMessage, JsonDetectedPayload } from '@/types/messages';

function isJsonContentType(): boolean {
  const meta = document.querySelector('meta[http-equiv="Content-Type"]');
  if (meta) {
    const content = meta.getAttribute('content') || '';
    return content.includes('application/json');
  }
  return false;
}

function isJsonBody(): boolean {
  const body = document.body;
  if (!body) return false;

  // Check if body has only a single <pre> child (common for JSON responses)
  if (body.children.length === 1 && body.children[0].tagName === 'PRE') {
    const text = body.children[0].textContent || '';
    if (text.length > MAX_AUTO_DETECT_SIZE) return false;
    try {
      JSON.parse(text);
      return true;
    } catch {
      return false;
    }
  }

  // Check raw body text for simple pages
  if (body.children.length === 0 || (body.childNodes.length === 1 && body.childNodes[0].nodeType === Node.TEXT_NODE)) {
    const text = body.textContent || '';
    if (text.length > MAX_AUTO_DETECT_SIZE) return false;
    const trimmed = text.trim();
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      try {
        JSON.parse(trimmed);
        return true;
      } catch {
        return false;
      }
    }
  }

  return false;
}

function detectAndNotify() {
  if (isJsonContentType() || isJsonBody()) {
    const message: ChromeMessage<JsonDetectedPayload> = {
      type: 'JSON_DETECTED',
      payload: {
        url: window.location.href,
        size: (document.body.textContent || '').length,
      },
    };
    chrome.runtime.sendMessage(message);
    import('./injector').then((mod) => mod.injectViewer());
  }
}

detectAndNotify();
