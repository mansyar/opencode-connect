import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../stores/authStore";
import { useChatStore, Message } from "../../stores/chatStore";
import { MessageList } from "../../components/chat/MessageList";
import { ChatInput } from "../../components/chat/ChatInput";

/**
 * ChatScreen
 * 
 * Main chat screen that displays messages and handles
 * real-time streaming communication with the OpenCode agent.
 */
export default function ChatScreen() {
  const router = useRouter();
  const { isAuthenticated, serverUrl } = useAuthStore();
  const { 
    messages, 
    currentSessionId, 
    isLoading,
    addMessage, 
    appendToMessage, 
    setStreaming,
    setLoading,
    setError,
    setCurrentSession,
  } = useChatStore();

  const streamingMessageIdRef = useRef<string | null>(null);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth");
    }
  }, [isAuthenticated, router]);

  // Check if there's a streaming message
  const hasStreamingMessage = messages.some((msg) => msg.isStreaming);

  /**
   * Handle sending a new message
   */
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !isAuthenticated) return;

    // Add user message
    addMessage({
      role: "user",
      content: text,
    });

    // Create agent message placeholder for streaming response
    const agentMessageId = addMessage({
      role: "agent",
      content: "",
      isStreaming: true,
    });
    streamingMessageIdRef.current = agentMessageId;
    setStreaming(agentMessageId, true);
    setLoading(true);

    // Simulate streaming response (in real implementation, this would connect to OpenCode SDK)
    try {
      await simulateStreamingResponse(agentMessageId, text);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to get response");
      if (streamingMessageIdRef.current) {
        setStreaming(streamingMessageIdRef.current, false);
      }
    } finally {
      setLoading(false);
      streamingMessageIdRef.current = null;
    }
  };

  /**
   * Simulate streaming response from the agent
   * 
   * NOTE: This is a placeholder for actual OpenCode SDK integration.
   * In production, this would use the SDK's streaming capabilities.
   */
  const simulateStreamingResponse = async (
    messageId: string,
    userMessage: string
  ): Promise<void> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simulate streaming tokens
    const responseText = generateResponse(userMessage);
    const tokens = responseText.split("");

    for (const token of tokens) {
      appendToMessage(messageId, token);
      // Small delay between tokens to simulate real streaming
      await new Promise((resolve) => setTimeout(resolve, 20));
    }

    // Mark as complete
    setStreaming(messageId, false);
  };

  /**
   * Generate a mock response based on user message
   * 
   * NOTE: This is placeholder logic for testing without a real OpenCode server.
   */
  const generateResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();

    if (lower.includes("hello") || lower.includes("hi")) {
      return "Hello! I am your OpenCode coding assistant. How can I help you today?";
    }

    if (lower.includes("help")) {
      return "I can help you with:\n- Writing and reviewing code\n- Explaining concepts\n- Debugging issues\n- Refactoring code\n\nWhat would you like to work on?";
    }

    if (lower.includes("bye") || lower.includes("goodbye")) {
      return "Goodbye! Feel free to return when you need help with your code.";
    }

    return `I received your message: "${userMessage}". In a real implementation, this would connect to the OpenCode agent for a proper response. The agent can help with coding tasks, debugging, and more.`;
  };

  /**
   * Get session name for header
   */
  const getSessionName = (): string => {
    if (!currentSessionId) return "New Chat";
    return `Session ${currentSessionId.slice(0, 8)}`;
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#06B6D4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{getSessionName()}</Text>
        {serverUrl && (
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {serverUrl}
          </Text>
        )}
      </View>

      {/* Message List */}
      <View style={styles.messageContainer}>
        <MessageList messages={messages} />
      </View>

      {/* Chat Input */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={isLoading}
        isStreaming={hasStreamingMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F172A",
  },
  header: {
    backgroundColor: "#1E293B",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#F8FAFC",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  messageContainer: {
    flex: 1,
  },
});
