import { initializeApp } from 'firebase/app';
// importamos unicamente firestore (ya no usamos storage por el cobro)
import { getFirestore } from 'firebase/firestore';

// =========================================================
// reto 1: credenciales de firebase
// =========================================================
const firebaseConfig = {
  apiKey: "AIzaSyCb9glZDAqAiJfBuru0oARIDvV6odMZNDw",
  authDomain: "practica13-perfil-f458a.firebaseapp.com",
  projectId: "practica13-perfil-f458a",
  storageBucket: "practica13-perfil-f458a.firebasestorage.app",
  messagingSenderId: "467283708882",
  appId: "1:467283708882:web:bf082d77835e8da7dd160b"
};
// =========================================================

const app = initializeApp(firebaseConfig);

// inicializamos y exportamos firestore
export const db = getFirestore(app);