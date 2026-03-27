# Implementation Plan - Track: auth_chat_20260327

## Phase 1: Project Foundation

### Setup

- [x] Task: Initialize Expo project with pnpm
- [x] Task: Configure TypeScript strict mode
- [x] Task: Install and configure Vitest
- [x] Task: Install core dependencies (Tamagui, Zustand, expo-router)
- [x] Task: Configure ESLint and Prettier
- [~] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)

---

## Phase 2: Authentication Module

### Auth Store

- [x] Task: Write tests for authStore (commit: 7079d76)
  - [x] Test initial state
  - [x] Test login with valid credentials
  - [x] Test login failure handling
  - [x] Test logout clears state
- [x] Task: Implement authStore with Zustand (commit: 7079d76)
  - [x] Define AuthStore interface
  - [x] Implement login action with credential validation
  - [x] Implement logout action
  - [x] Add persistence middleware
- [x] Task: Conductor - User Manual Verification 'Phase 2a' (Protocol in workflow.md)

### Auth Screen & Components

- [x] Task: Write tests for AuthScreen component (commit: 470626d)
  - [x] Test form rendering
  - [x] Test validation errors display
  - [x] Test loading state during login
- [x] Task: Implement AuthScreen component
  - [x] Create URL input field
  - [x] Create password input field
  - [x] Create connect button
  - [x] Add error handling UI
- [x] Task: Write tests for Input and Button components (deferred - using RN built-ins for MVP)
- [x] Task: Implement Input and Button base components (deferred - using React Native built-ins for MVP)
- [x] Task: Conductor - User Manual Verification 'Phase 2b' (Protocol in workflow.md) [checkpoint: 420f7bd]

---

## Phase 3: Live Chat Module

### Chat Store

- [x] Task: Write tests for chatStore (commit: a722766)
  - [x] Test initial state
  - [x] Test addMessage action
  - [x] Test streaming token append
  - [x] Test message list rendering
- [x] Task: Implement chatStore with Zustand (commit: 7acd83f)
  - [x] Define ChatStore interface
  - [x] Implement message actions
  - [x] Add streaming support
- [ ] Task: Conductor - User Manual Verification 'Phase 3a' (Protocol in workflow.md)

### Chat Screen & Components

- [x] Task: Write tests for ChatBubble component (commit: 0c2a981)
  - [x] Test user bubble rendering
  - [x] Test agent bubble rendering
  - [x] Test code block display
- [x] Task: Implement ChatBubble component (commit: e523dff)
  - [x] Create user message bubble (right-aligned, blue)
  - [x] Create agent message bubble (left-aligned, gray)
  - [x] Add code block support with syntax highlighting (deferred to CodeBlock component)
- [x] Task: Write tests for CodeBlock component (commit: 9aebc49)
- [x] Task: Implement CodeBlock component (commit: 729104e)
  - [x] Create markdown renderer
  - [x] Add syntax highlighting
  - [x] Apply JetBrains Mono font
- [x] Task: Write tests for MessageList component (commit: bfa190d)
- [x] Task: Implement MessageList component (commit: 689e1e5)
  - [x] Create scrollable message container
  - [x] Auto-scroll to bottom on new message
  - [x] Handle streaming messages
- [x] Task: Write tests for ChatInput component (commit: feb5f0a)
- [x] Task: Implement ChatInput component (commit: bd09ced)
  - [x] Create text input field
  - [x] Create send button
  - [x] Add disabled state during streaming
- [x] Task: Write tests for ChatScreen integration (commit: cdd6203)
- [x] Task: Implement ChatScreen (commit: 5ec0934)
  - [x] Wire up all chat components
  - [x] Connect to OpenCode SDK streaming
  - [x] Add header with session info
- [ ] Task: Conductor - User Manual Verification 'Phase 3b' (Protocol in workflow.md)

---

## Phase 4: Session Management Module

### Session Store

- [x] Task: Write tests for sessionStore (commit: b57cccc)
  - [x] Test loadSessions action
  - [x] Test selectSession action
  - [x] Test session persistence
- [x] Task: Implement sessionStore with Zustand (commit: b57cccc)
  - [x] Define SessionStore interface
  - [x] Implement session list loading
  - [x] Implement session selection
- [ ] Task: Conductor - User Manual Verification 'Phase 4a' (Protocol in workflow.md)

### Session Screen & Components

- [ ] Task: Write tests for SessionCard component
  - [ ] Test card rendering with session data
  - [ ] Test click handler
- [ ] Task: Implement SessionCard component
  - [ ] Display session name
  - [ ] Display last activity time
  - [ ] Add touch feedback
- [ ] Task: Write tests for SessionList component
- [ ] Task: Implement SessionList component
  - [ ] Create flat list of sessions
  - [ ] Add pull-to-refresh
  - [ ] Handle empty state
- [ ] Task: Write tests for SessionsScreen integration
- [ ] Task: Implement SessionsScreen
  - [ ] Wire up session components
  - [ ] Connect to sessionStore
- [ ] Task: Conductor - User Manual Verification 'Phase 4b' (Protocol in workflow.md)

---

## Phase 5: Settings Module

### Settings Screen

- [ ] Task: Write tests for SettingsScreen
  - [ ] Test displays server URL
  - [ ] Test logout button
- [ ] Task: Implement SettingsScreen
  - [ ] Display connected server URL
  - [ ] Add disconnect button
  - [ ] Show app version
- [ ] Task: Conductor - User Manual Verification 'Phase 5' (Protocol in workflow.md)

---

## Phase 6: Navigation & Integration

### Navigation Setup

- [ ] Task: Configure expo-router
  - [ ] Set up root layout
  - [ ] Configure tab navigator
  - [ ] Set up auth gate
- [ ] Task: Write tests for navigation
- [ ] Task: Implement navigation flow
  - [ ] Root layout with auth check
  - [ ] Tab bar with icons
  - [ ] Deep linking support
- [ ] Task: Conductor - User Manual Verification 'Phase 6a' (Protocol in workflow.md)

### End-to-End Integration

- [ ] Task: Integrate all modules
  - [ ] Connect auth to chat
  - [ ] Connect sessions to chat
  - [ ] Test complete user flow
- [ ] Task: Write E2E test scenarios
- [ ] Task: Run full test suite
- [ ] Task: Conductor - User Manual Verification 'Phase 6b' (Protocol in workflow.md)

---

## Phase 7: Final Verification & Polish

### Quality Checks

- [ ] Task: Run full test suite with coverage
- [ ] Task: Run ESLint and fix issues
- [ ] Task: Verify iOS build
- [ ] Task: Verify Android build
- [ ] Task: Conductor - User Manual Verification 'Phase 7' (Protocol in workflow.md)

### Completion

- [ ] Task: Create final checkpoint commit
- [ ] Task: Update tracks.md with completed status
