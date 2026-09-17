import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';
import { Colors } from '../constants/theme';

import { HomeScreen } from '../screens/HomeScreen';
import { FocusScreen } from '../screens/FocusScreen';
import { CalmScreen } from '../screens/CalmScreen';
import { SoundMixerScreen } from '../screens/SoundMixerScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', opacity: focused ? 1 : 0.4 }}>
      <Text style={{ fontSize: focused ? 24 : 22 }}>{emoji}</Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'rgba(11,15,20,0.85)',
          borderTopColor: 'rgba(255,255,255,0.06)',
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 16,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} /> }}
      />
      <Tab.Screen
        name="Focus"
        component={FocusScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="⚡" focused={focused} /> }}
      />
      <Tab.Screen
        name="Calm"
        component={CalmScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🌿" focused={focused} /> }}
      />
      <Tab.Screen
        name="Mixer"
        component={SoundMixerScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🎚️" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}