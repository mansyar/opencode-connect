# Tech Stack - OpenCode Connect

## Package Manager

| Tool | Version | Purpose |
| :--- | :--- | :--- |
| **pnpm** | 10.x | Fast, disk-space-efficient package manager |

---

## Framework & Language

| Component | Technology | Version | Notes |
| :--- | :--- | :--- | :--- |
| **Framework** | Expo | SDK 55 | React Native 0.83, React 19.2 |
| **Language** | TypeScript | 5.x | Strict mode enabled |
| **Runtime** | Node.js | 20 LTS | For build tooling and scripts |

---

## Core Dependencies

### SDK & API

| Package | Purpose | Version |
| :--- | :--- | :--- |
| `@opencode-ai/sdk` | Official OpenCode SDK for server communication | Latest |
| `axios` | HTTP client for REST API calls | ^1.7 |

### Streaming

| Package | Purpose | Version |
| :--- | :--- | :--- |
| `react-native-sse` | Server-Sent Events for real-time streaming | Latest |
| `event-source-polyfill` | Fallback SSE support | ^2.0 |

### State Management

| Package | Purpose | Version |
| :--- | :--- | :--- |
| `zustand` | Lightweight state management for session and connection state | ^5.0 |
| `zustand/middleware` | Built-in middleware for persistence and devtools | Included |

### Storage & Security

| Package | Purpose | Version |
| :--- | :--- | :--- |
| `expo-secure-store` | Secure credential storage (Tailscale URL, password) | SDK 55 |
| `@react-native-async-storage/async-storage` | General-purpose key-value storage | ^2.1 |

### UI Components

| Package | Purpose | Version |
| :--- | :--- | :--- |
| `tamagui` | Cross-platform UI kit with responsive design | ^1.100 |
| `@tamagui/core` | Core Tamagui components | Included |
| `@tamagui/expo` | Expo integration for Tamagui | Included |

### Navigation

| Package | Purpose | Version |
| :--- | :--- | :--- |
| `expo-router` | File-based routing for Expo (v7 with liquid glass tabs) | ^4.0 |
| `expo-linking` | Deep linking support | SDK 55 |
| `expo-constants` | Device constants for responsive design | SDK 55 |

### Speech Recognition

| Package | Purpose | Version |
| :--- | :--- | :--- |
| `@jamsch/expo-speech-recognition` | Native speech-to-text for voice coding | ^3.0.1 |
| `expo-av` | Audio recording and playback | SDK 55 |

### Haptics & Feedback

| Package | Purpose | Version |
| :--- | :--- | :--- |
| `expo-haptics` | Haptic feedback for interactions | SDK 55 |

### Markdown & Code Display

| Package | Purpose | Version |
| :--- | :--- | :--- |
| `react-native-markdown-display` | Render code diffs as Markdown | ^7.0 |
| `react-syntax-highlighter` | Syntax highlighting for code blocks | ^15.64 |

---

## Development Tools

### Testing

| Package | Purpose | Version |
| :--- | :--- | :--- |
| `vitest` | Fast unit testing framework | ^4.1 |
| `@testing-library/react-native` | Component testing | ^12.4 |
| `jsdom` | DOM environment for testing | ^25.0 |

### Linting & Formatting

| Package | Purpose | Version |
| :--- | :--- | :--- |
| `eslint` | TypeScript/React linting | ^9.0 | Compatible with Expo SDK 55 |
| `eslint-config-expo` | Expo's ESLint config | ^55.0.0 | |
| `prettier` | Code formatting | ^3.8.1 | |
| `lint-staged` | Pre-commit hook runner | ^16.4.0 | Runs lint, format, typecheck, and line-limit check |

### Build & CI

| Package | Purpose | Version |
| :--- | :--- | :--- |
| `eas-cli` | Expo Application Services for native mobile build | Latest |
| `typescript` | Type checking | ^5.6 |

**Note:** Native mobile builds use EAS CLI with Metro bundler.

---

## Project Structure

```
OpenCodeConnect/
├── src/
│   ├── app/                    # Expo Router pages (file-based routing)
│   │   ├── (tabs)/            # Tab navigation screens
│   │   │   ├── chat.tsx       # Live chat screen
│   │   │   ├── sessions.tsx   # Session list screen
│   │   │   └── settings.tsx   # Settings screen
│   │   ├── _layout.tsx        # Root layout
│   │   └── index.tsx          # Entry/splash screen
│   ├── components/             # Reusable UI components
│   │   ├── chat/              # Chat-specific components
│   │   ├── ui/                # Base UI components
│   │   └── code/              # Code display components
│   ├── hooks/                  # Custom React hooks
│   ├── stores/                 # Zustand stores
│   ├── services/               # API and SDK services
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Utility functions
│   └── constants/              # App constants and theme
├── tests/                       # Vitest test files (*.test.tsx)
└── ...
```

---

## Environment Configuration

### Required Environment Variables

| Variable | Description | Example |
| :--- | :--- | :--- |
| `OPENCODE_SERVER_URL` | Default Tailscale server URL | `http://laptop.tailnet-name.ts.net:4096` |
| `OPENCODE_SERVER_PASSWORD` | Server password (stored in secure store only) | `********` |

### Optional Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `ENABLE_DEV_TOOLS` | Enable React Native devtools | `false` |
| `STREAM_TIMEOUT_MS` | SSE connection timeout | `30000` |
