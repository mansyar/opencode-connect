# PRD: OpenCode Connect

## 1. Executive Summary
OpenCode Connect is a high-performance React Native (Expo) application designed to serve as a remote interface for the OpenCode AI coding agent. By leveraging Tailscale for secure networking and the official OpenCode SDK, the app allows developers to direct their AI agents, monitor long-running tasks, and review code changes from a mobile device.

---

## 2. Target Audience
* Developers using OpenCode who need to manage coding tasks while away from their primary workstation.
* Users looking for a "voice-first" coding experience to brainstorm or implement logic via high-level instructions.

---

## 3. Core Functional Requirements

### 3.1 Connectivity & Security (The "Single Server" Logic)
* **Tailscale Integration:** Support connection via MagicDNS/IP (e.g., `http://laptop.tailnet-name.ts.net:4096`).
* **Authentication:** Support HTTP Basic Auth via `OPENCODE_SERVER_PASSWORD`.
* **Credential Storage:** Securely store the URL and credentials using `expo-secure-store`.

### 3.2 Chat & Execution (MVP Focus)
* **Streaming Chat Window:** Real-time token streaming from the agent via Server-Sent Events (SSE).
* **Speech-to-Text (STT):** Primary input method using native mobile recognition to bypass keyboard friction.
* **Session Persistence:** Fetch and display the last 5 active sessions from the server.
* **Simplified Diff View:** Render code changes as Markdown-styled patches (`+` / `-`) within the chat flow for the MVP.

### 3.3 Advanced Interface (V1.1+)
* **Model Selection:** UI to browse and select available LLMs (e.g., Claude, GPT, local Llama) provided by the server's configured backends.
* **Agent Selection:** UI to toggle between different agent profiles (Plan, Build, Custom).
* **Slash Command Overlay:** A "/" triggered menu to quickly execute commands like `/undo` or `/share`.
* **Terminal Output:** A read-only, monospaced log view showing the last 10-20 lines of server-side bash execution.
* **High-Fidelity Diff Viewer:** A specialized component for side-by-side or unified diffs for complex reviews.

---

## 4. Technical Stack
* **Framework:** Expo (React Native) + TypeScript.
* **SDK:** `@opencode-ai/sdk` (official).
* **Networking:** Axios (HTTP) + `react-native-sse` or Native Fetch (Streaming).
* **State Management:** Zustand (lightweight for session and connection state).
* **UI Components:** Tamagui or React Native Paper (for consistent cross-platform styling).

---

## 5. User Experience (UX)
* **Font:** Monospace font (JetBrains Mono) for all code snippets and logs.
* **Feedback:** Haptic feedback on message completion or successful command execution.
* **Reconnection:** Automatic "Silent Reconnect" logic when switching between Wi-Fi and Cellular networks over Tailscale.

---

## 6. MVP Roadmap (Phase 1)

| Feature | Description | Implementation |
| :--- | :--- | :--- |
| **Auth Screen** | Input for Tailscale URL and Password. | Expo Secure Store |
| **Live Chat** | Real-time text streaming from OpenCode. | SSE + @opencode-ai/sdk |
| **Voice Coding** | Tap-to-talk coding instructions. | expo-speech-recognition |
| **Session List** | List and switch between recent projects. | `client.session.list()` |
| **Basic Diffs** | View changes in Markdown code blocks. | Markdown rendering |

---

## 7. Success Metrics
* **Time to First Token:** < 500ms over a Tailscale connection.
* **Voice Accuracy:** > 90% accuracy for standard coding prompts.
* **Stability:** 0% crash rate during long-running streaming sessions.