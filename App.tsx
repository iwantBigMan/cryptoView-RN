import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import LoginScreen from './src/screens/Login';
import MainScreen from './src/screens/Main';
import HoldingDetailScreen from './src/screens/HoldingDetail';
import {BackgroundPrimary} from './src/theme/colors';
import {credentialsManager} from './src/data/local/credentialsManager';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  HoldingDetail: {symbol: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  // MMKV에서 저장된 인증 정보 확인 (동기)
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => credentialsManager.hasRequiredCredentials(),
  );

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isLoggedIn ? 'Main' : 'Login'}
          screenOptions={{
            headerShown: false,
            navigationBarColor: BackgroundPrimary,
            statusBarStyle: 'light',
          }}>
          {!isLoggedIn ? (
            <Stack.Screen name="Login">
              {() => <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen name="Main">
                {() => <MainScreen onLogout={() => setIsLoggedIn(false)} />}
              </Stack.Screen>
              <Stack.Screen
                name="HoldingDetail"
                component={HoldingDetailScreen}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}