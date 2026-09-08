import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Asi como la pantalla de catalogo uso 'navigation' para enviar, esta pantalla
// usa la propiedad magica 'route' para recibir lo que le enviaron.
export default function PantallaDetalle({ route }) {
  

  // Extraemos el objeto completo ('productoSeleccionado') que nos mando la pantalla anterior
  // desde los parametros de la ruta (route.params).
  const { productoSeleccionado } = route.params;

  return (
    <View style={styles.contenedorOscuro}>
      
      {/* El paddingBottom: 120 crea un "colchón" invisible al final de la página. 
          Si no lo ponemos, el texto de hasta abajo quedaría tapado por el botón flotante. */}
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Cargamos la imagen directamente de la variable local empaquetada (require) */}
        <Image source={productoSeleccionado.imagen} style={styles.imagenDetalle} />
        
        <View style={styles.contenedorInfoDetalle}>
          
          {/* El nombre va grande, y el precio aun mas destacado debajo */}
          <Text style={styles.textoNombreGrande}>{productoSeleccionado.nombre}</Text>
          <Text style={styles.textoPrecioGrande}>{productoSeleccionado.precio}</Text>

          {/* Una simple linea divisoria dibujada con View para organizar la informacion */}
          <View style={styles.lineaSeparadora} />

          <Text style={styles.etiquetaSeccion}>Descripción</Text>
          <Text style={styles.textoDescripcion}>{productoSeleccionado.descripcion}</Text>

          <View style={styles.lineaSeparadora} />


          <Text style={styles.etiquetaSeccion}>Características Principales</Text>
          
          {/* usamos el método .map() de JavaScript. Este ciclo recorre el arreglo de características
              y dibuja ("renderiza") una fila completa con su viñeta (Ionicons) por cada elemento. */}
          {productoSeleccionado.caracteristicas.map((item, index) => (
            // Siempre que se itera en React, el elemento padre necesita la propiedad 'key' (llave única)
            <View key={index} style={styles.filaCaracteristica}>
              <Ionicons name="checkmark-circle" size={20} color="#A259FF" />
              {/* Aquí se imprime el texto individual de la característica */}
              <Text style={styles.textoCaracteristica}>{item}</Text>
            </View>
          ))}

        </View>
      </ScrollView>

      {/* BOTON FLOTANTE ESTILO E-COMMERCE (position: absolute) */}
      {/* Este View está FUERA del ScrollView. 
          Al ponerle 'position: absolute' y 'bottom: 0', lo arrancamos del flujo normal 
          de la página y lo "pegamos" al borde inferior de la pantalla física del celular. */}
      <View style={styles.zonaBoton}>
        <TouchableOpacity style={styles.botonComprar}>
          <Ionicons name="cart" size={24} color="white" />
          <Text style={styles.textoBotonComprar}>Agregar al carrito</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
}

// HOJA DE ESTILOS
const styles = StyleSheet.create({
  contenedorOscuro: { flex: 1, backgroundColor: '#0A0A0A' },
  imagenDetalle: { width: '100%', height: 300, resizeMode: 'cover' }, // resizeMode: 'cover' asegura que la imagen llene el espacio sin aplastarse
  
  contenedorInfoDetalle: { padding: 25 },
  
  // Tipografía destacada para el e-commerce
  textoNombreGrande: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold', marginBottom: 5 },
  textoPrecioGrande: { color: '#A259FF', fontSize: 26, fontWeight: '900', marginBottom: 15 },
  
  // Dibujando líneas divisorias con un View vacío
  lineaSeparadora: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 20 },
  
  etiquetaSeccion: { color: '#888', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12, fontWeight: 'bold' },
  textoDescripcion: { color: '#CCCCCC', fontSize: 16, lineHeight: 26 },
  
  // Estilos de la lista iterativa (.map)
  filaCaracteristica: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  textoCaracteristica: { color: '#E0E0E0', fontSize: 16, marginLeft: 10 },

  // Truco CSS para el Botón Flotante
  // Al usar fondo semitransparente (rgba) y estar anclado (absolute), 
  // da un efecto premium cuando el texto pasa por debajo al hacer scroll.
  zonaBoton: { position: 'absolute', bottom: 0, width: '100%', padding: 20, backgroundColor: 'rgba(10, 10, 10, 0.95)' }, 
  botonComprar: { backgroundColor: '#A259FF', flexDirection: 'row', padding: 18, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  textoBotonComprar: { color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 10 }
});
