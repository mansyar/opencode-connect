import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import { spawnSync } from 'child_process';
import path from 'path';

describe('check-line-count.js', () => {
  const scriptPath = path.resolve(__dirname, '../../scripts/check-line-count.js');
  const tempDir = path.resolve(__dirname, '../../tmp/test-line-count');

  // Helper to create a file with a specific number of lines
  const createTestFile = (fileName: string, lineCount: number) => {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const filePath = path.join(tempDir, fileName);
    const content = Array(lineCount).fill('line').join('\n');
    fs.writeFileSync(filePath, content);
    return filePath;
  };

  it('should fail if a file exceeds 500 lines', () => {
    const largeFile = createTestFile('large-file.ts', 501);
    
    const result = spawnSync('node', [scriptPath, largeFile]);
    
    expect(result.status).toBe(1);
    expect(result.stderr.toString()).toContain('exceeds the limit of 500 lines');
  });

  it('should pass if all files are 500 lines or fewer', () => {
    const normalFile = createTestFile('normal-file.ts', 500);
    const smallFile = createTestFile('small-file.ts', 10);
    
    const result = spawnSync('node', [scriptPath, normalFile, smallFile]);
    
    expect(result.status).toBe(0);
    expect(result.stdout.toString()).toContain('All files are within the line count limit');
  });

  it('should only check .ts, .tsx, .js, .jsx files', () => {
    const largeJsonFile = createTestFile('large-file.json', 1000);
    
    const result = spawnSync('node', [scriptPath, largeJsonFile]);
    
    // Should pass because it's a JSON file
    expect(result.status).toBe(0);
  });
});
