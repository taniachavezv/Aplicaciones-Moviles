import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// importamos el observador de estado de firebase
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/credenciales/firebaseConfig';
import { ActivityIndicator, View } from 'react-native';

// importamos nuestras tres pantallas
import PantallaLogin from './src/screens/PantallaLogin';
import PantallaRegistro from './src/screens/PantallaRegistro';
import PantallaInicio from './src/screens/PantallaInicio';

const Stack = createNativeStackNavigator();

export default function App() {
  // estado para saber si hay alguien conectado o no
  const [usuario, setUsuario] = useState(null);
  // estado para mostrar una pantalla de carga mientras firebase revisa el disco duro
  const [cargando, setCargando] = useState(true);

  // useeffect se ejecuta una sola vez al abrir la aplicacion
  useEffect(() => {
    // onauthstatechanged es un vigilante que esta activo todo el tiempo.
    // si el token en el disco duro es valido, nos pasa los datos del usuario.
    // si el usuario cierra sesion, nos pasa un valor nulo.
    const vigilarSesion = onAuthStateChanged(auth, (usuarioFirebase) => {
      setUsuario(usuarioFirebase); 
      setCargando(false); // terminamos de cargar
    });
    
    // apagamos el vigilante si la aplicacion se destruye
    return vigilarSesion;
  }, []);

  // mientras firebase decide si el token es valido, mostramos un circulo de carga
  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#0a0a0a' }}>
        <ActivityIndicator size="large" color="#a259ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* enrutamiento condicional: 
            si 'usuario' es nulo (!usuario), dibujamos las pantallas de acceso.
            si 'usuario' tiene datos, dibujamos directamente la pantalla de inicio protegida. */}
        {!usuario ? (
          <>
            <Stack.Screen name="Login" component={PantallaLogin} />
            <Stack.Screen name="Registro" component={PantallaRegistro} />
          </>
        ) : (
          <Stack.Screen name="Inicio" component={PantallaInicio} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}