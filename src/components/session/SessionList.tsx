import React, { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  type ListRenderItemInfo,
} from "react-native";
import { Session } from "../../stores/sessionStore";
import { SessionCard } from "./SessionCard";

/**
 * SessionList Component
 *
 * Displays a scrollable list of sessions with pull-to-refresh
 * support and empty state handling.
 */
export interface SessionListProps {
  sessions: Session[];
  selectedSessionId?: string | null;
  onSelectSession: (session: Session) => void;
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

const COLORS = {
  background: "#0F172A",
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
  emptyState: "#64748B",
} as const;

const EmptyStateMessage = {
  LOADING: "Loading sessions...",
  EMPTY: "No sessions found. Start a new chat to create one.",
} as const;

/**
 * Sort sessions by lastActivity (most recent first)
 */
const sortSessions = (sessions: Session[]): Session[] => {
  return [...sessions].sort((a, b) => b.lastActivity - a.lastActivity);
};

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  selectedSessionId,
  onSelectSession,
  isLoading = false,
  isRefreshing = false,
  onRefresh,
}) => {
  const sortedSessions = sortSessions(sessions);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Session>) => (
      <SessionCard
        session={item}
        onPress={onSelectSession}
        isSelected={item.id === selectedSessionId}
      />
    ),
    [onSelectSession, selectedSessionId],
  );

  const keyExtractor = useCallback((item: Session) => item.id, []);

  const renderEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer} testID="empty-state">
        <Text style={styles.emptyText}>
          {isLoading ? EmptyStateMessage.LOADING : EmptyStateMessage.EMPTY}
        </Text>
      </View>
    ),
    [isLoading],
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  const canRefresh = Boolean(onRefresh) && !isLoading && !isRefreshing;

  return (
    <FlatList
      data={sortedSessions}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={renderEmptyComponent}
      ItemSeparatorComponent={renderSeparator}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.textSecondary}
            colors={[COLORS.textSecondary]}
          />
        ) : undefined
      }
      showsVerticalScrollIndicator={false}
      testID="session-list"
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: COLORS.emptyState,
    fontSize: 16,
    textAlign: "center",
  },
  separator: {
    height: 4,
  },
});

export default SessionList;
