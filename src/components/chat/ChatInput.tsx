import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

/**
 * ChatInput Component
 *
 * Input component for sending chat messages with validation,
 * character count, and streaming state support.
 */
export interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isStreaming?: boolean;
}

const MAX_MESSAGE_LENGTH = 4000;

const COLORS = {
  background: "#1E293B",
  inputBackground: "#0F172A",
  text: "#F8FAFC",
  placeholder: "#64748B",
  sendButton: "#06B6D4",
  sendButtonDisabled: "#334155",
  border: "#334155",
  warning: "#F59E0B",
};

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  isStreaming = false,
}) => {
  const [text, setText] = useState("");

  const remainingChars = MAX_MESSAGE_LENGTH - text.length;
  const showWarning = text.length > MAX_MESSAGE_LENGTH * 0.9;
  const canSend = text.trim().length > 0 && !disabled && !isStreaming;

  const handleSend = () => {
    if (!canSend) return;

    const formattedMessage = text.trim().replace(/\s+/g, " ");
    onSend(formattedMessage);
    setText("");
  };

  const getPlaceholder = () => {
    if (isStreaming) {
      return "Waiting for response...";
    }
    return "Type a message...";
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={getPlaceholder()}
            placeholderTextColor={COLORS.placeholder}
            value={text}
            onChangeText={setText}
            editable={!disabled && !isStreaming}
            multiline
            maxLength={MAX_MESSAGE_LENGTH + 100} // Allow slight overflow for UX
            testID="chat-input"
          />
        </View>

        <TouchableOpacity
          style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!canSend}
          testID="send-button"
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      {(showWarning || remainingChars < 100) && (
        <View style={styles.charCountContainer}>
          <Text
            style={[
              styles.charCount,
              remainingChars < 0 && styles.charCountError,
            ]}
          >
            {remainingChars} characters remaining
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    maxHeight: 120,
  },
  input: {
    fontSize: 16,
    color: COLORS.text,
    padding: 0,
    margin: 0,
  },
  sendButton: {
    backgroundColor: COLORS.sendButton,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.sendButtonDisabled,
  },
  sendButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
  charCountContainer: {
    position: "absolute",
    bottom: 60,
    right: 20,
  },
  charCount: {
    fontSize: 12,
    color: COLORS.placeholder,
  },
  charCountError: {
    color: COLORS.warning,
  },
});

export default ChatInput;
