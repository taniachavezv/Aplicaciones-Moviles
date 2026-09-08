import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Traemos el arreglo de productos desde nuestra carpeta 'data'
import { PRODUCTOS } from '../data/productos';


// React Navigation inyecta automaticamente la propiedad 'navigation' a esta pantalla
// Es nuestra herramienta para apilar nuevas vistas o regresar a las anteriores.
export default function PantallaCatalogo({ navigation }) {
  return (
    <View style={styles.contenedorOscuro}>
      
      {/* A diferencia de un ScrollView normal, FlatList solo dibuja (renderiza) los elementos 
          que caben en la pantalla actual, ahorrando muchísima memoria RAM. */}
      <FlatList
        data={PRODUCTOS} // La fuente de los datos
        keyExtractor={(item) => item.id} // El identificador unico para evitar errores en React
        contentContainerStyle={{ padding: 15 }} // Espaciado interior global de la lista
        
        // renderItem actua como un ciclo 'for', Por cada 'item', dibuja este bloque
        renderItem={({ item }) => (
          
          <TouchableOpacity 
            style={styles.tarjetaProducto}

            onPress={() => {
              // Le decimos al enrutador: "Haz un push a la pantalla 'Detalle' 
              // y envíale este objeto exacto como carga (payload)".
              navigation.navigate('Detalle', { productoSeleccionado: item });
            }}
          >
            {/* Cargamos la imagen empaquetada localmente*/}
            <Image source={item.imagen} style={styles.imagenCatalogo} />
            
            <View style={styles.infoCatalogo}>
              {/* numberOfLines={1} corta textos muy largos añadiendo "..." automáticamente */}
              <Text style={styles.textoNombre} numberOfLines={1}>{item.nombre}</Text>
              <Text style={styles.textoPrecio}>{item.precio}</Text>
              <Text style={styles.textoVerMas}>Ver detalles <Ionicons name="arrow-forward" size={12}/></Text>
            </View>
          </TouchableOpacity>
          
        )}
      />
    </View>
  );
}

// HOJA DE ESTILOS
const styles = StyleSheet.create({
  // Flex: 1 asegura que el fondo abarque toda la pantalla
  contenedorOscuro: { flex: 1, backgroundColor: '#0A0A0A' },
  
  // flexDirection: 'row' alinea la imagen a la izquierda y el bloque de texto a la derecha
  tarjetaProducto: { flexDirection: 'row', backgroundColor: '#1A1A1A', marginBottom: 15, borderRadius: 15, overflow: 'hidden' },
  imagenCatalogo: { width: 120, height: 120 },
  
  // flex: 1 aquí permite que el texto ocupe todo el espacio restante sin empujar la imagen
  infoCatalogo: { flex: 1, padding: 15, justifyContent: 'center' },
  
  textoNombre: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  textoPrecio: { color: '#A259FF', fontSize: 16, fontWeight: '600', marginBottom: 10 },
  textoVerMas: { color: '#888', fontSize: 14 }
});