import React from "react";
import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

/**
 * Tab Icons
 * 
 * Simple icon components for the tab bar.
 */
const ChatIcon = ({ focused }: { focused: boolean }) => (
  <View style={[styles.iconContainer, focused && styles.iconFocused]}>
    <Text style={[styles.iconText, focused && styles.iconTextFocused]}>💬</Text>
  </View>
);

const SessionsIcon = ({ focused }: { focused: boolean }) => (
  <View style={[styles.iconContainer, focused && styles.iconFocused]}>
    <Text style={[styles.iconText, focused && styles.iconTextFocused]}>📋</Text>
  </View>
);

const SettingsIcon = ({ focused }: { focused: boolean }) => (
  <View style={[styles.iconContainer, focused && styles.iconFocused]}>
    <Text style={[styles.iconText, focused && styles.iconTextFocused]}>⚙️</Text>
  </View>
);

const COLORS = {
  background: "#0F172A",
  surface: "#1E293B",
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
  accent: "#06B6D4",
  border: "#334155",
} as const;

/**
 * Tab Layout
 * 
 * Configures the tab navigation with icons.
 */
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null, // Don't show in tab bar
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ focused }) => <ChatIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="sessions"
        options={{
          title: "Sessions",
          tabBarIcon: ({ focused }) => <SessionsIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => <SettingsIcon focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  iconFocused: {
    // Optional: Add visual feedback for focused state
  },
  iconText: {
    fontSize: 20,
    opacity: 0.6,
  },
  iconTextFocused: {
    opacity: 1,
  },
});
