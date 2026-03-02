// Source: design.md Section 3.1 -- Profile -> StreaksAchievements
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileTabParamList } from './types';
import { StreaksAchievementsScreen } from '../features/gamification/screens/StreaksAchievementsScreen';

const Stack = createNativeStackNavigator<ProfileTabParamList>();

// TODO: Add ProfileScreen as the root of this stack
export function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={StreaksAchievementsScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen
        name="StreaksAchievements"
        component={StreaksAchievementsScreen}
        options={{ title: 'Streaks & Achievements' }}
      />
    </Stack.Navigator>
  );
}
