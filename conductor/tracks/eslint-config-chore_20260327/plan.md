# Implementation Plan: eslint-config-chore_20260327

## Phase 1: Fix ESLint Configuration

- [ ] Task: Downgrade ESLint from v10.1.0 to v9.x in package.json
- [ ] Task: Update eslint.config.mjs for ESLint 9 compatibility (if needed)
- [ ] Task: Verify ESLint runs without errors (`pnpm lint`)
- [ ] Task: Conductor - User Manual Verification 'Phase 1: ESLint Configuration' (Protocol in workflow.md)

## Phase 2: Add Prettier Configuration

- [ ] Task: Create .prettierrc with Expo-recommended settings
- [ ] Task: Verify Prettier works (`pnpm format`)
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Prettier Configuration' (Protocol in workflow.md)

## Phase 3: Configure Pre-commit Checks

- [ ] Task: Add typecheck script to package.json ("typecheck": "tsc --noEmit")
- [ ] Task: Create scripts/check-line-count.js to reject files > 500 lines
- [ ] Task: Install lint-staged and configure in package.json
- [ ] Task: Configure lint-staged to run: ESLint+Prettier, typecheck, line count
- [ ] Task: Test pre-commit hook manually
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Pre-commit Checks' (Protocol in workflow.md)
