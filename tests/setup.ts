import { vi } from "vitest";

// Mock expo-secure-store
vi.mock("expo-secure-store", () => ({
  setItemAsync: vi.fn(() => Promise.resolve()),
  getItemAsync: vi.fn(() => Promise.resolve(null)),
  deleteItemAsync: vi.fn(() => Promise.resolve()),
}));

// Mock expo-router
vi.mock("expo-router", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock zustand - only mock the persist middleware for testing
// We want the actual store behavior for unit tests
vi.mock("zustand/middleware", () => ({
  persist: (fn: (set: vi.Mock, get: vi.Mock) => object) => fn,
  createJSONStorage: () => ({
    getItem: async () => null,
    setItem: async () => {},
    removeItem: async () => {},
  }),
}));
