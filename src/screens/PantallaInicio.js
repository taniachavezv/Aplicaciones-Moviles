import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../credenciales/firebaseConfig';
// importamos la funcion de firebase para cerrar sesion
import { signOut } from 'firebase/auth';

export default function PantallaInicio() {
  
  // podemos leer quien esta conectado actualmente usando auth.currentUser
  // el signo de interrogacion evita que la app falle si por alguna razon el usuario es nulo
  const correoUsuario = auth.currentUser?.email;

  const cerrarSesion = async () => {
    try {
      // =========================================================
      // reto 4: cerrar sesion
      // =========================================================
      // instrucciones: ejecuta la funcion signOut y pasale como parametro
      // tu variable auth. recuerda usar await.
      // al hacer esto, el token se destruye del asyncstorage. 
      // el archivo app.js se dara cuenta inmediatamente y te expulsara al login.
      
      // escribe tu codigo aqui abajo:
      await signOut(auth);
      
      
      // =========================================================
    } catch (error) {
      Alert.alert('error', 'no se pudo cerrar la sesion');
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.bienvenida}>¡bienvenido a la nube!</Text>
      {/* imprimimos en pantalla el correo del usuario extraido de firebase */}
      <Text style={styles.correo}>{correoUsuario}</Text>

      <TouchableOpacity style={styles.botonCerrar} onPress={cerrarSesion}>
        <Text style={styles.textoBoton}>cerrar sesion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center', padding: 20 },
  bienvenida: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  correo: { color: '#888', fontSize: 16, marginBottom: 40 },
  botonCerrar: { backgroundColor: '#ff5252', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10 },
  textoBoton: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});