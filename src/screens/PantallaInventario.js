import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { InventarioContext } from '../context/InventarioContext';
import { Ionicons } from '@expo/vector-icons';

export default function PantallaInventario() {
  const { productos, eliminarProducto, actualizarProducto } = useContext(InventarioContext);
  
  // =========================================================
  // RETO 2.1: ESTADOS PARA EL MODAL DE EDICIÓN
  // =========================================================
  // Instrucciones: Declara los estados modalVisible, idEditando, editNombre, 
  // editPrecio, editVendedor y editCategoria.
  
  // Escribe tu código aquí:
  const [modalVisible, setModalVisible] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editPrecio, setEditPrecio] = useState('');
  const [editVendedor, setEditVendedor] = useState('');
  const [editCategoria, setEditCategoria] = useState('');

  // =========================================================

  const abrirModalEdicion = (producto) => {
    // =========================================================
    // RETO 2.2: LLENAR LOS ESTADOS CON LOS DATOS DEL PRODUCTO
    // =========================================================
    // Instrucciones: Asigna los valores del 'producto' recibido a los estados correspondientes.
    
    // Escribe tu código aquí:
    setIdEditando(producto.id);
    setEditNombre(producto.nombre);
    setEditPrecio(producto.precio.toString());
    setEditVendedor(producto.vendedor);
    setEditCategoria(producto.categoria);
    setModalVisible(true);
  };

  const guardarEdicion = () => {
    actualizarProducto(idEditando, editNombre, editPrecio, editCategoria, editVendedor);
    setModalVisible(false);
    Alert.alert('Actualizado', 'Los datos se modificaron correctamente');
  };

  if (productos.length === 0) {
    return (
      <View style={styles.centro}>
        <Ionicons name="folder-open-outline" size={60} color="#333" />
        <Text style={styles.textoVacio}>No hay productos registrados</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tarjeta}>
            <View style={styles.info}>
              <Text style={styles.titulo}>{item.nombre}</Text>
              
              {/* ========================================================= */}
              {/* RETO 2.3: MOSTRAR DATOS EN LA TARJETA                  */}
              {/* ========================================================= */}
              {/* Instrucciones: Agrega los componentes <Text> para mostrar el Precio, Categoría y Vendedor. */}
              
              {/* Escribe tu código aquí: */}
              <Text style={styles.precio}>${Number(item.precio).toFixed(2)}</Text>
              <Text style={styles.detalle}>Categoría: {item.categoria}</Text>
              <Text style={styles.detalle}>Vendedor: {item.vendedor}</Text>

              {/* ========================================================= */}
            </View>
            
            <View style={styles.controles}>
              <TouchableOpacity style={styles.botonEditar} onPress={() => abrirModalEdicion(item)}>
                <Ionicons name="pencil" size={20} color="#FFF" />
              </TouchableOpacity>
              
              {/* ========================================================= */}
              {/* RETO 2.4: BOTÓN DE ELIMINAR                            */}
              {/* ========================================================= */}
              {/* Instrucciones: Crea el TouchableOpacity que ejecute eliminarProducto(item.id) */}
              
              {/* Escribe tu código aquí: */}
              <TouchableOpacity style={styles.botonEliminar} onPress={() => eliminarProducto(item.id)}>
                <Ionicons name="trash" size={20} color="#FFF" />
              </TouchableOpacity>
              
              {/* ========================================================= */}
            </View>
          </View>
        )}
      />

      {/* VENTANA EMERGENTE DE EDICIÓN */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalFondo}>
          <View style={styles.modalTarjeta}>
            <Text style={styles.modalTitulo}>Editar Producto</Text>
            
            <TextInput style={styles.input} value={editNombre} onChangeText={setEditNombre} placeholder="Nombre" placeholderTextColor="#666" />
            
            {/* ========================================================= */}
            {/* RETO 2.5: INPUTS DEL MODAL                             */}
            {/* ========================================================= */}
            {/* Instrucciones: Crea los TextInput para editPrecio (numérico) y editVendedor */}
            
            {/* Escribe tu código aquí: */}
            <TextInput 
              style={styles.input} 
              value={editPrecio} 
              onChangeText={setEditPrecio} 
              placeholder="Precio" 
              placeholderTextColor="#666" 
              keyboardType="numeric" 
            />
            <TextInput 
              style={styles.input} 
              value={editVendedor} 
              onChangeText={setEditVendedor} 
              placeholder="Vendedor" 
              placeholderTextColor="#666" 
            />
            
            {/* ========================================================= */}
            
            <TextInput style={styles.input} value={editCategoria} onChangeText={setEditCategoria} placeholder="Categoría" placeholderTextColor="#666" />
            
            <View style={styles.modalBotones}>
              <TouchableOpacity style={styles.botonCancelar} onPress={() => setModalVisible(false)}>
                <Text style={styles.textoBoton}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botonGuardarModal} onPress={guardarEdicion}>
                <Text style={styles.textoBoton}>Guardar Cambios</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#0A0A0A', padding: 15 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A' },
  textoVacio: { color: '#888', marginTop: 10, fontSize: 16 },
  tarjeta: { backgroundColor: '#1A1A1A', padding: 15, borderRadius: 10, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  info: { flex: 1 },
  titulo: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  precio: { color: '#A259FF', fontSize: 16, fontWeight: 'bold', marginVertical: 4 },
  detalle: { color: '#888', fontSize: 14 },
  controles: { flexDirection: 'row', gap: 10 },
  botonEditar: { backgroundColor: '#333', padding: 10, borderRadius: 8 },
  botonEliminar: { backgroundColor: '#FF5252', padding: 10, borderRadius: 8 },
  
  modalFondo: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)', padding: 20 },
  modalTarjeta: { backgroundColor: '#1A1A1A', padding: 20, borderRadius: 15 },
  modalTitulo: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { backgroundColor: '#333', color: '#FFF', padding: 12, borderRadius: 8, marginBottom: 10 },
  modalBotones: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  botonCancelar: { backgroundColor: '#555', padding: 12, borderRadius: 8, flex: 1, marginRight: 5, alignItems: 'center' },
  botonGuardarModal: { backgroundColor: '#A259FF', padding: 12, borderRadius: 8, flex: 1, marginLeft: 5, alignItems: 'center' },
  textoBoton: { color: '#FFF', fontWeight: 'bold' }
});
