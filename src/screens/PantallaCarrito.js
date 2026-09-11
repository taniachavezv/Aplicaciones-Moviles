import React, { useContext } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { CartContext } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';

export default function PantallaCarrito() {
  //------------------------------------------------------------------------------------------------------------------------
  // agregamos la nueva función 'vaciarCarrito' para extraerla junto con las otras funciones del contexto
  const { carrito, cambiarCantidad, eliminarDelCarrito, vaciarCarrito } = useContext(CartContext);

  // Calcula el subtotal sumando (precio * cantidad) de cada producto
  const subtotal = carrito.reduce((acumulador, item) => acumulador + (item.price * item.cantidad), 0);

  // =========================================================
  // ENVIO Y TOTAL
  // =========================================================
  // Instrucciones:
  // 1. Crea una variable llamada 'costoEnvio' que calcule el 5% del 'subtotal' (multiplica por 0.05)
  // 2. Crea una variable 'totalFinal' que sume el 'subtotal' + 'costoEnvio' 
  // (Reemplaza los ceros por tus operaciones matematicas)
  
  const costoEnvio = subtotal * 0.5;
  const totalFinal = subtotal + costoEnvio;
  // =========================================================

  if (carrito.length === 0) {
    return (
      <View style={styles.centro}>
        <Ionicons name="cart-outline" size={80} color="#333" />
        <Text style={styles.textoVacio}>Tu carrito está vacío</Text>
      </View>
    );
  }

  //=========================================================================================================================
  // declara una constante llamada procesarPago que apunte a una alerta, guiate del ejemplo en la practica
  const procesarPago = () => {
    Alert.alert(
        "Pago Exitoso",
        "Te hemos enviado la información de tu pedido al correo.",
        [
            {
                text: "Aceptar",
                onPress: () => vaciarCarrito()
            }
        ]
    );
  };


  //=========================================================================================================================

  return (
    <View style={styles.contenedor}>
      <FlatList
        data={carrito}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.tarjeta}>
            <Image source={{ uri: item.image }} style={styles.imagen} />
            <View style={styles.info}>
              <Text style={styles.titulo} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.precio}>${(item.price * item.cantidad).toFixed(2)}</Text>
              
              <View style={styles.controles}>
                <TouchableOpacity onPress={() => cambiarCantidad(item.id, 'restar')} style={styles.botonCirculo}>
                  <Ionicons name="remove" size={16} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.cantidad}>{item.cantidad}</Text>
                <TouchableOpacity onPress={() => cambiarCantidad(item.id, 'sumar')} style={styles.botonCirculo}>
                  <Ionicons name="add" size={16} color="#FFF" />
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => eliminarDelCarrito(item.id)} style={styles.botonBasura}>
                  <Ionicons name="trash-outline" size={20} color="#FF5252" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* TICKET DE COMPRA */}
      <View style={styles.ticket}>
        {/* ------------------------------------------------------------------------------------------------------------ */}
        {/* Observa como esta construido Subtotal, replica la misma estrutura pero ahora para envio y total */}
        {/* -------------------------------------------------------------------------------------------------------------*/}
        <View style={styles.filaTicket}>
          <Text style={styles.textoTicket}>Subtotal:</Text>
          <Text style={styles.textoTicket}>${subtotal.toFixed(2)}</Text>
        </View>

        {/* usa el estilo textoTicketEnvio para los Text */}
        <View style={styles.filaTicket}>
            <Text style={styles.textoTicketEnvio}>Envio (5%):</Text>
            <Text style={styles.textoTicketEnvio}>${costoEnvio.toFixed(2)}</Text>
        </View>
        
        {/* usa el estilo textoTotal y textoTotalGrande para los Text */}
        <View style={[styles.filaTicket, styles.filaTotal]}>
            <Text style={styles.textoTotal}>Total:</Text>
            <Text style={styles.textoTotalGrande}>${totalFinal.toFixed(2)}</Text>
        </View>

        {/* agregale al boton la propiedad onPress con la funcion para procesar el pago */}
        <TouchableOpacity style={styles.botonPagar} onPress={procesarPago} >
          <Text style={styles.textoBotonPagar}>Proceder al Pago</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#0A0A0A' },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A' },
  textoVacio: { color: '#888', fontSize: 18, marginTop: 10 },
  tarjeta: { flexDirection: 'row', backgroundColor: '#1A1A1A', margin: 15, marginBottom: 5, borderRadius: 10, padding: 10 },
  imagen: { width: 80, height: 80, resizeMode: 'contain', backgroundColor: '#FFF', borderRadius: 5 },
  info: { flex: 1, paddingLeft: 15, justifyContent: 'space-between' },
  titulo: { color: '#FFF', fontSize: 14 },
  precio: { color: '#A259FF', fontSize: 16, fontWeight: 'bold' },
  controles: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  botonCirculo: { backgroundColor: '#333', borderRadius: 15, width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
  cantidad: { color: '#FFF', marginHorizontal: 15, fontSize: 16, fontWeight: 'bold' },
  botonBasura: { marginLeft: 'auto' }, // Empuja el bote de basura a la derecha
  
  ticket: { backgroundColor: '#1A1A1A', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  filaTicket: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  textoTicket: { color: '#CCC', fontSize: 16 },
  textoTicketEnvio: { color: '#888', fontSize: 14 },
  filaTotal: { borderTopWidth: 1, borderTopColor: '#333', paddingTop: 15, marginTop: 5 },
  textoTotal: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  textoTotalGrande: { color: '#A259FF', fontSize: 22, fontWeight: '900' },
  botonPagar: { backgroundColor: '#A259FF', padding: 15, borderRadius: 30, alignItems: 'center', marginTop: 15 },
  textoBotonPagar: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});