import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { CartContext } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';

export default function PantallaInicio() {
  const { agregarAlCarrito } = useContext(CartContext);
  
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('todos');

  // Consumimos la API al cargar la pantalla
  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
        setProductos(data);
        setCargando(false);
      });
  }, []);

  // Motor de filtrado (Busqueda por texto + Categoria)
  const productosFiltrados = productos.filter((item) => {
    const coincideTexto = item.title.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaActiva === 'todos' || item.category === categoriaActiva;
    return coincideTexto && coincideCategoria;
  });

  if (cargando) {
    return <View style={styles.centro}><ActivityIndicator size="large" color="#A259FF" /></View>;
  }

  return (
    <View style={styles.contenedor}>
      {/* BARRA DE BUSQUEDA */}
      <View style={styles.cajaBusqueda}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput 
          style={styles.inputBusqueda} 
          placeholder="Buscar producto..." 
          placeholderTextColor="#888"
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {/* FILTROS DE CATEGORIAS */}
      <View style={styles.contenedorFiltros}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          
          <TouchableOpacity 
            style={[styles.pildora, categoriaActiva === 'todos' && styles.pildoraActiva]}
            onPress={() => setCategoriaActiva('todos')}
          >
            <Text style={categoriaActiva === 'todos' ? styles.textoPildoraActiva : styles.textoPildora}>Todos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.pildora, categoriaActiva === 'electronics' && styles.pildoraActiva]}
            onPress={() => setCategoriaActiva('electronics')}
          >
            <Text style={categoriaActiva === 'electronics' ? styles.textoPildoraActiva : styles.textoPildora}>Electrónica</Text>
          </TouchableOpacity>

          {/* ========================================================= */}
          {/*                   CATEGORIAS FALTANTES                    */}
          {/* ========================================================= */}
          {/* Instrucciones: Replica los botones de arriba para agregar:
              1. 'jewelery' (Joyeria)
              2. "men's clothing" (Ropa de Hombre)
              3. "women's clothing" (Ropa de Mujer) 
              asegurate de pasar exactamente el string correcto al onPress. */}
          
          {/* Escribe tu codigo aqui abajo: */}
          <TouchableOpacity
            style={[styles.pildora, categoriaActiva === 'jewelery' && styles.pildoraActiva]}
            onPress={() => setCategoriaActiva('jewelery')}
        >
            <Text style={categoriaActiva === 'jewelery' ? styles.textoPildoraActiva : styles.textoPildora}>Joyería</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pildora, categoriaActiva === "men's clothing" && styles.pildoraActiva]}
            onPress={() => setCategoriaActiva("men's clothing")}
        >
            <Text style={categoriaActiva === "men's clothing" ? styles.textoPildoraActiva : styles.textoPildora}>Ropa de Hombre</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pildora, categoriaActiva === "women's clothing" && styles.pildoraActiva]}
            onPress={() => setCategoriaActiva("women's clothing")}
        >
            <Text style={categoriaActiva === "women's clothing" ? styles.textoPildoraActiva : styles.textoPildora}>Ropa de Mujer</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>

      {/* LISTA DE PRODUCTOS */}
      <FlatList
        data={productosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.tarjeta}>
            <Image source={{ uri: item.image }} style={styles.imagen} />
            <View style={styles.info}>
              <Text style={styles.titulo} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.precio}>${item.price.toFixed(2)}</Text>
              <TouchableOpacity style={styles.botonAgregar} onPress={() => agregarAlCarrito(item)}>
                <Text style={styles.textoBoton}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#0A0A0A' },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A' },
  cajaBusqueda: { flexDirection: 'row', backgroundColor: '#1A1A1A', margin: 15, padding: 12, borderRadius: 10, alignItems: 'center' },
  inputBusqueda: { flex: 1, color: '#FFF', marginLeft: 10 },
  contenedorFiltros: { paddingHorizontal: 15, marginBottom: 10 },
  pildora: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: '#1A1A1A', borderRadius: 20, marginRight: 10 },
  pildoraActiva: { backgroundColor: '#A259FF' },
  textoPildora: { color: '#888' },
  textoPildoraActiva: { color: '#FFF', fontWeight: 'bold' },
  tarjeta: { flexDirection: 'row', backgroundColor: '#1A1A1A', marginHorizontal: 15, marginBottom: 15, borderRadius: 10, overflow: 'hidden', padding: 10 },
  imagen: { width: 100, height: 100, resizeMode: 'contain', backgroundColor: '#FFF', borderRadius: 5 },
  info: { flex: 1, paddingLeft: 15, justifyContent: 'space-between' },
  titulo: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  precio: { color: '#A259FF', fontSize: 18, fontWeight: 'bold' },
  botonAgregar: { backgroundColor: '#333', padding: 8, borderRadius: 5, alignItems: 'center' },
  textoBoton: { color: '#FFF', fontSize: 12 }
});