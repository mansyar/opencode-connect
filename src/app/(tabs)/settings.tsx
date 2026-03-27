import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import { useAuthStore } from "../../stores/authStore";

// App version info
const APP_VERSION = Constants.expoConfig?.version || "1.0.0";
const BUILD_NUMBER = Constants.expoConfig?.android?.versionCode?.toString() || "1";

const COLORS = {
  primary: "#1E3A5F",
  surface: "#1E293B",
  background: "#0F172A",
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
  danger: "#DC2626",
  dangerHover: "#B91C1C",
} as const;

/**
 * SettingsScreen
 *
 * Displays app settings including:
 * - Connected server URL
 * - Disconnect/logout button
 * - App version info
 */
export default function SettingsScreen() {
  const router = useRouter();
  const { serverUrl, logout, isLoading } = useAuthStore();
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  /**
   * Handle disconnect/logout
   */
  const handleDisconnect = () => {
    Alert.alert(
      "Disconnect",
      "Are you sure you want to disconnect from the server?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Disconnect",
          style: "destructive",
          onPress: performDisconnect,
        },
      ],
    );
  };

  /**
   * Perform the actual disconnect
   */
  const performDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await logout();
      router.replace("/auth");
    } catch (error) {
      Alert.alert("Error", "Failed to disconnect. Please try again.");
      setIsDisconnecting(false);
    }
  };

  /**
   * Format server URL for display (extract hostname and port)
   */
  const formatServerUrl = (url: string): string => {
    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname || url;
      const port = parsed.port ? `:${parsed.port}` : "";
      return hostname + port;
    } catch {
      return url;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Settings Content */}
      <View style={styles.content}>
        {/* Server Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection</Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Server</Text>
            {serverUrl ? (
              <Text style={styles.infoValue} numberOfLines={1}>
                {formatServerUrl(serverUrl)}
              </Text>
            ) : (
              <Text style={styles.infoValue}>Not connected</Text>
            )}
          </View>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>
              {APP_VERSION} ({BUILD_NUMBER})
            </Text>
          </View>
        </View>

        {/* Disconnect Button */}
        <View style={styles.section}>
          <Pressable
            style={({ pressed }) => [
              styles.disconnectButton,
              pressed && styles.disconnectButtonPressed,
              isDisconnecting && styles.disconnectButtonDisabled,
            ]}
            onPress={handleDisconnect}
            disabled={isDisconnecting}
          >
            {isDisconnecting || isLoading ? (
              <ActivityIndicator color={COLORS.textPrimary} size="small" />
            ) : (
              <Text style={styles.disconnectButtonText}>Disconnect</Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  disconnectButton: {
    backgroundColor: COLORS.danger,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  disconnectButtonPressed: {
    backgroundColor: COLORS.dangerHover,
  },
  disconnectButtonDisabled: {
    opacity: 0.6,
  },
  disconnectButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
});