import { describe, it, expect, vi, beforeEach } from "vitest";
import { create } from "zustand";

// Mock expo-secure-store
vi.mock("expo-secure-store", () => ({
  setItemAsync: vi.fn(() => Promise.resolve()),
  getItemAsync: vi.fn(() => Promise.resolve(null)),
  deleteItemAsync: vi.fn(() => Promise.resolve()),
}));

// Types for Chat Store
interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

interface ChatStore {
  // State
  messages: Message[];
  currentSessionId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  addMessage: (message: Omit<Message, "id" | "timestamp">) => string;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  appendToMessage: (id: string, token: string) => void;
  setStreaming: (id: string, isStreaming: boolean) => void;
  clearMessages: () => void;
  setCurrentSession: (sessionId: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

// Create a test store that mimics the chatStore implementation
const createTestChatStore = () => {
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
      const id = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
        messages: state.messages.map((msg) =>
          msg.id === id ? { ...msg, ...updates } : msg,
        ),
      }));
    },

    /**
     * Append a token to a message (for streaming)
     */
    appendToMessage: (id, token) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === id ? { ...msg, content: msg.content + token } : msg,
        ),
      }));
    },

    /**
     * Set streaming state for a message
     */
    setStreaming: (id, isStreaming) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === id ? { ...msg, isStreaming } : msg,
        ),
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

describe("chatStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should have empty messages array", () => {
      const store = createTestChatStore();
      expect(store.getState().messages).toEqual([]);
    });

    it("should have null as initial session ID", () => {
      const store = createTestChatStore();
      expect(store.getState().currentSessionId).toBeNull();
    });

    it("should not be loading initially", () => {
      const store = createTestChatStore();
      expect(store.getState().isLoading).toBe(false);
    });

    it("should have null error initially", () => {
      const store = createTestChatStore();
      expect(store.getState().error).toBeNull();
    });
  });

  describe("addMessage action", () => {
    it("should add a user message", () => {
      const store = createTestChatStore();
      const messageId = store.getState().addMessage({
        role: "user",
        content: "Hello, agent!",
      });

      const messages = store.getState().messages;
      expect(messages).toHaveLength(1);
      expect(messages[0].role).toBe("user");
      expect(messages[0].content).toBe("Hello, agent!");
      expect(messageId).toBeTruthy();
    });

    it("should add an agent message", () => {
      const store = createTestChatStore();
      store.getState().addMessage({
        role: "agent",
        content: "Hello! How can I help?",
      });

      const messages = store.getState().messages;
      expect(messages).toHaveLength(1);
      expect(messages[0].role).toBe("agent");
      expect(messages[0].content).toBe("Hello! How can I help?");
    });

    it("should generate unique IDs for each message", () => {
      const store = createTestChatStore();
      const id1 = store
        .getState()
        .addMessage({ role: "user", content: "Message 1" });
      const id2 = store
        .getState()
        .addMessage({ role: "user", content: "Message 2" });

      expect(id1).not.toBe(id2);
    });

    it("should set timestamp on message creation", () => {
      const store = createTestChatStore();
      const beforeTime = Date.now();
      store.getState().addMessage({ role: "user", content: "Test" });
      const afterTime = Date.now();

      const message = store.getState().messages[0];
      expect(message.timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(message.timestamp).toBeLessThanOrEqual(afterTime);
    });

    it("should preserve existing messages when adding new ones", () => {
      const store = createTestChatStore();
      store.getState().addMessage({ role: "user", content: "First" });
      store.getState().addMessage({ role: "agent", content: "Second" });
      store.getState().addMessage({ role: "user", content: "Third" });

      expect(store.getState().messages).toHaveLength(3);
    });
  });

  describe("updateMessage action", () => {
    it("should update message content", () => {
      const store = createTestChatStore();
      const id = store
        .getState()
        .addMessage({ role: "user", content: "Original" });

      store.getState().updateMessage(id, { content: "Updated content" });

      expect(store.getState().messages[0].content).toBe("Updated content");
    });

    it("should update message streaming state", () => {
      const store = createTestChatStore();
      const id = store
        .getState()
        .addMessage({ role: "agent", content: "Streaming..." });

      store.getState().updateMessage(id, { isStreaming: true });

      expect(store.getState().messages[0].isStreaming).toBe(true);
    });

    it("should only update the specified message", () => {
      const store = createTestChatStore();
      const id1 = store
        .getState()
        .addMessage({ role: "user", content: "Message 1" });
      const id2 = store
        .getState()
        .addMessage({ role: "user", content: "Message 2" });

      store.getState().updateMessage(id1, { content: "Updated only first" });

      expect(store.getState().messages[0].content).toBe("Updated only first");
      expect(store.getState().messages[1].content).toBe("Message 2");
    });
  });

  describe("appendToMessage action", () => {
    it("should append token to existing message content", () => {
      const store = createTestChatStore();
      const id = store
        .getState()
        .addMessage({ role: "agent", content: "Hello" });

      store.getState().appendToMessage(id, " World");

      expect(store.getState().messages[0].content).toBe("Hello World");
    });

    it("should handle multiple appends for streaming", () => {
      const store = createTestChatStore();
      const id = store.getState().addMessage({ role: "agent", content: "" });

      store.getState().appendToMessage(id, "T");
      store.getState().appendToMessage(id, "ok");
      store.getState().appendToMessage(id, "en");

      expect(store.getState().messages[0].content).toBe("Token");
    });

    it("should only append to the specified message", () => {
      const store = createTestChatStore();
      const id1 = store
        .getState()
        .addMessage({ role: "user", content: "First" });
      const id2 = store
        .getState()
        .addMessage({ role: "user", content: "Second" });

      store.getState().appendToMessage(id1, " appended");

      expect(store.getState().messages[0].content).toBe("First appended");
      expect(store.getState().messages[1].content).toBe("Second");
    });
  });

  describe("setStreaming action", () => {
    it("should set streaming to true", () => {
      const store = createTestChatStore();
      const id = store
        .getState()
        .addMessage({ role: "agent", content: "Thinking..." });

      store.getState().setStreaming(id, true);

      expect(store.getState().messages[0].isStreaming).toBe(true);
    });

    it("should set streaming to false", () => {
      const store = createTestChatStore();
      const id = store
        .getState()
        .addMessage({ role: "agent", content: "Done", isStreaming: true });

      store.getState().setStreaming(id, false);

      expect(store.getState().messages[0].isStreaming).toBe(false);
    });
  });

  describe("clearMessages action", () => {
    it("should remove all messages", () => {
      const store = createTestChatStore();
      store.getState().addMessage({ role: "user", content: "Message 1" });
      store.getState().addMessage({ role: "agent", content: "Message 2" });

      store.getState().clearMessages();

      expect(store.getState().messages).toEqual([]);
    });
  });

  describe("setCurrentSession action", () => {
    it("should set current session ID", () => {
      const store = createTestChatStore();
      store.getState().setCurrentSession("session_123");

      expect(store.getState().currentSessionId).toBe("session_123");
    });

    it("should allow setting session to null", () => {
      const store = createTestChatStore();
      store.getState().setCurrentSession("session_123");
      store.getState().setCurrentSession(null);

      expect(store.getState().currentSessionId).toBeNull();
    });
  });

  describe("setLoading action", () => {
    it("should set loading to true", () => {
      const store = createTestChatStore();
      store.getState().setLoading(true);

      expect(store.getState().isLoading).toBe(true);
    });

    it("should set loading to false", () => {
      const store = createTestChatStore();
      store.getState().setLoading(true);
      store.getState().setLoading(false);

      expect(store.getState().isLoading).toBe(false);
    });
  });

  describe("setError action", () => {
    it("should set error message", () => {
      const store = createTestChatStore();
      store.getState().setError("Connection failed");

      expect(store.getState().error).toBe("Connection failed");
    });

    it("should allow clearing error with null", () => {
      const store = createTestChatStore();
      store.getState().setError("Some error");
      store.getState().setError(null);

      expect(store.getState().error).toBeNull();
    });
  });

  describe("message list rendering", () => {
    it("should maintain message order", () => {
      const store = createTestChatStore();
      store.getState().addMessage({ role: "user", content: "1" });
      store.getState().addMessage({ role: "agent", content: "2" });
      store.getState().addMessage({ role: "user", content: "3" });

      const messages = store.getState().messages;
      expect(messages[0].content).toBe("1");
      expect(messages[1].content).toBe("2");
      expect(messages[2].content).toBe("3");
    });

    it("should handle messages with code blocks", () => {
      const store = createTestChatStore();
      store.getState().addMessage({
        role: "agent",
        content: 'Here is the code:\n```\nconsole.log("hello")\n```',
      });

      const message = store.getState().messages[0];
      expect(message.content).toContain("```");
      expect(message.content).toContain('console.log("hello")');
    });
  });
});
