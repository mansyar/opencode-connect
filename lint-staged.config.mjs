export default {
  '**/*.{ts,tsx,js,jsx}': [
    'pnpm lint --fix',
    'pnpm format',
    'node scripts/check-line-count.js',
  ],
  // Run typecheck on the whole project if any TS files change
  '**/*.{ts,tsx}': [
    () => 'pnpm typecheck',
  ],
};
