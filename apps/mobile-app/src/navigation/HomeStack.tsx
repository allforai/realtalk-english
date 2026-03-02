// Source: design.md Section 3.1 -- Home -> ScenarioList -> ScenarioDetail
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeTabParamList } from './types';
import { HomeScreen } from '../features/home/screens/HomeScreen';
import { ScenarioListScreen } from '../features/scenarios/screens/ScenarioListScreen';
import { ScenarioDetailScreen } from '../features/scenarios/screens/ScenarioDetailScreen';

const Stack = createNativeStackNavigator<HomeTabParamList>();

export function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ScenarioList"
        component={ScenarioListScreen}
        options={{ title: 'Scenarios' }}
      />
      <Stack.Screen
        name="ScenarioDetail"
        component={ScenarioDetailScreen}
        options={{ title: 'Scenario' }}
      />
    </Stack.Navigator>
  );
}
