
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { sendMessage, systemPrompts } from '../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendUserMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert context messages to API format
  const formatMessagesForAPI = (userContent: string) => {
    const systemMessage = {
      role: 'system' as const,
      content: systemPrompts.supportive
    };

    const contextMessages = messages
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }));

    return [
      systemMessage,
      ...contextMessages,
      { role: 'user' as const, content: userContent }
    ];
  };

  // Send a message to the AI
  const sendUserMessage = async (content: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Add user message to state
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);

      // Format messages for API
      const apiMessages = formatMessagesForAPI(content);

      // Send to API
      const response = await sendMessage(apiMessages);

      // Add AI response to state
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear all messages
  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  const value = {
    messages,
    isLoading,
    error,
    sendUserMessage,
    clearChat
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
