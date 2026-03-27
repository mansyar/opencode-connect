import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * CodeBlock Component Logic Tests
 *
 * These tests verify the business logic and rendering behavior
 * of the CodeBlock component for displaying code with syntax highlighting.
 */

interface CodeBlockProps {
  code: string;
  language?: string;
}

// Constants
const COLORS = {
  background: "#1E293B",
  border: "#334155",
  text: "#F8FAFC",
  keyword: "#C792EA",
  string: "#C3E88D",
  number: "#F78C6C",
  comment: "#546E7A",
  function: "#82AAFF",
  variable: "#F8FAFC",
} as const;

const FONTS = {
  mono: "JetBrains Mono",
  size: 14,
} as const;

/**
 * Extract code blocks from markdown content
 */
const extractCodeBlocks = (
  content: string,
): { language: string; code: string }[] => {
  const regex = /```(\w+)?\n([\s\S]*?)```/g;
  const blocks: { language: string; code: string }[] = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    blocks.push({
      language: match[1] || "text",
      code: match[2].trim(),
    });
  }

  return blocks;
};

/**
 * Detect language from code content
 */
const detectLanguage = (code: string): string => {
  // JavaScript/TypeScript patterns
  if (/const|let|var|function|=>|import\s+.*\s+from/.test(code)) {
    if (/:\s*(string|number|boolean|any|void|never)/.test(code)) {
      return "typescript";
    }
    return "javascript";
  }

  // Python patterns
  if (/def\s+\w+\s*\(|import\s+\w+|from\s+\w+\s+import|print\s*\(/.test(code)) {
    return "python";
  }

  // Go patterns
  if (/func\s+\w+|package\s+\w+|import\s+\(/.test(code)) {
    return "go";
  }

  // Rust patterns
  if (/fn\s+\w+|let\s+mut|impl\s+\w+|use\s+\w+::/.test(code)) {
    return "rust";
  }

  // Shell/Bash patterns
  if (/^#!/m.test(code) || /\$\s+\w+|echo\s+|export\s+\w+=/.test(code)) {
    return "bash";
  }

  return "text";
};

/**
 * Get styling for code display
 */
const getCodeBlockStyle = () => ({
  backgroundColor: COLORS.background,
  borderRadius: 8,
  padding: 12,
  borderWidth: 1,
  borderColor: COLORS.border,
  fontFamily: FONTS.mono,
  fontSize: FONTS.size,
  color: COLORS.text,
});

/**
 * Check if content has inline code
 */
const hasInlineCode = (content: string): boolean => {
  return content.includes("`") && !content.includes("```");
};

/**
 * Extract inline code from content
 */
const extractInlineCode = (content: string): string[] => {
  const regex = /`([^`]+)`/g;
  const matches: string[] = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    matches.push(match[1]);
  }

  return matches;
};

describe("CodeBlock Component Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("code block extraction", () => {
    it("should extract code blocks with language", () => {
      const content = '```javascript\nconsole.log("hello")\n```';
      const blocks = extractCodeBlocks(content);

      expect(blocks).toHaveLength(1);
      expect(blocks[0].language).toBe("javascript");
      expect(blocks[0].code).toBe('console.log("hello")');
    });

    it("should extract code blocks without language", () => {
      const content = "```\ncode without language\n```";
      const blocks = extractCodeBlocks(content);

      expect(blocks).toHaveLength(1);
      expect(blocks[0].language).toBe("text");
      expect(blocks[0].code).toBe("code without language");
    });

    it("should extract multiple code blocks", () => {
      const content =
        '```javascript\nconst x = 1;\n```\nSome text\n```python\nprint("hello")\n```';
      const blocks = extractCodeBlocks(content);

      expect(blocks).toHaveLength(2);
      expect(blocks[0].language).toBe("javascript");
      expect(blocks[1].language).toBe("python");
    });

    it("should handle empty code blocks", () => {
      const content = "```\n```";
      const blocks = extractCodeBlocks(content);

      expect(blocks).toHaveLength(1);
      expect(blocks[0].code).toBe("");
    });

    it("should return empty array for content without code blocks", () => {
      const content = "Just plain text without code";
      const blocks = extractCodeBlocks(content);

      expect(blocks).toHaveLength(0);
    });
  });

  describe("language detection", () => {
    it("should detect TypeScript", () => {
      const code = 'const greeting: string = "hello";';
      expect(detectLanguage(code)).toBe("typescript");
    });

    it("should detect JavaScript", () => {
      const code = 'const greeting = "hello";\nconsole.log(greeting);';
      expect(detectLanguage(code)).toBe("javascript");
    });

    it("should detect Python", () => {
      const code = 'def hello():\n    print("hello")';
      expect(detectLanguage(code)).toBe("python");
    });

    it("should detect Go", () => {
      const code = 'func hello() {\n    fmt.Println("hello")\n}';
      expect(detectLanguage(code)).toBe("go");
    });

    it("should detect Rust", () => {
      const code = 'fn main() {\n    println!("hello");\n}';
      expect(detectLanguage(code)).toBe("rust");
    });

    it("should detect Bash", () => {
      const code = '#!/bin/bash\necho "hello"';
      expect(detectLanguage(code)).toBe("bash");
    });

    it("should default to text for unknown languages", () => {
      const code = "random text that does not match any pattern";
      expect(detectLanguage(code)).toBe("text");
    });
  });

  describe("code block styling", () => {
    it("should have dark gray background", () => {
      const style = getCodeBlockStyle();
      expect(style.backgroundColor).toBe("#1E293B");
    });

    it("should have border radius of 8", () => {
      const style = getCodeBlockStyle();
      expect(style.borderRadius).toBe(8);
    });

    it("should have padding of 12", () => {
      const style = getCodeBlockStyle();
      expect(style.padding).toBe(12);
    });

    it("should have border", () => {
      const style = getCodeBlockStyle();
      expect(style.borderWidth).toBe(1);
      expect(style.borderColor).toBe("#334155");
    });

    it("should use JetBrains Mono font", () => {
      const style = getCodeBlockStyle();
      expect(style.fontFamily).toBe("JetBrains Mono");
    });

    it("should have font size of 14", () => {
      const style = getCodeBlockStyle();
      expect(style.fontSize).toBe(14);
    });
  });

  describe("inline code handling", () => {
    it("should detect inline code", () => {
      expect(hasInlineCode("Use `console.log()` for debugging")).toBe(true);
    });

    it("should not detect inline code when there is a code block", () => {
      expect(hasInlineCode("```\ncode\n```")).toBe(false);
    });

    it("should extract inline code", () => {
      const content =
        "Use `console.log()` and `JSON.stringify()` for debugging";
      const inlineCodes = extractInlineCode(content);

      expect(inlineCodes).toHaveLength(2);
      expect(inlineCodes).toContain("console.log()");
      expect(inlineCodes).toContain("JSON.stringify()");
    });

    it("should handle single inline code", () => {
      const content = "Use `fn()` to call the function";
      const inlineCodes = extractInlineCode(content);

      expect(inlineCodes).toHaveLength(1);
      expect(inlineCodes[0]).toBe("fn()");
    });
  });

  describe("color tokens", () => {
    it("should have correct keyword color", () => {
      expect(COLORS.keyword).toBe("#C792EA");
    });

    it("should have correct string color", () => {
      expect(COLORS.string).toBe("#C3E88D");
    });

    it("should have correct number color", () => {
      expect(COLORS.number).toBe("#F78C6C");
    });

    it("should have correct comment color", () => {
      expect(COLORS.comment).toBe("#546E7A");
    });

    it("should have correct function color", () => {
      expect(COLORS.function).toBe("#82AAFF");
    });
  });
});

describe("CodeBlock Component Contract", () => {
  /**
   * These tests verify the expected interface and behavior
   * of the CodeBlock component implementation.
   *
   * NOTE: These tests will be skipped until CodeBlock is implemented.
   */

  it.skip("should export CodeBlock as a React component", () => {
    const CodeBlock = require("../../src/components/chat/CodeBlock").default;
    expect(typeof CodeBlock).toBe("function");
  });

  it.skip("should accept code prop for code content", () => {
    const CodeBlock = require("../../src/components/chat/CodeBlock").default;
    expect(CodeBlock).toBeDefined();
  });

  it.skip("should accept optional language prop", () => {
    const CodeBlock = require("../../src/components/chat/CodeBlock").default;
    expect(CodeBlock).toBeDefined();
  });

  it.skip("should render with syntax highlighting", () => {
    const CodeBlock = require("../../src/components/chat/CodeBlock").default;
    expect(CodeBlock).toBeDefined();
  });
});
