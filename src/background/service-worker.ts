import type { ChromeMessage, JsonDetectedPayload } from '@/types/messages';

chrome.runtime.onMessage.addListener(
  (message: ChromeMessage, sender: chrome.runtime.MessageSender, sendResponse) => {
    if (message.type === 'JSON_DETECTED') {
      const payload = message.payload as JsonDetectedPayload;
      const tabId = sender.tab?.id;
      if (tabId !== undefined) {
        chrome.action.setBadgeText({ text: '{ }', tabId });
        chrome.action.setBadgeBackgroundColor({ color: '#C15F3C', tabId });
      }
      sendResponse({ received: true, url: payload.url });
    }
    return true;
  },
);

chrome.action.setBadgeBackgroundColor({ color: '#C15F3C' });
