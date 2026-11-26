import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCategoryIcon } from '../utils/categories';
import { formatDate, formatMoney } from '../utils/format';
import { colors } from '../theme';

export default function ExpenseItem({ expense, onPress }) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.iconBox}>
        <Ionicons name={getCategoryIcon(expense.category)} size={22} color={colors.primary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{expense.title}</Text>
        <Text style={styles.date}>{formatDate(expense.date)}</Text>
      </View>
      <Text style={styles.amount}>{formatMoney(expense.amount)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600', color: colors.text },
  date: { fontSize: 13, color: colors.muted, marginTop: 2 },
  amount: { fontSize: 16, fontWeight: '700', color: colors.text },
});
