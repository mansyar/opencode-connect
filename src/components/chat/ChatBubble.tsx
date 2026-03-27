import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Message } from "../../stores/chatStore";

/**
 * ChatBubble Component
 *
 * Displays a single chat message with appropriate styling
 * based on the message role (user or agent).
 */
export interface ChatBubbleProps {
  message: Message;
}

const COLORS = {
  userBubble: "#1E3A5F",
  agentBubble: "#1E293B",
  userText: "#F8FAFC",
  agentText: "#F8FAFC",
  streaming: "#06B6D4",
  timestamp: "#94A3B8",
} as const;

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const { role, content, isStreaming, timestamp } = message;
  const isUser = role === "user";

  const bubbleStyle = [
    styles.bubble,
    isUser ? styles.userBubble : styles.agentBubble,
  ];

  const textStyle = [styles.text, isUser ? styles.userText : styles.agentText];

  return (
    <View style={bubbleStyle} testID={`bubble-${role}`}>
      <Text style={textStyle} testID={`content-${role}`}>
        {content}
      </Text>
      {isStreaming && (
        <Text style={styles.streamingIndicator} testID="streaming-indicator">
          ...
        </Text>
      )}
      <Text style={styles.timestamp} testID={`timestamp-${role}`}>
        {formatTimestamp(timestamp)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginVertical: 4,
    maxWidth: "80%",
  },
  userBubble: {
    backgroundColor: COLORS.userBubble,
    alignSelf: "flex-end",
  },
  agentBubble: {
    backgroundColor: COLORS.agentBubble,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: COLORS.userText,
  },
  agentText: {
    color: COLORS.agentText,
  },
  streamingIndicator: {
    color: COLORS.streaming,
    fontSize: 16,
  },
  timestamp: {
    fontSize: 10,
    color: COLORS.timestamp,
    marginTop: 4,
    alignSelf: "flex-end",
  },
});

export default ChatBubble;
