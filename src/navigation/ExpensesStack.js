import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExpenseListScreen from '../screens/expenses/ExpenseListScreen';
import ExpenseDetailsScreen from '../screens/expenses/ExpenseDetailsScreen';
import ExpenseFormScreen from '../screens/expenses/ExpenseFormScreen';

const Stack = createNativeStackNavigator();

export default function ExpensesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ExpenseList"
        component={ExpenseListScreen}
        options={{ title: 'Expenses' }}
      />
      <Stack.Screen
        name="ExpenseDetails"
        component={ExpenseDetailsScreen}
        options={{ title: 'Expense' }}
      />
      <Stack.Screen
        name="ExpenseForm"
        component={ExpenseFormScreen}
        options={({ route }) => ({
          title: route.params?.expense ? 'Edit expense' : 'Add expense',
        })}
      />
    </Stack.Navigator>
  );
}
