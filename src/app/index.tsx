import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "../stores/authStore";

/**
 * Index Screen
 *
 * Entry point that redirects to chat or auth based on authentication state.
 */
export default function IndexScreen() {
  const router = useRouter();
  const { isAuthenticated, restoreSession } = useAuthStore();

  useEffect(() => {
    // Ensure session is restored
    restoreSession().then(() => {
      // Navigate based on auth state
      if (isAuthenticated) {
        router.replace("/(tabs)/chat");
      } else {
        router.replace("/auth");
      }
    });
  }, [isAuthenticated, restoreSession, router]);

  return null; // Or could show a splash screen
}
