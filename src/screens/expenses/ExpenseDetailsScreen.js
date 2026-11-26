import { useCallback, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LoadingView, ErrorView } from '../../components/StateViews';
import PrimaryButton from '../../components/PrimaryButton';
import { getExpense, deleteExpense } from '../../services/expenseService';
import { formatDate, formatMoney } from '../../utils/format';
import { colors } from '../../theme';

export default function ExpenseDetailsScreen({ navigation, route }) {
  const { expenseId } = route.params;

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  async function loadExpense() {
    try {
      setError('');
      const data = await getExpense(expenseId);
      setExpense(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadExpense();
    }, [expenseId])
  );

  function handleRetry() {
    setLoading(true);
    loadExpense();
  }

  function handleDelete() {
    Alert.alert('Delete expense', 'Are you sure you want to delete this expense?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setDeleting(true);
            await deleteExpense(expenseId);
            navigation.goBack();
          } catch (err) {
            setDeleting(false);
            Alert.alert('Error', err.message);
          }
        },
      },
    ]);
  }

  if (loading) return <LoadingView />;
  if (error) return <ErrorView message={error} onRetry={handleRetry} />;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.amount}>{formatMoney(expense.amount)}</Text>
      <Text style={styles.title}>{expense.title}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{expense.category}</Text>
      </View>

      <View style={styles.card}>
        <InfoRow label="Date" value={formatDate(expense.date, true)} />
        <InfoRow label="Recurring" value={expense.is_recurring ? 'On' : 'Off'} />
        <InfoRow label="Note" value={expense.note || '-'} />
      </View>

      <Text style={styles.sectionTitle}>Receipt photo</Text>
      {expense.receipt_url ? (
        <Image source={{ uri: expense.receipt_url }} style={styles.photo} resizeMode="cover" />
      ) : (
        <View style={styles.noPhoto}>
          <Text style={styles.noPhotoText}>No photo attached</Text>
        </View>
      )}

      <View style={styles.buttons}>
        <PrimaryButton
          title="Edit"
          variant="secondary"
          style={styles.button}
          onPress={() => navigation.navigate('ExpenseForm', { expense })}
        />
        <PrimaryButton
          title="Delete"
          variant="danger"
          style={styles.button}
          loading={deleting}
          onPress={handleDelete}
        />
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  amount: { fontSize: 36, fontWeight: '700', color: colors.text },
  title: { fontSize: 20, color: colors.text, marginTop: 4 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  badgeText: { color: colors.primary, fontWeight: '600' },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  infoLabel: { color: colors.muted, fontSize: 15 },
  infoValue: { color: colors.text, fontSize: 15, flexShrink: 1, textAlign: 'right', marginLeft: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 24, marginBottom: 10 },
  photo: { width: '100%', height: 220, borderRadius: 12, backgroundColor: colors.border },
  noPhoto: {
    height: 90,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPhotoText: { color: colors.muted },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 28 },
  button: { flex: 1 },
});
