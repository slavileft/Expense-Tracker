import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import KeyboardScreen from '../components/KeyboardScreen';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import {
  validateEmail,
  validateNewPassword,
  validateConfirmPassword,
  hasNoErrors,
} from '../utils/validation';
import { colors } from '../theme';

export default function RegisterScreen({ navigation }) {
  const { signUp } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setServerError('');

    const newErrors = {
      email: validateEmail(email),
      password: validateNewPassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    };
    setErrors(newErrors);
    if (!hasNoErrors(newErrors)) return;

    setLoading(true);
    try {
      await signUp(email, password);
    } catch (error) {
      setServerError(error.message);
      setLoading(false);
    }
  }

  return (
    <KeyboardScreen>
      <Text style={styles.title}>Create account</Text>
      <Text style={styles.subtitle}>Start tracking your spending today</Text>

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
        placeholder="At least 6 characters"
        secureTextEntry
      />
      <FormInput
        label="Confirm password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        error={errors.confirmPassword}
        placeholder="Repeat your password"
        secureTextEntry
      />

      {serverError ? <Text style={styles.serverError}>{serverError}</Text> : null}

      <PrimaryButton title="Register" onPress={handleRegister} loading={loading} />

      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Log in</Text>
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
