import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './src/navigation/TabNavigator';
import { InventarioProvider } from './src/context/InventarioContext';

export default function App() {
  return (
    <InventarioProvider>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </InventarioProvider>
  );
}