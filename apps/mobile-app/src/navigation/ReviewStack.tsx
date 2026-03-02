// Source: design.md Section 3.1 -- Review screen
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ReviewTabParamList } from './types';
import { ReviewScreen } from '../features/review/screens/ReviewScreen';

const Stack = createNativeStackNavigator<ReviewTabParamList>();

export function ReviewStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Review"
        component={ReviewScreen}
        options={{ title: 'Review' }}
      />
    </Stack.Navigator>
  );
}
