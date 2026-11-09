import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import DashboardScreen from "../screens/dashboard/DashboardScreen"
import ExpensesStack from "./ExpensesStack";
import ProfileScreen from "../screens/profile/ProfileScreen";

export default function MainTabs() {
    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator>
            <Tab.Screen name="DashboardTab" component={DashboardScreen} options={{ tabBarLabel: 'Home' }} />
            <Tab.Screen name="ExpensesTab" component={ExpensesStack} options={{ tabBarLabel: 'Expenses' }} />
            <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
        </Tab.Navigator>
    );
}