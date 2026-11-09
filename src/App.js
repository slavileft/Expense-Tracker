import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import MainTabs from './navigation/MainTabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
    return (
        <SafeAreaProvider>
            <StatusBar style="auto" />
            <NavigationContainer>
                <MainTabs />
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

