import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  type GestureResponderEvent,
} from "react-native";
import { Session } from "../../stores/sessionStore";

/**
 * SessionCard Component
 *
 * Displays a single session item with name, project path,
 * and last activity time. Supports touch feedback and selection state.
 */
export interface SessionCardProps {
  session: Session;
  onPress: (session: Session) => void;
  isSelected?: boolean;
}

const COLORS = {
  primary: "#1E3A5F",
  surface: "#1E293B",
  background: "#0F172A",
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
  accent: "#06B6D4",
} as const;

/**
 * Format relative time (e.g., "2 hours ago")
 */
const formatRelativeTime = (lastActivity: number): string => {
  const now = Date.now();
  const diff = now - lastActivity;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }
  if (hours > 0) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }
  if (minutes > 0) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  }
  return "Just now";
};

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onPress,
  isSelected = false,
}) => {
  const { name, projectPath, lastActivity } = session;

  const handlePress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onPress(session);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        isSelected && styles.selectedContainer,
        pressed && styles.pressedContainer,
      ]}
      onPress={handlePress}
      testID={`session-card-${session.id}`}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1} testID="session-name">
            {name}
          </Text>
          {isSelected && (
            <View
              style={styles.selectedIndicator}
              testID="selected-indicator"
            />
          )}
        </View>

        {projectPath && (
          <Text
            style={styles.projectPath}
            numberOfLines={1}
            testID="session-project-path"
          >
            {projectPath}
          </Text>
        )}

        <Text style={styles.timestamp} testID="session-timestamp">
          {formatRelativeTime(lastActivity)}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  selectedContainer: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  pressedContainer: {
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    marginLeft: 8,
  },
  projectPath: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  timestamp: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
});

export default SessionCard;
