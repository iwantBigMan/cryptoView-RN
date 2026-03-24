import React, {useRef} from 'react';
import {Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../../App';
import AssetsOverviewScreen from '../AssetsOverview';
import HoldingsScreen from '../Holdings';
import SettingsScreen from '../Settings';
import {
  BackgroundPrimary,
  NavBarBackground,
  AccentBlue,
  TextTertiary,
} from '../../theme/colors';

type TabParamList = {
  Home: undefined;
  Holdings: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({name, color}: {name: string; color: string}) {
  const icons: Record<string, string> = {
    home: '⌂',
    wallet: '◈',
    settings: '⚙',
  };
  return <Text style={{fontSize: 20, color}}>{icons[name] ?? '?'}</Text>;
}

export default function MainScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Holdings 탭으로 이동하기 위한 ref
  const tabRef = useRef<any>(null);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: NavBarBackground,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarActiveTintColor: AccentBlue,
        tabBarInactiveTintColor: TextTertiary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        sceneStyle: {backgroundColor: BackgroundPrimary},
      }}>
      <Tab.Screen
        name="Home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => <TabIcon name="home" color={color} />,
        }}>
        {() => (
          <AssetsOverviewScreen
            onNavigateToHoldings={() =>
              navigation.getParent()?.navigate('Main', {screen: 'Holdings'})
            }
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Holdings"
        options={{
          tabBarLabel: 'Holdings',
          tabBarIcon: ({color}) => <TabIcon name="wallet" color={color} />,
        }}>
        {() => (
          <HoldingsScreen
            onHoldingClick={symbol =>
              navigation.navigate('HoldingDetail', {symbol})
            }
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Settings"
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({color}) => <TabIcon name="settings" color={color} />,
        }}
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
}
