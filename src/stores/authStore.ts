import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";

/**
 * Auth Store Interface
 *
 * Manages authentication state for OpenCode Connect including:
 * - Server URL and credentials storage
 * - Login/logout actions
 * - Session persistence via SecureStore
 */
export interface AuthStore {
  // State
  isAuthenticated: boolean;
  serverUrl: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (url: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  restoreSession: () => Promise<boolean>;
}

// Storage keys for SecureStore
const STORAGE_KEYS = {
  SERVER_URL: "opencode_server_url",
  PASSWORD: "opencode_server_password",
} as const;

/**
 * Creates the auth store with persistence
 *
 * Uses expo-secure-store for credential storage to ensure
 * sensitive data is never stored in plain text.
 */
export const createAuthStore = () => {
  return create<AuthStore>()(
    persist(
      (set, get) => ({
        // Initial state
        isAuthenticated: false,
        serverUrl: null,
        isLoading: false,
        error: null,

        /**
         * Login action
         * Validates credentials and establishes authenticated session
         */
        login: async (url: string, password: string) => {
          set({ isLoading: true, error: null });

          try {
            // Validate inputs
            if (!url || !password) {
              throw new Error("URL and password are required");
            }

            // Validate URL format
            try {
              new URL(url);
            } catch {
              throw new Error("Invalid URL format");
            }

            // Store credentials securely
            await SecureStore.setItemAsync(STORAGE_KEYS.SERVER_URL, url);
            await SecureStore.setItemAsync(STORAGE_KEYS.PASSWORD, password);

            // Update state to authenticated
            set({
              isAuthenticated: true,
              serverUrl: url,
              isLoading: false,
            });
          } catch (error) {
            // Clear any stored credentials on failure
            await SecureStore.deleteItemAsync(STORAGE_KEYS.SERVER_URL);
            await SecureStore.deleteItemAsync(STORAGE_KEYS.PASSWORD);

            set({
              isLoading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Authentication failed",
            });
            throw error;
          }
        },

        /**
         * Logout action
         * Clears authenticated state and removes stored credentials
         */
        logout: async () => {
          // Remove stored credentials
          await SecureStore.deleteItemAsync(STORAGE_KEYS.SERVER_URL);
          await SecureStore.deleteItemAsync(STORAGE_KEYS.PASSWORD);

          // Reset state
          set({
            isAuthenticated: false,
            serverUrl: null,
            error: null,
          });
        },

        /**
         * Clear error action
         * Resets the error state to null
         */
        clearError: () => set({ error: null }),

        /**
         * Restore session action
         * Attempts to restore an authenticated session from stored credentials
         * Returns true if session was restored, false otherwise
         */
        restoreSession: async () => {
          try {
            const storedUrl = await SecureStore.getItemAsync(
              STORAGE_KEYS.SERVER_URL,
            );
            const storedPassword = await SecureStore.getItemAsync(
              STORAGE_KEYS.PASSWORD,
            );

            if (storedUrl && storedPassword) {
              // Validate stored URL format
              try {
                new URL(storedUrl);
              } catch {
                // Invalid stored URL, clear and return false
                await SecureStore.deleteItemAsync(STORAGE_KEYS.SERVER_URL);
                await SecureStore.deleteItemAsync(STORAGE_KEYS.PASSWORD);
                return false;
              }

              set({
                isAuthenticated: true,
                serverUrl: storedUrl,
              });
              return true;
            }

            return false;
          } catch {
            // On any error, clear corrupted storage and return false
            await SecureStore.deleteItemAsync(STORAGE_KEYS.SERVER_URL);
            await SecureStore.deleteItemAsync(STORAGE_KEYS.PASSWORD);
            return false;
          }
        },
      }),
      {
        name: "auth-storage",
        storage: createJSONStorage(() => ({
          getItem: async () => null,
          setItem: async () => {},
          removeItem: async () => {},
        })),
        // Only persist non-sensitive data
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          serverUrl: state.serverUrl,
        }),
      },
    ),
  );
};

// Singleton store instance - this is already a Zustand hook
export const authStore = createAuthStore();

/**
 * Hook to use auth store in React components
 *
 * In Zustand v5, the store created by create() is itself a hook.
 * Use authStore directly to access state and actions.
 *
 * @example
 * const { isAuthenticated, login, logout } = authStore();
 */
// Re-export the store as the hook for convenience
export const useAuthStore = authStore;
