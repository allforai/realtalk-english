// Source: design.md Section 3.1 -- ConversationLanding -> Conversation -> Report
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LearnTabParamList } from './types';
import { ConversationScreen } from '../features/conversation/screens/ConversationScreen';
import { ConversationReportScreen } from '../features/conversation/screens/ConversationReportScreen';

const Stack = createNativeStackNavigator<LearnTabParamList>();

export function LearnStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ConversationLanding"
        component={ConversationScreen}
        options={{ title: 'Learn' }}
      />
      <Stack.Screen
        name="Conversation"
        component={ConversationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConversationReport"
        component={ConversationReportScreen}
        options={{ title: 'Report' }}
      />
    </Stack.Navigator>
  );
}
