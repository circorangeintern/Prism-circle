import type { TokenMessage, TopicMessage, MulticastMessage } from 'firebase-admin/messaging';
import { getMessenger } from '../messaging.js';

export class SendFirebaseNotificationCommand {
  async execute(payload: {
    token?: string;
    topic?: string;
    title: string;
    body: string;
    data?: Record<string, string>;
  }): Promise<string | null> {
    try {
      const messenger = getMessenger();
      const notification = { title: payload.title, body: payload.body };

      let response: string;

      if (payload.token) {
        const message: TokenMessage = {
          token: payload.token,
          notification,
          ...(payload.data ? { data: payload.data } : {}),
        };
        response = await messenger.send(message);
      } else if (payload.topic) {
        const message: TopicMessage = {
          topic: payload.topic,
          notification,
          ...(payload.data ? { data: payload.data } : {}),
        };
        response = await messenger.send(message);
      } else {
        throw new Error('Either token or topic is required.');
      }

      return response;
    } catch (error) {
      console.error('Firebase send notification failed:', error);
      return null;
    }
  }

  async sendMulticast(payload: {
    tokens: string[];
    title: string;
    body: string;
    data?: Record<string, string>;
  }): Promise<{ successCount: number; failureCount: number }> {
    try {
      const messenger = getMessenger();

      const message: MulticastMessage = {
        tokens: payload.tokens,
        notification: { title: payload.title, body: payload.body },
        ...(payload.data ? { data: payload.data } : {}),
      };

      const response = await messenger.sendEachForMulticast(message);
      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
      };
    } catch (error) {
      console.error('Firebase multicast failed:', error);
      return { successCount: 0, failureCount: payload.tokens.length };
    }
  }
}
