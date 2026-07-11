import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router, Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../src/services/auth';
import { useAuthStore } from '../../src/stores/auth';

export default function SignupScreen() {
  const { t } = useTranslation();
  const { setAuthenticated, setUserId } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) return;
    if (password !== confirmPassword) {
      Alert.alert(t('common.error'), 'Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (data.user) {
        setUserId(data.user.id);
        setAuthenticated(true);
        router.replace('/(main)');
      }
    } catch (err: any) {
      Alert.alert(t('common.error'), err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('auth.signup.title')}</Text>

      <TextInput
        style={styles.input}
        placeholder={t('auth.signup.email')}
        placeholderTextColor="#5F6E80"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder={t('auth.signup.password')}
        placeholderTextColor="#5F6E80"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder={t('auth.signup.confirmPassword')}
        placeholderTextColor="#5F6E80"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? t('common.loading') : t('auth.signup.cta')}
        </Text>
      </TouchableOpacity>

      <Link href="/(auth)/login" asChild>
        <TouchableOpacity style={styles.loginLink}>
          <Text style={styles.loginText}>{t('auth.signup.login')}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1020',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F4F7FA',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#172237',
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    color: '#F4F7FA',
    borderWidth: 1,
    borderColor: '#2A3850',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#79C7C3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#0B1020',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#AAB6C6',
    fontSize: 14,
  },
});
