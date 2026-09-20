// ============================================================
// AgriGuard AI — Chat Service
// TODO: Replace with API Gateway + Lambda + Amazon Bedrock
// ============================================================

import { getMockAIResponse } from '../data/mockResponses';
import type { ChatMessage } from '../types';
import { generateId } from '../utils/formatters';

export const chatService = {
  // TODO: Replace with Bedrock invoke model API call
  async sendMessage(content: string): Promise<ChatMessage> {
    const response = await getMockAIResponse(content);
    return {
      id: `msg-${generateId()}`,
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
    };
  },
};
