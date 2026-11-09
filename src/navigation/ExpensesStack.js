import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ExpenseListScreen from "../screens/expenses/ExpenseListScreen";
import ExpenseDetailsScreen from "../screens/expenses/ExpenseDetailsScreen";

export default function ExpensesStack(){
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen name="ExpenseList" component={ExpenseListScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="ExpenseDetails" component={ExpenseDetailsScreen} options={{ title: 'Expense' }}/>
        </Stack.Navigator>
    );
}