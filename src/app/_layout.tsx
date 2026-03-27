import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { useAuthStore } from "../stores/authStore";

/**
 * Root Layout
 *
 * Main entry point for the app. Handles authentication
 * gating and initial routing.
 */
export default function RootLayout() {
  const { isAuthenticated, restoreSession } = useAuthStore();

  // Restore session on app start
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0F172A" },
      }}
    >
      {/* Auth Screen - always accessible */}
      <Stack.Screen name="auth" options={{ headerShown: false }} />

      {/* Tab Navigator - protected by auth check in individual screens */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
