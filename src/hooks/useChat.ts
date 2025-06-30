import { useState, useCallback } from 'react';
import { ChatMessage, ChatState } from '../types/chat';
import { sendChatMessage } from '../services/openai';

export const useChat = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const messagesToSend = [...chatState.messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await sendChatMessage(messagesToSend);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  }, [chatState.messages]);

  const clearChat = useCallback(() => {
    setChatState({
      messages: [],
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    messages: chatState.messages,
    isLoading: chatState.isLoading,
    error: chatState.error,
    sendMessage,
    clearChat,
  };
};