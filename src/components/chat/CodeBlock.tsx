import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

/**
 * CodeBlock Component
 *
 * Displays code with syntax highlighting using react-syntax-highlighter.
 * Supports multiple programming languages.
 */
export interface CodeBlockProps {
  code: string;
  language?: string;
}

const COLORS = {
  background: '#1E293B',
  border: '#334155',
  text: '#F8FAFC',
} as const;

const FONTS = {
  mono: 'JetBrains Mono',
  size: 14,
} as const;

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'text' }) => {
  // Normalize language for react-syntax-highlighter
  const normalizeLanguage = (lang: string): string => {
    const languageMap: Record<string, string> = {
      js: 'javascript',
      ts: 'typescript',
      py: 'python',
      rb: 'ruby',
      sh: 'bash',
      shell: 'bash',
      yml: 'yaml',
    };
    return languageMap[lang.toLowerCase()] || lang;
  };

  try {
    return (
      <View style={styles.container}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <SyntaxHighlighter
            language={normalizeLanguage(language)}
            style={atomOneDark}
            customStyle={styles.codeContainer}
            codeTagProps={{ style: styles.codeTag }}
          >
            {code}
          </SyntaxHighlighter>
        </ScrollView>
      </View>
    );
  } catch {
    // Fallback for unsupported languages
    return (
      <View style={styles.container}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.fallbackContainer}>
            <Text style={styles.fallbackText}>{code}</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginVertical: 4,
    overflow: 'hidden',
  },
  codeContainer: {
    backgroundColor: 'transparent',
    padding: 12,
    margin: 0,
  },
  codeTag: {
    fontFamily: FONTS.mono,
    fontSize: FONTS.size,
  },
  fallbackContainer: {
    padding: 12,
  },
  fallbackText: {
    fontFamily: FONTS.mono,
    fontSize: FONTS.size,
    color: COLORS.text,
  },
});

export default CodeBlock;
