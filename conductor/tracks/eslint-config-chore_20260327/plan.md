# Implementation Plan: eslint-config-chore_20260327

## Phase 1: Fix ESLint Configuration

- [x] Task: Downgrade ESLint from v10.1.0 to v9.x in package.json
- [x] Task: Update eslint.config.mjs for ESLint 9 compatibility (if needed)
- [x] Task: Verify ESLint runs without errors (`pnpm lint`)
- [x] Task: Conductor - User Manual Verification 'Phase 1: ESLint Configuration' (Protocol in workflow.md)

## Phase 2: Add Prettier Configuration

- [x] Task: Create .prettierrc with Expo-recommended settings
- [x] Task: Verify Prettier works (`pnpm format`)
- [x] Task: Conductor - User Manual Verification 'Phase 2: Prettier Configuration' (Protocol in workflow.md)

## Phase 3: Configure Pre-commit Checks

- [x] Task: Add typecheck script to package.json ("typecheck": "tsc --noEmit") f15274e
- [x] Task: Create scripts/check-line-count.js to reject files > 500 lines 5167df8
- [x] Task: Install lint-staged and configure in package.json 2b1c25c
- [x] Task: Configure lint-staged to run: ESLint+Prettier, typecheck, line count 2b1c25c
- [~] Task: Test pre-commit hook manually
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Pre-commit Checks' (Protocol in workflow.md)
