import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoadingView } from '../components/StateViews';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import { colors } from '../constants/theme';

const RootStack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.background, primary: colors.primary },
};

export default function RootNavigator() {
    const isLoading = false;
    const session = false;

  // While we check for a saved session at app start
  if (isLoading) {
    return <LoadingView />;
  }

  return (
    <NavigationContainer theme={theme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          <RootStack.Screen name="Main" component={MainTabs} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthStack} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
