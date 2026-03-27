import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

/**
 * Session Interface
 *
 * Represents a coding session with the OpenCode agent.
 */
export interface Session {
  id: string;
  name: string;
  lastActivity: number;
  projectPath?: string;
}

/**
 * Session Store Interface
 *
 * Manages session state including:
 * - Session list loading
 * - Current session selection
 * - Loading and error states
 */
export interface SessionStore {
  // State
  sessions: Session[];
  currentSession: Session | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadSessions: () => Promise<void>;
  selectSession: (session: Session | null) => void;
  clearSessions: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

// Storage keys for persistence
const STORAGE_KEYS = {
  CURRENT_SESSION: 'opencode_current_session',
} as const;

/**
 * Creates the session store
 *
 * Manages session list and current session state.
 * Sessions are loaded from the OpenCode SDK.
 */
export const createSessionStore = () => {
  return create<SessionStore>()((set, get) => ({
    // Initial state
    sessions: [],
    currentSession: null,
    isLoading: false,
    error: null,

    /**
     * Load sessions from the OpenCode SDK
     * Fetches the list of recent sessions (last 5)
     */
    loadSessions: async () => {
      set({ isLoading: true, error: null });

      try {
        // In a real implementation, this would call the OpenCode SDK:
        // const sessions = await client.session.list();

        // Simulate async operation for MVP
        await new Promise((resolve) => setTimeout(resolve, 10));

        // Mock sessions data - simulating what SDK would return
        // In production, this would come from the actual SDK
        const mockSessions: Session[] = [
          {
            id: 'session_1',
            name: 'Project Alpha',
            lastActivity: Date.now() - 1000,
            projectPath: '/home/user/project-alpha',
          },
          {
            id: 'session_2',
            name: 'Bug Fixes',
            lastActivity: Date.now() - 5000,
            projectPath: '/home/user/bug-fixes',
          },
          {
            id: 'session_3',
            name: 'Feature Development',
            lastActivity: Date.now() - 10000,
            projectPath: '/home/user/feature-dev',
          },
        ];

        // Sort by lastActivity (most recent first)
        mockSessions.sort((a, b) => b.lastActivity - a.lastActivity);

        // Limit to last 5 sessions as per spec
        const limitedSessions = mockSessions.slice(0, 5);

        set({ sessions: limitedSessions, isLoading: false });
      } catch (error) {
        set({
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load sessions',
        });
      }
    },

    /**
     * Select a session and set it as current
     * Persists the selection to SecureStore for session restoration (fire-and-forget)
     */
    selectSession: (session: Session | null) => {
      // Update state immediately for responsive UI
      set({ currentSession: session });

      // Persist to SecureStore asynchronously (fire-and-forget)
      if (session) {
        SecureStore.setItemAsync(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session)).catch(
          console.error
        );
      } else {
        SecureStore.deleteItemAsync(STORAGE_KEYS.CURRENT_SESSION).catch(console.error);
      }
    },

    /**
     * Clear all sessions and reset current session
     */
    clearSessions: () => {
      SecureStore.deleteItemAsync(STORAGE_KEYS.CURRENT_SESSION);
      set({ sessions: [], currentSession: null });
    },

    /**
     * Set loading state
     */
    setLoading: (isLoading: boolean) => {
      set({ isLoading });
    },

    /**
     * Set error state
     */
    setError: (error: string | null) => {
      set({ error });
    },
  }));
};

// Singleton store instance
export const sessionStore = createSessionStore();

/**
 * Hook to use session store in React components
 */
export const useSessionStore = sessionStore;
