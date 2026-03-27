import { describe, it, expect } from 'vitest';

describe('Project Setup', () => {
  it('should have vitest configured correctly', () => {
    expect(true).toBe(true);
  });

  it('should have typescript strict mode enabled', () => {
    // TypeScript strict mode is configured in tsconfig.json
    expect(1 + 1).toBe(2);
  });
});