import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../stores/authStore';

/**
 * AuthScreen - Login screen for OpenCode Connect
 *
 * Provides authentication via Tailscale server URL and password.
 * Uses SecureStore for credential persistence.
 */
export default function AuthScreen() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [url, setUrl] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleLogin = async () => {
    // Clear previous errors
    clearError();
    setValidationError(null);

    // Validate inputs
    if (!url || !password) {
      setValidationError('URL and password are required');
      return;
    }

    try {
      new URL(url);
    } catch {
      setValidationError('Invalid URL format');
      return;
    }

    // Attempt login
    try {
      await login(url, password);
      // Navigate to chat on success
      router.replace('/(tabs)/chat');
    } catch {
      // Error is handled by the store
    }
  };

  const displayError = validationError || error;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>OpenCode Connect</Text>
          <Text style={styles.subtitle}>Connect to your AI coding agent</Text>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tailscale URL</Text>
            <TextInput
              style={styles.input}
              placeholder="http://laptop.tailnet-name.ts.net:4096"
              placeholderTextColor="#64748B"
              value={url}
              onChangeText={setUrl}
              editable={!isLoading}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              testID="url-input"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your server password"
              placeholderTextColor="#64748B"
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
              secureTextEntry
              testID="password-input"
            />
          </View>

          {displayError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{displayError}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            testID="connect-button"
          >
            {isLoading ? (
              <ActivityIndicator color="#F8FAFC" />
            ) : (
              <Text style={styles.buttonText}>Connect</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Your credentials are stored securely using expo-secure-store
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#334155',
  },
  errorContainer: {
    backgroundColor: '#7F1D1D',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#06B6D4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 48,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
});
