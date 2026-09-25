import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { InventarioContext } from '../context/InventarioContext';

export default function PantallaRegistro() {
  const { agregarProducto } = useContext(InventarioContext);
  
  // =========================================================
  // RETO 1.1: DECLARAR ESTADOS DEL FORMULARIO
  // =========================================================
  // Instrucciones: Declara las constantes nombre, precio, vendedor y categoria usando useState.
  
  // Escribe tu código aquí:
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [vendedor, setVendedor] = useState('');
  const [categoria, setCategoria] = useState('Electrónica');

  // =========================================================

  const guardar = () => {
    if (!nombre || !precio || !vendedor) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    
    agregarProducto(nombre, precio, categoria, vendedor);
    
    // =========================================================
    // RETO 1.2: LIMPIAR FORMULARIO
    // =========================================================
    // Instrucciones: Regresa las variables nombre, precio y vendedor a texto vacío ('')
    
    // Escribe tu código aquí:
    setNombre('');
    setPrecio('');
    setVendedor('');
    
    
    // =========================================================
    
    Alert.alert('Éxito', 'Producto guardado en la memoria');
  };

  return (
    <ScrollView style={styles.contenedor}>
      <View style={styles.tarjeta}>
        
        <Text style={styles.label}>Nombre del Producto:</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ej. Audífonos Bluetooth" 
          placeholderTextColor="#666" 
          value={nombre} 
          onChangeText={setNombre} 
        />

        {/* ========================================================= */}
        {/* RETO 1.3: INPUTS FALTANTES                             */}
        {/* ========================================================= */}
        {/* Instrucciones: Basándote en el input de "Nombre" de arriba, 
            crea las etiquetas <Text> y los <TextInput> para "Precio" y "Vendedor". */}

        {/* Escribe tu código aquí: */}
        <Text style={styles.label}>Precio:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. 450"
          placeholderTextColor="#666"
          value={precio}
          onChangeText={setPrecio}
          keyboardType="numeric"
        />
        
        <Text style={styles.label}>Vendedor:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Carlo Ruiz"
          placeholderTextColor="#666"
          value={vendedor}
          onChangeText={setVendedor}
        />
      
        {/* ========================================================= */}

        <Text style={styles.label}>Categoría:</Text>
        <View style={styles.contenedorCategorias}>
          {['Electrónica', 'Ropa', 'Hogar'].map((cat) => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.pildora, categoria === cat && styles.pildoraActiva]} 
              onPress={() => setCategoria(cat)}
            >
              <Text style={[styles.textoPildora, categoria === cat && styles.textoPildoraActiva]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.botonGuardar} onPress={guardar}>
          <Text style={styles.textoBotonGuardar}>Registrar Producto</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#0A0A0A', padding: 15 },
  tarjeta: { backgroundColor: '#1A1A1A', padding: 20, borderRadius: 10 },
  label: { color: '#CCC', marginBottom: 5, fontSize: 16 },
  input: { backgroundColor: '#333', color: '#FFF', padding: 12, borderRadius: 8, marginBottom: 15 },
  contenedorCategorias: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  pildora: { paddingVertical: 8, paddingHorizontal: 15, backgroundColor: '#333', borderRadius: 20 },
  pildoraActiva: { backgroundColor: '#A259FF' },
  textoPildora: { color: '#888' },
  textoPildoraActiva: { color: '#FFF', fontWeight: 'bold' },
  botonGuardar: { backgroundColor: '#A259FF', padding: 15, borderRadius: 8, alignItems: 'center' },
  textoBotonGuardar: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
