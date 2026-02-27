import type { ChromeMessage } from '@/types/messages';

export function sendMessage<T>(message: ChromeMessage<T>): Promise<unknown> {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

export function onMessage(
  handler: (
    message: ChromeMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void
  ) => void
): void {
  chrome.runtime.onMessage.addListener(handler);
}
