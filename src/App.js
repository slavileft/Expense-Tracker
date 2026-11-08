import { NavigationContext } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContext>
        <View >
          <Text>Expense Tracker</Text>
        </View>
      </NavigationContext>
    </>
  );
}

