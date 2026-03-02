// Source: design.md Section 3.1 -- Bottom tabs (Home, Learn, Review, Profile)
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStack } from './HomeStack';
import { LearnStack } from './LearnStack';
import { ReviewStack } from './ReviewStack';
import { ProfileStack } from './ProfileStack';

const Tab = createBottomTabNavigator();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="LearnTab"
        component={LearnStack}
        options={{ tabBarLabel: 'Learn' }}
      />
      <Tab.Screen
        name="ReviewTab"
        component={ReviewStack}
        options={{ tabBarLabel: 'Review' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
