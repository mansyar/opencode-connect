#!/usr/bin/env node

/**
 * Script to check the line count of files.
 * Rejects files exceeding 500 lines.
 */
const fs = require('fs');

const MAX_LINES = 500;
const SUPPORTED_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

const files = process.argv.slice(2);
let errorCount = 0;

if (files.length === 0) {
  process.exit(0);
}

files.forEach((filePath) => {
  const extension = '.' + filePath.split('.').pop();
  if (!SUPPORTED_EXTENSIONS.includes(extension)) {
    return;
  }

  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').length;

  if (lines > MAX_LINES) {
    console.error(`Error: File '${filePath}' exceeds the limit of ${MAX_LINES} lines (${lines}).`);
    errorCount++;
  }
});

if (errorCount > 0) {
  process.exit(1);
} else {
  console.log(`All files are within the line count limit (${MAX_LINES} lines).`);
  process.exit(0);
}
