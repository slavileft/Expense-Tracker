import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import KeyboardScreen from '../components/KeyboardScreen';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validateRequiredPassword, hasNoErrors } from '../utils/validation';
import { colors } from '../theme';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setServerError('');

    const newErrors = {
      email: validateEmail(email),
      password: validateRequiredPassword(password),
    };
    setErrors(newErrors);
    if (!hasNoErrors(newErrors)) return;

    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      setServerError(error.message);
      setLoading(false);
    }
  }

  return (
    <KeyboardScreen>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Log in to track your expenses</Text>

      <FormInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        placeholder="you@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <FormInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        placeholder="Your password"
        secureTextEntry
      />

      {serverError ? <Text style={styles.serverError}>{serverError}</Text> : null}

      <PrimaryButton title="Log in" onPress={handleLogin} loading={loading} />

      <Pressable onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </Pressable>
    </KeyboardScreen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700', color: colors.text, marginTop: 40 },
  subtitle: { fontSize: 15, color: colors.muted, marginTop: 4, marginBottom: 28 },
  serverError: {
    color: colors.danger,
    backgroundColor: colors.dangerLight,
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  link: { color: colors.primary, textAlign: 'center', marginTop: 20, fontSize: 15 },
});
