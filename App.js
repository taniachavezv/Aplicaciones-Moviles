import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importamos las vistas desde nuestra nueva carpeta src
import PantallaCatalogo from './src/screens/PantallaCatalogo';
import PantallaDetalle from './src/screens/PantallaDetalle';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Catalogo"
        screenOptions={{
          headerStyle: { backgroundColor: '#121212' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen 
          name="Catalogo" 
          component={PantallaCatalogo} 
          options={{ title: 'Tech Store' }} 
        />
        <Stack.Screen 
          name="Detalle" 
          component={PantallaDetalle} 
          // Configuramos el titulo superior dinamicamente segun el producto
          options={({ route }) => ({ title: route.params.productoSeleccionado.nombre })} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
