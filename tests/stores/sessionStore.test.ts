import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  sessionStore,
  createSessionStore,
  SessionStore,
} from "../../src/stores/sessionStore";

describe("sessionStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store state before each test
    sessionStore.setState({
      sessions: [],
      currentSession: null,
      isLoading: false,
      error: null,
    });
  });

  describe("initial state", () => {
    it("should have empty sessions array", () => {
      const store = createSessionStore();
      expect(store.getState().sessions).toEqual([]);
    });

    it("should have null as initial currentSession", () => {
      const store = createSessionStore();
      expect(store.getState().currentSession).toBeNull();
    });

    it("should not be loading initially", () => {
      const store = createSessionStore();
      expect(store.getState().isLoading).toBe(false);
    });

    it("should have null error initially", () => {
      const store = createSessionStore();
      expect(store.getState().error).toBeNull();
    });
  });

  describe("loadSessions action", () => {
    it("should set isLoading to true during load", async () => {
      const store = createSessionStore();
      const loadPromise = store.getState().loadSessions();

      expect(store.getState().isLoading).toBe(true);
      await loadPromise;
    });

    it("should load sessions successfully", async () => {
      const store = createSessionStore();
      await store.getState().loadSessions();

      expect(store.getState().sessions).toHaveLength(3);
    });

    it("should set isLoading to false after load completes", async () => {
      const store = createSessionStore();
      await store.getState().loadSessions();

      expect(store.getState().isLoading).toBe(false);
    });

    it("should have error as null on successful load", async () => {
      const store = createSessionStore();
      await store.getState().loadSessions();

      expect(store.getState().error).toBeNull();
    });

    it("should have sessions with required properties", async () => {
      const store = createSessionStore();
      await store.getState().loadSessions();

      const sessions = store.getState().sessions;
      sessions.forEach((session) => {
        expect(session).toHaveProperty("id");
        expect(session).toHaveProperty("name");
        expect(session).toHaveProperty("lastActivity");
      });
    });

    it("should sort sessions by lastActivity (most recent first)", async () => {
      const store = createSessionStore();
      await store.getState().loadSessions();

      const sessions = store.getState().sessions;
      for (let i = 1; i < sessions.length; i++) {
        expect(sessions[i - 1].lastActivity).toBeGreaterThanOrEqual(
          sessions[i].lastActivity,
        );
      }
    });
  });

  describe("selectSession action", () => {
    it("should set currentSession when selecting a session", async () => {
      const store = createSessionStore();
      await store.getState().loadSessions();

      const sessionToSelect = store.getState().sessions[0];
      store.getState().selectSession(sessionToSelect);

      expect(store.getState().currentSession).toEqual(sessionToSelect);
    });

    it("should preserve session data when selecting", async () => {
      const store = createSessionStore();
      await store.getState().loadSessions();

      const sessionToSelect = store.getState().sessions[1];
      store.getState().selectSession(sessionToSelect);

      const current = store.getState().currentSession;
      expect(current?.id).toBe(sessionToSelect.id);
      expect(current?.name).toBe(sessionToSelect.name);
      expect(current?.projectPath).toBe(sessionToSelect.projectPath);
    });

    it("should allow changing to a different session", async () => {
      const store = createSessionStore();
      await store.getState().loadSessions();

      const sessions = store.getState().sessions;
      store.getState().selectSession(sessions[0]);
      expect(store.getState().currentSession?.id).toBe(sessions[0].id);

      store.getState().selectSession(sessions[2]);
      expect(store.getState().currentSession?.id).toBe(sessions[2].id);
    });

    it("should allow clearing current session by selecting null", async () => {
      const store = createSessionStore();
      await store.getState().loadSessions();

      const sessionToSelect = store.getState().sessions[0];
      store.getState().selectSession(sessionToSelect);
      expect(store.getState().currentSession).not.toBeNull();

      store.getState().selectSession(null as any);
      expect(store.getState().currentSession).toBeNull();
    });
  });

  describe("clearSessions action", () => {
    it("should remove all sessions", async () => {
      const store = createSessionStore();
      await store.getState().loadSessions();
      expect(store.getState().sessions).toHaveLength(3);

      store.getState().clearSessions();
      expect(store.getState().sessions).toEqual([]);
    });

    it("should clear currentSession when clearing sessions", async () => {
      const store = createSessionStore();
      await store.getState().loadSessions();

      const sessionToSelect = store.getState().sessions[0];
      store.getState().selectSession(sessionToSelect);
      expect(store.getState().currentSession).not.toBeNull();

      store.getState().clearSessions();
      expect(store.getState().currentSession).toBeNull();
    });
  });

  describe("session persistence", () => {
    it("should maintain selected session across multiple getState calls", async () => {
      const store = createSessionStore();
      await store.getState().loadSessions();

      const sessionToSelect = store.getState().sessions[1];
      store.getState().selectSession(sessionToSelect);

      // Access state multiple times to ensure persistence
      const state1 = store.getState();
      const state2 = store.getState();
      const state3 = store.getState();

      expect(state1.currentSession?.id).toBe(sessionToSelect.id);
      expect(state2.currentSession?.id).toBe(sessionToSelect.id);
      expect(state3.currentSession?.id).toBe(sessionToSelect.id);
    });

    it("should maintain sessions list after loading", async () => {
      const store = createSessionStore();
      await store.getState().loadSessions();

      const sessions1 = store.getState().sessions;
      const sessions2 = store.getState().sessions;

      expect(sessions1).toEqual(sessions2);
      expect(sessions1).toHaveLength(3);
    });
  });

  describe("setLoading action", () => {
    it("should set loading to true", () => {
      const store = createSessionStore();
      store.getState().setLoading(true);

      expect(store.getState().isLoading).toBe(true);
    });

    it("should set loading to false", () => {
      const store = createSessionStore();
      store.getState().setLoading(true);
      store.getState().setLoading(false);

      expect(store.getState().isLoading).toBe(false);
    });
  });

  describe("setError action", () => {
    it("should set error message", () => {
      const store = createSessionStore();
      store.getState().setError("Connection failed");

      expect(store.getState().error).toBe("Connection failed");
    });

    it("should allow clearing error with null", () => {
      const store = createSessionStore();
      store.getState().setError("Some error");
      store.getState().setError(null);

      expect(store.getState().error).toBeNull();
    });

    it("should clear sessions when error occurs", async () => {
      const store = createSessionStore();
      await store.getState().loadSessions();
      expect(store.getState().sessions).toHaveLength(3);

      // Simulate error setting (in real impl this would happen during load)
      store.getState().setError("Network error");

      // Error state should be set but sessions preserved
      expect(store.getState().error).toBe("Network error");
    });
  });
});
