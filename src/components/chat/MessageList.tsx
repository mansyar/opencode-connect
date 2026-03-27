import React, { useRef, useEffect } from 'react';
import { View, FlatList, StyleSheet, ListRenderItem } from 'react-native';
import { Message } from '../../stores/chatStore';
import { ChatBubble } from './ChatBubble';

/**
 * MessageList Component
 *
 * Displays a scrollable list of chat messages with auto-scroll
 * support for new messages and streaming content.
 */
export interface MessageListProps {
  messages: Message[];
}

const COLORS = {
  background: '#0F172A',
} as const;

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const flatListRef = useRef<FlatList<Message>>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > 0) {
      // Small delay to ensure the list has rendered
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  // Auto-scroll when streaming message content updates
  const lastMessageLength = useRef(0);
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.isStreaming && lastMessage.content.length > lastMessageLength.current) {
        lastMessageLength.current = lastMessage.content.length;
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }, 50);
      }
    }
  }, [messages]);

  const renderMessage: ListRenderItem<Message> = ({ item }) => <ChatBubble message={item} />;

  const keyExtractor = (item: Message) => item.id;

  return (
    <View style={styles.container} testID="message-list">
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
        onContentSizeChange={() => {
          // Ensure we scroll to end when content size changes
          flatListRef.current?.scrollToEnd({ animated: false });
        }}
        testID="messages-flatlist"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default MessageList;
