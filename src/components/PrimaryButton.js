import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

export default function PrimaryButton({ title, onPress, loading = false, variant = 'primary', style }) {
  return (
    <Pressable
      style={[styles.button, styles[variant], loading && styles.disabled, style]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : colors.text} />
      ) : (
        <Text style={[styles.text, variant === 'primary' && styles.textLight, variant === 'danger' && styles.textDanger]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  danger: { backgroundColor: colors.dangerLight },
  disabled: { opacity: 0.6 },
  text: { fontSize: 16, fontWeight: '600', color: colors.text },
  textLight: { color: '#fff' },
  textDanger: { color: colors.danger },
});
