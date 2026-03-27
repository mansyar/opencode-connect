import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

/**
 * Message Interface
 *
 * Represents a single message in the chat conversation.
 */
export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

/**
 * Chat Store Interface
 *
 * Manages chat state including messages, streaming, and session management.
 */
export interface ChatStore {
  // State
  messages: Message[];
  currentSessionId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => string;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  appendToMessage: (id: string, token: string) => void;
  setStreaming: (id: string, isStreaming: boolean) => void;
  clearMessages: () => void;
  setCurrentSession: (sessionId: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

// Storage keys
const STORAGE_KEYS = {
  MESSAGES: 'opencode_chat_messages',
} as const;

/**
 * Generate a unique message ID
 */
const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Creates the chat store
 *
 * Manages chat messages, streaming state, and session context.
 */
export const createChatStore = () => {
  return create<ChatStore>()((set, get) => ({
    // Initial state
    messages: [],
    currentSessionId: null,
    isLoading: false,
    error: null,

    /**
     * Add a new message to the store
     * Returns the ID of the newly created message
     */
    addMessage: (message) => {
      const id = generateMessageId();
      const newMessage: Message = {
        ...message,
        id,
        timestamp: Date.now(),
      };
      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
      return id;
    },

    /**
     * Update an existing message with new content
     */
    updateMessage: (id, updates) => {
      set((state) => ({
        messages: state.messages.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg)),
      }));
    },

    /**
     * Append a token to a message (for streaming responses)
     */
    appendToMessage: (id, token) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === id ? { ...msg, content: msg.content + token } : msg
        ),
      }));
    },

    /**
     * Set streaming state for a message
     */
    setStreaming: (id, isStreaming) => {
      set((state) => ({
        messages: state.messages.map((msg) => (msg.id === id ? { ...msg, isStreaming } : msg)),
      }));
    },

    /**
     * Clear all messages
     */
    clearMessages: () => {
      set({ messages: [] });
    },

    /**
     * Set the current session ID
     */
    setCurrentSession: (sessionId) => {
      set({ currentSessionId: sessionId });
    },

    /**
     * Set loading state
     */
    setLoading: (isLoading) => {
      set({ isLoading });
    },

    /**
     * Set error state
     */
    setError: (error) => {
      set({ error });
    },
  }));
};

// Singleton store instance
export const chatStore = createChatStore();

/**
 * Hook to use chat store in React components
 */
export const useChatStore = chatStore;
