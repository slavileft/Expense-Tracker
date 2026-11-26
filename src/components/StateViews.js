import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from './PrimaryButton';
import { colors } from '../theme';

// Shown while data is loading
export function LoadingView() {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

// Shown when a request failed.
export function ErrorView({ message, onRetry }) {
  return (
    <View style={styles.center}>
      <Text style={styles.errorTitle}>Oops!</Text>
      <Text style={styles.message}>{message}</Text>
      <PrimaryButton title="Try again" onPress={onRetry} style={styles.button} />
    </View>
  );
}

// Shown when there is nothing to display
export function EmptyView({ message }) {
  return (
    <View style={styles.center}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  errorTitle: { fontSize: 20, fontWeight: '700', color: colors.danger, marginBottom: 8 },
  message: { fontSize: 15, color: colors.muted, textAlign: 'center' },
  button: { marginTop: 16, paddingHorizontal: 32 },
});
