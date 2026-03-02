// Source: design.md -- Root component
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { Providers } from './providers';
import { RootNavigator } from '../navigation/RootNavigator';
import { linking } from '../navigation/linking';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <Providers>
          <NavigationContainer linking={linking}>
            <RootNavigator />
          </NavigationContainer>
        </Providers>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
