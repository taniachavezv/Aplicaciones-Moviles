import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
// importamos nuestra variable auth
import { auth } from '../credenciales/firebaseConfig';
// importamos la funcion de firebase exclusiva para iniciar sesion
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function PantallaLogin({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const iniciarSesion = async () => {
    // validamos que los campos no esten vacios
    if (correo === '' || password === '') {
      Alert.alert('error', 'ingresa tu correo y contraseña');
      return;
    }

    try {
      // =========================================================
      // reto 3: iniciar sesion en la nube
      // =========================================================
      // instrucciones: utiliza la funcion signInWithEmailAndPassword.
      // pasale los tres parametros requeridos: auth, correo, password.
      // recuerda usar await porque la aplicacion debe esperar la respuesta del servidor.
      
      // escribe tu codigo aqui abajo:
      await signInWithEmailAndPassword(auth, correo.trim(), password);
      
      
      // =========================================================
    } catch (error) {
      // si la contraseña es incorrecta o el usuario no existe, entra aqui
      Alert.alert('credenciales incorrectas', 'el correo o contraseña no son validos');
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>iniciar sesion</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="correo electronico" 
        placeholderTextColor="#666" 
        keyboardType="email-address"
        autoCapitalize="none" // importante para que el celular no empiece con mayuscula automatica
        value={correo} 
        onChangeText={setCorreo} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="contraseña" 
        placeholderTextColor="#666" 
        secureTextEntry // esta propiedad oculta los caracteres con puntitos
        value={password} 
        onChangeText={setPassword} 
      />

      <TouchableOpacity style={styles.botonPrincipal} onPress={iniciarSesion}>
        <Text style={styles.textoBoton}>entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Registro')} style={{ marginTop: 20 }}>
        <Text style={styles.textoSecundario}>¿no tienes cuenta? registrate aqui</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#0a0a0a', padding: 20, justifyContent: 'center' },
  titulo: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { backgroundColor: '#1a1a1a', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 15 },
  botonPrincipal: { backgroundColor: '#a259ff', padding: 15, borderRadius: 10, alignItems: 'center' },
  textoBoton: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  textoSecundario: { color: '#a259ff', textAlign: 'center' }
});