# OpenCode Connect - Product Definition

## 1. Overview

OpenCode Connect is a high-performance React Native (Expo) application designed to serve as a remote interface for the OpenCode AI coding agent. By leveraging Tailscale for secure networking and the official OpenCode SDK, the app allows developers to direct their AI agents, monitor long-running tasks, and review code changes from a mobile device.

---

## 2. Target Audience

- **Primary:** Developers using OpenCode who need to manage coding tasks while away from their primary workstation.
- **Secondary:** Users looking for a "voice-first" coding experience to brainstorm or implement logic via high-level instructions.

---

## 3. Core Features

### 3.1 MVP Features (Phase 1)

| Feature | Description | Implementation |
| :--- | :--- | :--- |
| **Auth Screen** | Input for Tailscale URL and Password | Expo Secure Store |
| **Live Chat** | Real-time text streaming from OpenCode | SSE + @opencode-ai/sdk |
| **Voice Coding** | Tap-to-talk coding instructions | expo-speech-recognition |
| **Session List** | List and switch between recent projects | `client.session.list()` |
| **Basic Diffs** | View changes in Markdown code blocks | Markdown rendering |

### 3.2 Advanced Features (V1.1+)

| Feature | Description |
| :--- | :--- |
| **Model Selection** | UI to browse and select available LLMs (Claude, GPT, local Llama) |
| **Agent Selection** | UI to toggle between different agent profiles (Plan, Build, Custom) |
| **Slash Command Overlay** | "/" triggered menu for commands like `/undo` or `/share` |
| **Terminal Output** | Read-only monospaced log view (last 10-20 lines) |
| **High-Fidelity Diff Viewer** | Side-by-side or unified diffs for complex reviews |

---

## 4. Connectivity & Security

- **Tailscale Integration:** Support connection via MagicDNS/IP (e.g., `http://laptop.tailnet-name.ts.net:4096`)
- **Authentication:** HTTP Basic Auth via `OPENCODE_SERVER_PASSWORD`
- **Credential Storage:** Expo Secure Store for URL and credentials

---

## 5. Technical Stack

| Component | Technology |
| :--- | :--- |
| Framework | Expo (React Native) + TypeScript |
| SDK | @opencode-ai/sdk (official) |
| HTTP Client | Axios |
| Streaming | react-native-sse or Native Fetch |
| State Management | Zustand |
| UI Components | Tamagui or React Native Paper |

---

## 6. User Experience

- **Font:** Monospace font (JetBrains Mono) for code snippets and logs
- **Feedback:** Haptic feedback on message completion or successful command execution
- **Reconnection:** Automatic silent reconnect when switching between Wi-Fi and Cellular over Tailscale

---

## 7. Success Metrics

| Metric | Target |
| :--- | :--- |
| Time to First Token | < 500ms over Tailscale connection |
| Voice Accuracy | > 90% for standard coding prompts |
| Stability | 0% crash rate during long-running streaming sessions |

---

## 8. Non-Functional Requirements

- **Performance:** Sub-500ms latency for streaming responses
- **Security:** All credentials stored securely via expo-secure-store
- **Offline:** Graceful degradation with clear offline state indicators
- **Cross-Platform:** iOS and Android support via Expo
