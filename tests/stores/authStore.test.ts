import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  authStore,
  createAuthStore,
  AuthStore,
} from "../../src/stores/authStore";

describe("authStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store state before each test
    authStore.setState({
      isAuthenticated: false,
      serverUrl: null,
      isLoading: false,
      error: null,
    });
  });

  describe("initial state", () => {
    it("should have isAuthenticated as false", () => {
      const store = createAuthStore();
      expect(store.getState().isAuthenticated).toBe(false);
    });

    it("should have serverUrl as null", () => {
      const store = createAuthStore();
      expect(store.getState().serverUrl).toBeNull();
    });

    it("should have isLoading as false", () => {
      const store = createAuthStore();
      expect(store.getState().isLoading).toBe(false);
    });

    it("should have error as null", () => {
      const store = createAuthStore();
      expect(store.getState().error).toBeNull();
    });
  });

  describe("login action", () => {
    it("should set isLoading to true during login", async () => {
      const store = createAuthStore();
      const loginPromise = store
        .getState()
        .login("http://test.com", "password");

      expect(store.getState().isLoading).toBe(true);
      await loginPromise;
    });

    it("should set isAuthenticated to true on valid login", async () => {
      const store = createAuthStore();
      await store.getState().login("http://test.com", "password");

      expect(store.getState().isAuthenticated).toBe(true);
    });

    it("should store serverUrl on valid login", async () => {
      const store = createAuthStore();
      const testUrl = "http://laptop.tailnet-name.ts.net:4096";
      await store.getState().login(testUrl, "password");

      expect(store.getState().serverUrl).toBe(testUrl);
    });

    it("should set isLoading to false after login completes", async () => {
      const store = createAuthStore();
      await store.getState().login("http://test.com", "password");

      expect(store.getState().isLoading).toBe(false);
    });

    it("should throw error when URL is empty", async () => {
      const store = createAuthStore();

      await expect(store.getState().login("", "password")).rejects.toThrow(
        "URL and password are required",
      );
    });

    it("should throw error when password is empty", async () => {
      const store = createAuthStore();

      await expect(
        store.getState().login("http://test.com", ""),
      ).rejects.toThrow("URL and password are required");
    });

    it("should throw error for invalid URL format", async () => {
      const store = createAuthStore();

      await expect(
        store.getState().login("not-a-valid-url", "password"),
      ).rejects.toThrow("Invalid URL format");
    });

    it("should set error state on login failure", async () => {
      const store = createAuthStore();

      try {
        await store.getState().login("", "password");
      } catch {
        // Expected to throw
      }

      expect(store.getState().error).toBe("URL and password are required");
    });

    it("should have error as null on successful login", async () => {
      const store = createAuthStore();
      await store.getState().login("http://test.com", "password");

      expect(store.getState().error).toBeNull();
    });
  });

  describe("logout action", () => {
    it("should set isAuthenticated to false on logout", async () => {
      const store = createAuthStore();

      // First login
      await store.getState().login("http://test.com", "password");
      expect(store.getState().isAuthenticated).toBe(true);

      // Then logout
      await store.getState().logout();
      expect(store.getState().isAuthenticated).toBe(false);
    });

    it("should set serverUrl to null on logout", async () => {
      const store = createAuthStore();

      // First login
      await store.getState().login("http://test.com", "password");
      expect(store.getState().serverUrl).toBe("http://test.com");

      // Then logout
      await store.getState().logout();
      expect(store.getState().serverUrl).toBeNull();
    });

    it("should clear error on logout", async () => {
      const store = createAuthStore();

      // Try to login with invalid credentials to set error
      try {
        await store.getState().login("", "password");
      } catch {
        // Expected to throw
      }

      // Then logout
      await store.getState().logout();
      expect(store.getState().error).toBeNull();
    });
  });

  describe("clearError action", () => {
    it("should set error to null", async () => {
      const store = createAuthStore();

      // Trigger an error
      try {
        await store.getState().login("", "password");
      } catch {
        // Expected
      }

      // Clear error
      store.getState().clearError();
      expect(store.getState().error).toBeNull();
    });
  });
});
