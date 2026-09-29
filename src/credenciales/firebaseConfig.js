// importamos la funcion principal para arrancar el motor de firebase
import { initializeApp } from 'firebase/app';
// importamos las herramientas de autenticacion y el persistidor para react native
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
// importamos asyncstorage (que aprendimos en la practica 11) para usar el disco duro
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// =========================================================
// reto 1: credenciales de firebase
// =========================================================
// instrucciones: este objeto es tu identificacion oficial en la nube.
// borra las frases "pega_aqui" y reemplazalas con las llaves de tu proyecto.
// copialas de la consola web de firebase (paso 4 de las instrucciones).

const firebaseConfig = {
  apiKey: "AIzaSyBfu8hzuT96Y_euNA4HxqjXXhC1FFGT2c0",
  authDomain: "practica12-auth-9d23b.firebaseapp.com",
  projectId: "practica12-auth-9d23b",
  storageBucket: "practica12-auth-9d23b.firebasestorage.app",
  messagingSenderId: "417099304015",
  appId: "1:417099304015:web:8c74a767fdfa8cde50ee3a"
};
// =========================================================

// arrancamos la aplicacion de firebase usando nuestras llaves
const app = initializeApp(firebaseConfig);

// inicializamos la autenticacion de una forma especial:
// le estamos diciendo a firebase que no guarde la sesion en la memoria ram,
// sino que utilice asyncstorage para grabar el token en el disco fisico del telefono.
// exportamos 'auth' para poder usarlo en nuestras pantallas de login y registro.
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});