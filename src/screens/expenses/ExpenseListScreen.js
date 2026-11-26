import { useCallback, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ExpenseItem from '../../components/ExpenseItem';
import { LoadingView, ErrorView, EmptyView } from '../../components/StateViews';
import { getExpenses } from '../../services/expenseService';
import { CATEGORIES } from '../../utils/categories';
import { colors } from '../../theme';

export default function ExpenseListScreen({ navigation }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  async function loadExpenses() {
    try {
      setError('');
      const data = await getExpenses();
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

  const visibleExpenses =
    selectedCategory === 'All'
      ? expenses
      : expenses.filter((expense) => expense.category === selectedCategory);

  const filters = ['All', ...CATEGORIES.map((category) => category.name)];

  return (
    <View style={styles.screen}>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {filters.map((name) => (
            <Pressable
              key={name}
              style={[styles.chip, name === selectedCategory && styles.chipSelected]}
              onPress={() => setSelectedCategory(name)}
            >
              <Text style={[styles.chipText, name === selectedCategory && styles.chipTextSelected]}>
                {name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={visibleExpenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExpenseItem
            expense={item}
            onPress={() => navigation.navigate('ExpenseDetails', { expenseId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <EmptyView
            message={
              expenses.length === 0
                ? 'No expenses yet. Tap + to add your first one.'
                : 'No expenses in this category.'
            }
          />
        }
      />

      <Pressable style={styles.fab} onPress={() => navigation.navigate('ExpenseForm')}>
        <Ionicons name="add" size={30} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  chips: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 14, color: colors.text },
  chipTextSelected: { color: '#fff', fontWeight: '600' },
  listContent: { paddingHorizontal: 16, paddingBottom: 90, flexGrow: 1 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});
