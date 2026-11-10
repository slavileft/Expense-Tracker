import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import DashboardScreen from "../screens/dashboard/DashboardScreen"
import ExpensesStack from "./ExpensesStack";
import ProfileScreen from "../screens/profile/ProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/theme";

export default function MainTabs() {
    const Tab = createBottomTabNavigator();

    const ICONS = {
        DashboardTab: ['home', 'home-outline'],
        ExpensesTab: ['receipt', 'receipt-outline'],
        ProfileTab: ['person', 'person-outline'],
    };

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
                tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
                tabBarIcon: ({ color, size, focused }) => (
                    <Ionicons name={ICONS[route.name][focused ? 0 : 1]} size={size} color={color} />
                ),
            })}
        >
            <Tab.Screen name="DashboardTab" component={DashboardScreen} options={{ tabBarLabel: 'Home' }} />
            <Tab.Screen name="ExpensesTab" component={ExpensesStack} options={{ tabBarLabel: 'Expenses' }} />
            <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
        </Tab.Navigator>
    );
}