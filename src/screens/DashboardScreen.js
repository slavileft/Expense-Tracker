import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ExpenseItem from '../components/ExpenseItem';
import { LoadingView, ErrorView } from '../components/StateViews';
import { useAuth } from '../context/AuthContext';
import { getExpensesBetween } from '../services/expenseService';
import { DEFAULT_BUDGET } from '../config';
import { formatMoney, getCurrentMonthRange } from '../utils/format';
import { colors } from '../theme';

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();

  const [expenses, setExpenses] = useState([]); // expenses of THIS month
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const { from, to, label } = getCurrentMonthRange();

  async function loadExpenses() {
    try {
      setError('');
      const data = await getExpensesBetween(from, to);
      setExpenses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [])
  );

  function handleRetry() {
    setLoading(true);
    loadExpenses();
  }

  function handleRefresh() {
    setRefreshing(true);
    loadExpenses();
  }

  if (loading) return <LoadingView />;
  if (error) return <ErrorView message={error} onRetry={handleRetry} />;

  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const budget = user?.monthlyBudget || DEFAULT_BUDGET;
  const percentUsed = Math.round((total / budget) * 100);
  const overBudget = total > budget;

  const totalsByCategory = {};
  expenses.forEach((expense) => {
    totalsByCategory[expense.category] =
      (totalsByCategory[expense.category] || 0) + Number(expense.amount);
  });
  const topCategories = Object.entries(totalsByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const recent = expenses.slice(0, 3);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <Text style={styles.month}>{label}</Text>

      {/* Total spent + budget progress bar */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Spent this month</Text>
        <Text style={styles.total}>{formatMoney(total)}</Text>
        <View style={styles.barBackground}>
          <View
            style={[
              styles.barFill,
              { width: `${Math.min(percentUsed, 100)}%` },
              overBudget && styles.barOver,
            ]}
          />
        </View>
        <Text style={[styles.cardLabel, overBudget && styles.overText]}>
          {percentUsed}% of {formatMoney(budget)} budget
        </Text>
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>By category</Text>
      {topCategories.length === 0 ? (
        <Text style={styles.empty}>No expenses this month yet.</Text>
      ) : (
        topCategories.map(([category, amount]) => {
          const percent = Math.round((amount / total) * 100);
          return (
            <View key={category} style={styles.categoryRow}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>{category}</Text>
                <Text style={styles.categoryName}>{percent}%</Text>
              </View>
              <View style={styles.barBackground}>
                <View style={[styles.barFill, { width: `${percent}%` }]} />
              </View>
            </View>
          );
        })
      )}

      {/* Recent expenses */}
      <Text style={styles.sectionTitle}>Recent</Text>
      {recent.length === 0 ? (
        <Text style={styles.empty}>Nothing here yet. Add your first expense in the Expenses tab.</Text>
      ) : (
        recent.map((expense) => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            onPress={() =>
              navigation.navigate('Expenses', {
                screen: 'ExpenseDetails',
                params: { expenseId: expense.id },
              })
            }
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  month: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 12 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardLabel: { fontSize: 14, color: colors.muted },
  overText: { color: colors.danger },
  total: { fontSize: 34, fontWeight: '700', color: colors.text, marginVertical: 6 },
  barBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: 'hidden',
    marginVertical: 8,
  // Reload every time the user comes back to this tab
  },
  barFill: { height: 8, borderRadius: 4, backgroundColor: colors.primary },
  barOver: { backgroundColor: colors.danger },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 10,
  },
  empty: { color: colors.muted, fontSize: 14 },
  categoryRow: { marginBottom: 8 },
  categoryHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  categoryName: { fontSize: 14, color: colors.text },
});
