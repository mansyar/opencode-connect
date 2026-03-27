import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../stores/authStore';
import { useSessionStore, Session } from '../../stores/sessionStore';
import { SessionList } from '../../components/session/SessionList';

/**
 * SessionsScreen
 *
 * Displays a list of recent sessions and allows the user
 * to select a session to view in the chat screen.
 */
export default function SessionsScreen() {
  const router = useRouter();
  const { isAuthenticated, serverUrl } = useAuthStore();
  const { sessions, currentSession, isLoading, error, loadSessions, selectSession } =
    useSessionStore();

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated, router]);

  // Load sessions on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadSessions();
    }
  }, [isAuthenticated, loadSessions]);

  /**
   * Handle pull-to-refresh
   */
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadSessions();
    setIsRefreshing(false);
  }, [loadSessions]);

  /**
   * Handle session selection
   */
  const handleSelectSession = useCallback(
    (session: Session) => {
      selectSession(session);
      router.push(`/chat?sessionId=${session.id}`);
    },
    [selectSession, router]
  );

  /**
   * Get subtitle for header
   */
  const getSubtitle = (): string | undefined => {
    if (sessions.length === 0) return undefined;
    return `${sessions.length} session${sessions.length === 1 ? '' : 's'}`;
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
        <Text style={styles.headerTitle}>Sessions</Text>
        {getSubtitle() && <Text style={styles.headerSubtitle}>{getSubtitle()}</Text>}
        {serverUrl && (
          <Text style={styles.headerServer} numberOfLines={1}>
            {serverUrl}
          </Text>
        )}
      </View>

      {/* Error State */}
      {error && !isLoading && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Loading State (initial load only) */}
      {isLoading && sessions.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#06B6D4" />
          <Text style={styles.loadingText}>Loading sessions...</Text>
        </View>
      )}

      {/* Session List */}
      {!isLoading || sessions.length > 0 ? (
        <SessionList
          sessions={sessions}
          selectedSessionId={currentSession?.id}
          onSelectSession={handleSelectSession}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 16,
    marginTop: 12,
  },
  header: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  headerServer: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  errorContainer: {
    backgroundColor: '#7F1D1D',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 14,
  },
});
