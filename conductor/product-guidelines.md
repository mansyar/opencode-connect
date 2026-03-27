# Product Guidelines - OpenCode Connect

## 1. Visual Design

### 1.1 Color Palette

| Role | Color | Hex | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | Deep Blue | `#1E3A5F` | Primary buttons, headers, navigation |
| **Secondary** | Slate Gray | `#64748B` | Secondary text, borders, icons |
| **Accent** | Electric Cyan | `#06B6D4` | Active states, links, highlights |
| **Background** | Dark Charcoal | `#0F172A` | Main background (dark mode default) |
| **Surface** | Dark Gray | `#1E293B` | Cards, input fields, elevated surfaces |
| **Text Primary** | Off White | `#F8FAFC` | Primary text content |
| **Text Secondary** | Cool Gray | `#94A3B8` | Secondary text, placeholders |
| **Success** | Emerald | `#10B981` | Success states, confirmations |
| **Warning** | Amber | `#F59E0B` | Warning states, caution |
| **Error** | Rose | `#F43F5E` | Error states, destructive actions |

### 1.2 Typography

| Element | Font | Size | Weight | Line Height |
| :--- | :--- | :--- | :--- | :--- |
| **H1 (Screen Title)** | System Default | 28px | Bold (700) | 1.2 |
| **H2 (Section Header)** | System Default | 22px | Semibold (600) | 1.3 |
| **H3 (Card Title)** | System Default | 18px | Semibold (600) | 1.4 |
| **Body Text** | System Default | 16px | Regular (400) | 1.5 |
| **Caption** | System Default | 14px | Regular (400) | 1.4 |
| **Code/Mono** | JetBrains Mono | 14px | Regular (400) | 1.6 |

### 1.3 Spacing System (8pt Grid)

| Token | Value | Usage |
| :--- | :--- | :--- |
| `xs` | 4px | Tight spacing, icon gaps |
| `sm` | 8px | Compact elements, inline spacing |
| `md` | 16px | Standard padding, margins |
| `lg` | 24px | Section spacing, card padding |
| `xl` | 32px | Large gaps, screen padding |
| `2xl` | 48px | Major section breaks |

### 1.4 Border Radius

| Token | Value | Usage |
| :--- | :--- | :--- |
| `sm` | 4px | Small inputs, chips |
| `md` | 8px | Buttons, cards |
| `lg` | 12px | Modals, sheets |
| `full` | 9999px | Pills, avatars |

---

## 2. User Experience Principles

### 2.1 Core UX Values

1. **Clarity First:** Every screen must have a single primary action. Avoid ambiguity.
2. **Touch-Friendly:** Minimum touch target size of 44x44 points.
3. **Feedback Always:** Every interaction must provide immediate visual or haptic feedback.
4. **Resilient Connectivity:** Assume intermittent connectivity. Queue actions and sync gracefully.
5. **Progressive Disclosure:** Show essential features first; reveal advanced options on demand.

### 2.2 Navigation Patterns

- **Bottom Tab Navigation:** For main sections (Chat, Sessions, Settings)
- **Stack Navigation:** For detail screens and flows
- **Modal Sheets:** For quick actions and confirmations
- **Pull-to-Refresh:** For list views and chat history

### 2.3 Interaction Guidelines

| Action | Feedback |
| :--- | :--- |
| Button Press | Scale down to 0.96, then back; optional haptic |
| Voice Recording | Pulsing border animation, waveform display |
| Send Message | Message appears immediately, loading indicator |
| Long Operation | Show progress bar, allow background continuation |
| Error | Toast notification with retry action |

---

## 3. Branding Guidelines

### 3.1 App Identity

- **App Name:** OpenCode Connect
- **App Icon:** Monogram "OC" with cyan accent, dark background
- **Tagline:** "Code Anywhere, Voice First"

### 3.2 Logo Usage

- **Primary Logo:** Full text "OpenCode Connect" with icon
- **Icon Only:** For tab bar and favicon (minimum 24px)
- **Clear Space:** 8px minimum around logo

### 3.3 Tone of Voice

| Context | Tone |
| :--- | :--- |
| Onboarding | Welcoming, encouraging, brief |
| Chat Interface | Professional, precise, technical |
| Errors | Calm, helpful, actionable |
| Success | Confident, subtle, celebratory |

---

## 4. Component Guidelines

### 4.1 Buttons

| Type | Background | Text | Border | Usage |
| :--- | :--- | :--- | :--- | :--- |
| Primary | `#06B6D4` | White | None | Main actions |
| Secondary | Transparent | `#06B6D4` | `#06B6D4` | Secondary actions |
| Ghost | Transparent | `#94A3B8` | None | Tertiary actions |
| Destructive | `#F43F5E` | White | None | Delete, logout |

### 4.2 Input Fields

- **Background:** `#1E293B`
- **Border:** `#334155` (default), `#06B6D4` (focused)
- **Placeholder:** `#64748B`
- **Text:** `#F8FAFC`
- **Padding:** 12px horizontal, 14px vertical

### 4.3 Chat Bubbles

| Sender | Background | Text | Alignment |
| :--- | :--- | :--- | :--- |
| User | `#1E3A5F` | `#F8FAFC` | Right |
| Agent | `#1E293B` | `#F8FAFC` | Left |
| System | Transparent | `#94A3B8` | Center |

### 4.4 Code Blocks

- **Background:** `#0F172A`
- **Border:** `#334155`
- **Font:** JetBrains Mono, 14px
- **Line Numbers:** `#64748B`
- **Syntax Highlighting:** GitHub Dark theme colors

---

## 5. Accessibility

- **Color Contrast:** Minimum 4.5:1 for normal text, 3:1 for large text
- **Screen Reader:** All interactive elements have accessible labels
- **Reduce Motion:** Respect system preference, disable animations if needed
- **Font Scaling:** Support up to 200% text size without layout breaking
