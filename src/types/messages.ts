export type MessageType = 'JSON_DETECTED' | 'GET_JSON' | 'SET_BADGE';

export interface ChromeMessage<T = unknown> {
  type: MessageType;
  payload?: T;
}

export interface JsonDetectedPayload {
  url: string;
  size: number;
}
