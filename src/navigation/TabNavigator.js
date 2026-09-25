// importamos la base de react para construir nuestra interfaz
import React from 'react';
// importamos la herramienta especifica que nos permite crear el menu de pestañas en la parte inferior
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// importamos la libreria de iconos de expo para hacer que el menu se vea mas profesional
import { Ionicons } from '@expo/vector-icons';

// importamos las dos pantallas fisicas que vamos a conectar a nuestro menu
import PantallaInventario from '../screens/PantallaInventario';
import PantallaRegistro from '../screens/PantallaRegistro';

// inicializamos el creador de pestañas. esto genera un objeto "Tab" que contiene 
// los componentes necesarios para envolver y definir nuestras rutas
const Tab = createBottomTabNavigator();

// exportamos la funcion principal que dibuja toda la estructura de navegacion
export default function TabNavigator() {
  return (
    // el tab.navigator es el contenedor principal. aqui definimos las reglas de diseño para todas las pestañas
    <Tab.Navigator
      // screenoptions configura la estetica global. usamos una funcion que recibe la "ruta" actual
      // para poder tomar decisiones de diseño dependiendo de en que pantalla estemos
      screenOptions={({ route }) => ({
        // obliga a que los titulos de la barra superior siempre esten centrados en android y ios
        headerTitleAlign: 'center',
        // pinta el fondo de la barra superior (el header) de un color gris casi negro
        headerStyle: { backgroundColor: '#121212' },
        // pinta las letras del titulo de la barra superior de color blanco
        headerTintColor: '#fff',
        // configura el fondo de la barra inferior (donde estan los botones) con un tono oscuro y un borde ligero
        tabBarStyle: { backgroundColor: '#1A1A1A', borderTopColor: '#333' },
        // define el color naranja para el icono y el texto de la pestaña cuando el usuario la tiene seleccionada
        tabBarActiveTintColor: '#ff8000', 
        // define el color gris para las pestañas que estan apagadas o sin seleccionar
        tabBarInactiveTintColor: 'gray',
        
        // esta funcion se encarga de dibujar el icono correcto. nos avisa si la pestaña esta activa (focused), 
        // y nos pasa el color y tamaño que configuramos arriba
        tabBarIcon: ({ focused, color, size }) => {
          // creamos una variable vacia para guardar temporalmente el nombre del icono
          let iconName;
          
          // si la ruta actual es la pantalla de inventario...
          if (route.name === 'Inventario') 
            // usamos el operador ternario: si esta seleccionada (focused), usa el icono 'list' (relleno). 
            // si no, usa 'list-outline' (solo el contorno).
            iconName = focused ? 'list' : 'list-outline';
            
          // si la ruta actual es la pantalla de registro...
          else if (route.name === 'Registro') 
            // aplicamos la misma logica: 'add-circle' relleno si esta activa, o el contorno si esta inactiva
            iconName = focused ? 'add-circle' : 'add-circle-outline';
            
          // finalmente, inyectamos el nombre calculado, el tamaño y el color en el componente de ionicons
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* definimos nuestra primera pestaña. el "name" es el identificador interno para viajar a ella, 
          "component" es el archivo que va a cargar, y en "options" sobreescribimos el titulo visible */}
      <Tab.Screen name="Registro" component={PantallaRegistro} options={{ title: 'Registro de Productos' }} />
      
      {/* definimos la segunda pestaña correspondiente a nuestro catalogo principal */}
      <Tab.Screen name="Inventario" component={PantallaInventario} options={{ title: 'Inventario' }} />
    </Tab.Navigator>
  );
}
