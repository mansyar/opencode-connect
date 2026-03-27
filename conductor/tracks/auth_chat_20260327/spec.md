# Track: Build OpenCode Connect MVP - Core Authentication and Live Chat

## 1. Track Overview

**Track ID:** auth_chat_20260327
**Type:** Feature
**Created:** 2026-03-27

### Goals

Implement the core MVP features for OpenCode Connect:
1. **Authentication** - Secure storage and management of Tailscale server credentials
2. **Live Chat** - Real-time streaming chat interface with the OpenCode agent
3. **Session Management** - View and switch between recent sessions

---

## 2. Technical Specification

### 2.1 Framework Setup

| Component | Specification |
| :--- | :--- |
| Framework | Expo SDK 55 with React Native 0.83 |
| Language | TypeScript 5.x (strict mode) |
| Package Manager | pnpm 10.x |
| Testing | Vitest ^4.1 |
| State Management | Zustand ^5.0 |
| UI Components | Tamagui ^1.100 |
| Navigation | expo-router ^4.0 |

### 2.2 Project Structure

```
src/
├── app/                      # Expo Router pages
│   ├── _layout.tsx           # Root layout with auth gate
│   ├── index.tsx             # Entry/splash screen
│   └── (tabs)/               # Tab navigation
│       ├── chat.tsx          # Live chat screen
│       ├── sessions.tsx      # Session list screen
│       └── settings.tsx      # Settings screen
├── components/               # Reusable components
│   ├── ui/                   # Base UI (Button, Input, etc.)
│   ├── chat/                 # ChatBubble, CodeBlock, etc.
│   └── session/              # SessionCard, SessionList, etc.
├── hooks/                    # Custom hooks
│   ├── useAuth.ts            # Authentication hook
│   ├── useChat.ts            # Chat streaming hook
│   └── useSessions.ts        # Sessions hook
├── stores/                   # Zustand stores
│   ├── authStore.ts          # Auth state
│   └── chatStore.ts          # Chat messages state
├── services/                 # API services
│   └── opencodeService.ts    # OpenCode SDK wrapper
├── types/                    # TypeScript types
│   └── index.ts              # Shared types
└── constants/                # App constants
    └── theme.ts              # Theme constants
```

---

## 3. Feature Specifications

### 3.1 Authentication (AUTH)

| Feature | Description | Implementation |
| :--- | :--- | :--- |
| **Auth Screen** | Login form for Tailscale URL and password | Expo Secure Store |
| **Credential Storage** | Securely store URL and password | expo-secure-store |
| **Auto-login** | Restore session on app restart | Check stored credentials |

### 3.2 Live Chat (CHAT)

| Feature | Description | Implementation |
| :--- | :--- | :--- |
| **Message Display** | Show user and agent messages | ChatBubble component |
| **Streaming Response** | Real-time token streaming | SSE via @opencode-ai/sdk |
| **Code Blocks** | Render code with syntax highlighting | react-native-markdown-display |
| **Send Message** | Text input to send messages | TextInput + Send button |

### 3.3 Session Management (SESSION)

| Feature | Description | Implementation |
| :--- | :--- | :--- |
| **Session List** | Display last 5 sessions | expo-router list screen |
| **Session Switching** | Load selected session | client.session.list() |
| **Session State** | Persist active session | Zustand store |

---

## 4. UI/UX Specification

### 4.1 Screen Structure

1. **Splash/Index Screen** (`src/app/index.tsx`)
   - App logo and tagline
   - Check stored credentials
   - Navigate to Auth or Chat based on auth state

2. **Auth Screen** (`src/app/auth.tsx`)
   - Tailscale URL input field
   - Password input field
   - "Connect" button
   - Error display for invalid credentials

3. **Chat Screen** (`src/app/(tabs)/chat.tsx`)
   - Header with session name
   - Message list (scrollable)
   - Code block rendering
   - Text input with send button
   - Voice recording button

4. **Sessions Screen** (`src/app/(tabs)/sessions.tsx`)
   - List of 5 recent sessions
   - Session cards with name and last activity
   - Pull-to-refresh

5. **Settings Screen** (`src/app/(tabs)/settings.tsx`)
   - Server URL display
   - Disconnect/logout button
   - App version info

### 4.2 Navigation Structure

```
Root Layout (with Auth Gate)
├── Index/Splash
├── Auth Screen
└── Tab Navigator
    ├── Chat (default)
    ├── Sessions
    └── Settings
```

### 4.3 Color Scheme (from product-guidelines.md)

| Role | Color | Hex |
| :--- | :--- | :--- |
| Primary | Deep Blue | #1E3A5F |
| Accent | Electric Cyan | #06B6D4 |
| Background | Dark Charcoal | #0F172A |
| Surface | Dark Gray | #1E293B |
| Text Primary | Off White | #F8FAFC |
| User Bubble | Deep Blue | #1E3A5F |
| Agent Bubble | Dark Gray | #1E293B |

### 4.4 Typography

| Element | Font | Size |
| :--- | :--- | :--- |
| H1 | System | 28px Bold |
| H2 | System | 22px Semibold |
| Body | System | 16px Regular |
| Code | JetBrains Mono | 14px |

---

## 5. API Integration

### 5.1 OpenCode SDK

```typescript
import { OpenCodeClient } from '@opencode-ai/sdk';

// Initialize client
const client = new OpenCodeClient({
  baseURL: storedCredentials.url,
  auth: {
    username: 'user',
    password: storedCredentials.password
  }
});
```

### 5.2 Streaming Chat

```typescript
// Stream responses
const stream = await client.chat.stream({
  sessionId: currentSession.id,
  message: userMessage
});

stream.on('token', (token) => {
  // Append token to message
});

stream.on('complete', () => {
  // Finalize message
});
```

---

## 6. State Management (Zustand)

### 6.1 Auth Store

```typescript
interface AuthStore {
  isAuthenticated: boolean;
  serverUrl: string | null;
  login: (url: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
```

### 6.2 Chat Store

```typescript
interface ChatStore {
  sessions: Session[];
  currentSession: Session | null;
  messages: Message[];
  sendMessage: (text: string) => Promise<void>;
  loadSessions: () => Promise<void>;
  selectSession: (session: Session) => void;
}
```

---

## 7. Testing Strategy

### 7.1 Unit Tests

- Auth store: login/logout logic
- Chat store: message handling
- Components: rendering with props

### 7.2 Integration Tests

- Full login flow
- Send message and receive response
- Session switching

### 7.3 Coverage Target

>80% code coverage for new code

---

## 8. Success Criteria

| Criterion | Target |
| :--- | :--- |
| Time to First Token | < 500ms |
| Auth Success Rate | 100% with valid credentials |
| Message Delivery | 100% for sent messages |
| Session List | Display last 5 sessions |
| Code Block Rendering | Proper syntax highlighting |
