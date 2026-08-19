import { useState } from "react";
import {StyleSheet,Text,View,FlatList,Image,TouchableOpacity,Alert,Modal,} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

export default function App() {
  // 'galeria' guarda todas las fotos, cada foto sera un objeto asi: { id: '123', uri: 'file://...'}
  const [galeria, setGaleria] = useState([]);

  // 'seleccionadas' guarda Unicamente los numeros de 'id' de las fotos que el usuario marcó
  const [seleccionadas, setSeleccionadas] = useState([]);

  const [fotoExpandida, setFotoExpandida] = useState(null);

  const tomarFoto = async () => {
    if (galeria.length >= 6) {
      Alert.alert("Galeria Llena", "Solo puedes tener un maximo de 6 fotografias");
      return;
    }

    // 2. Solicitar permisos al sistema operativo del celular
    const permisos = await ImagePicker.requestCameraPermissionsAsync();
    if (permisos.status !== "granted") {
      Alert.alert("Permiso Denegado", "Necesitamos acceso a la cámara.");
      return;
    }

    // 3. Configurar y abrir la cámara
    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true, // Abre la pantalla intermedia para recortar la foto
      aspect: [1, 1], // Obliga a que el recorte sea un cuadrado perfecto (1:1)
      quality: 0.5, // Comprime la foto al 50% para no llenar la memoria del teléfono
    });

    // 4. Procesar el resultado: Si el usuario NO cancela la captura...
    if (!resultado.canceled) {
      // Creamos un nuevo objeto empaquetando la ruta de la foto y un ID único basado en la hora actual
      const nuevaFoto = {
        id: Date.now().toString(),
        uri: resultado.assets[0].uri,
      };
      // Clonamos la galeria anterior (...galeria) y le inyectamos la foto nueva al final
      setGaleria([...galeria, nuevaFoto]);
    }
  };

  const alternarSeleccion = (idFoto) => {
    if (seleccionadas.includes(idFoto)) {
      setSeleccionadas(seleccionadas.filter((id) => id !== idFoto));
    } else {
      setSeleccionadas([...seleccionadas, idFoto]);
    }
  };

  const seleccionarTodas = () => {
    if (seleccionadas.length === galeria.length) {
      setSeleccionadas([]);
    } else {
      const todosLosIds = galeria.map((foto) => foto.id);
      setSeleccionadas(todosLosIds);
    }
  };

  // Esta funcion se dispara con el boton de basura
  const borrarSeleccionadas = () => {
    Alert.alert(
      "Confirmar Borrado",
      `¿Eliminar ${seleccionadas.length} foto(s)?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            // Filtramos la galeria para quedarnos unicamente con las foto cuyo ID no exista en el arreglo de 'seleccionadas'
            const galeriaFiltrada = galeria.filter(
              (foto) => !seleccionadas.includes(foto.id)
            );
            setGaleria(galeriaFiltrada);
            setSeleccionadas([]); // Limpiamos el carrito despues de borrar
          },
        },
      ]
    );
  };

  return (
    <View style={styles.contenedor}>
      {/*---ENCABEZADO---*/}
      <View style={styles.encabezado}>
        <Text style={styles.titulo}>Mi Galería</Text>
        <Text style={styles.contadorTexto}>Fotografías: {galeria.length}</Text>
      </View>

      {/*--- ZONA CENTRAL: LA CUADRÍCULA DE FOTOS---*/}
      {galeria.length === 0 ? (
        // RENDERIZADO CONDICIONAL: Si no hay fotos, mostramos este icono gigante
        <View style={styles.estadoVacio}>
          <Ionicons name="images-outline" size={60} color="#ccc" />
          <Text style={styles.textoVacio}>Aún no has tomado ninguna foto.</Text>
        </View>
      ) : (
        // Si sí hay fotos, dibujamos la lista inteligente de 2 columnas
        <FlatList
          data={galeria}
          keyExtractor={(item) => item.id}
          numColumns={2}
          style={styles.lista}
          renderItem={({ item }) => {
            // Verifica si esta foto especifica está dentro de nuestro carrito
            const estaSeleccionada = seleccionadas.includes(item.id);

            return (
              <TouchableOpacity
                style={styles.contenedorFoto}
                // Toque rápido: Abre el Modal enviándole la ruta de la imagen
                onPress={() => setFotoExpandida(item.uri)}
                // Toque largo: Activa el modo selección pasándole el ID
                onLongPress={() => alternarSeleccion(item.id)}
              >
                {/* Dibujamos la imagen. Si esta seleccionada, le aplicamos estilos extra {borde rojo} */}
                <Image
                  source={{ uri: item.uri }}
                  style={[
                    styles.imagen,
                    estaSeleccionada && styles.imagenSeleccionada,
                  ]}
                />

                {/* Si la foto esta seleccionada, sobreponemos el icono de la palomita */}
                {estaSeleccionada && (
                  <View style={styles.checkOverlay}>
                    <Ionicons name="checkmark-circle" size={24} color="#e74c3c" />
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}

      <View style={styles.contenedorControlesAbajo}>
        {/* 1. Boton principal centrado (Tomar foto) */}
        <TouchableOpacity
          style={[
            styles.botonPrincipal,
            galeria.length >= 6 && styles.botonPrincipalDeshabilitado,
          ]}
          onPress={tomarFoto}
          disabled={galeria.length >= 6}
        >
          <Ionicons name="camera" size={24} color="white" />
          <Text style={styles.textoBotonPrincipal}>Tomar foto</Text>
        </TouchableOpacity>

        {/* 2. Fila secundaria: Contiene los botones de Eliminar y Seleccionar */}
        <View style={styles.filaSecundaria}>
          {/* LADO IZQUIERDO: Botón Eliminar (Renderizado Condicional: &&) */}
          <View style={styles.mitadFila}>
            {seleccionadas.length > 0 && (
              <TouchableOpacity
                style={styles.botonIconoTexto}
                onPress={borrarSeleccionadas}
              >
                <Ionicons name="trash" size={20} color="#e74c3c" />
                <Text style={[styles.textoBotonSecundario, { color: "#e74c3c" }]}>
                  ({seleccionadas.length})
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* LADO DERECHO: Boton seleccionar todas (Solo aparece si hay galeria) */}
          <View style={[styles.mitadFila, { alignItems: "flex-end" }]}>
            {galeria.length > 0 && (
              <TouchableOpacity
                style={styles.botonIconoTexto}
                onPress={seleccionarTodas}
              >
                <Ionicons
                  // Si están seleccionadas todas, cambia el ícono a una 'X'
                  name={
                    seleccionadas.length === galeria.length
                      ? "close-circle-outline"
                      : "checkmark-done-circle-outline"
                  }
                  size={20}
                  color={
                    seleccionadas.length === galeria.length
                      ? "#7f8c8d"
                      : "#005691"
                  }
                />
                <Text
                  style={[
                    styles.textoBotonSecundario,
                    {
                      color:
                        seleccionadas.length === galeria.length
                          ? "#7f8c8d"
                          : "#005691",
                    },
                  ]}
                >
                  {seleccionadas.length === galeria.length
                    ? "Desmarcar"
                    : "Seleccionar todo"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* El modal solo es visible si 'fotoExpandida' tiene información (!== null) */}
      <Modal
        visible={fotoExpandida !== null}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.fondoModal}>
          {/* Botón flotante para cerrar. Al presionarlo, limpiamos el estado de 'fotoExpandida' */}
          <TouchableOpacity
            style={styles.botonCerrarModal}
            onPress={() => setFotoExpandida(null)}
          >
            <Ionicons name="close-circle" size={40} color="white" />
          </TouchableOpacity>

          {/* Mostramos la imagen. 'resizeMode="contain"' asegura que la foto se ajuste a la pantalla sin deformarse */}
          {fotoExpandida && (
            <Image
              source={{ uri: fotoExpandida }}
              style={styles.imagenCompleta}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

// ==========================================================
// ESTILOS VISUALES
// ==========================================================

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: "#f8f9fa", paddingTop: 60 },
  encabezado: { alignItems: "center", marginBottom: 15 },
  titulo: { fontSize: 28, fontWeight: "bold", color: "#2c3e50" },
  contadorTexto: { fontSize: 16, color: "#7f8c8d", marginTop: 2 },

  lista: { paddingHorizontal: 15 },
  estadoVacio: { flex: 1, justifyContent: "center", alignItems: "center" },
  textoVacio: { fontSize: 18, color: "#bdc3c7", marginTop: 10 },

  contenedorFoto: { flex: 1, margin: 5, position: "relative" },
  imagen: { width: "100%", height: 180, borderRadius: 12 },
  // Estilo aplicado dinámicamente cuando la foto entra al arreglo de 'seleccionadas'
  imagenSeleccionada: { borderWidth: 4, borderColor: "#e74c3c", opacity: 0.7 },
  checkOverlay: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 12,
  },

  contenedorControlesAbajo: {
    paddingTop: 15,
    paddingBottom: 35,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  botonPrincipal: {
    flexDirection: "row",
    backgroundColor: "#005691",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  botonPrincipalDeshabilitado: {
    backgroundColor: "#bdc3c7",
  },
  textoBotonPrincipal: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },

  filaSecundaria: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  mitadFila: {
    flex: 1,
  },
  botonIconoTexto: {
    flexDirection: "row",
    alignItems: "center",
  },
  textoBotonSecundario: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 6,
  },

  fondoModal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  botonCerrarModal: { position: "absolute", top: 50, right: 20, zIndex: 10 },
  imagenCompleta: { width: "100%", height: "80%" },
});