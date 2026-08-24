// Importacion de librerías
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator, Keyboard, Animated} from 'react-native';
import {Ionicons} from '@expo/vector-icons'; 
// Importación del módulo de reproducción y manjeo de audio de Expo
import { Audio } from 'expo-av';

// Componente principal de la app
export default function App(){

  // Estados locales para la gestión de la búsqueda y la interfaz de datos
  const[busqueda, setBusqueda] = useState(''); // Almacena el texto ingresado en el buscador
  const[resultado, setResultado] = useState([]); // Lista de canciones obtenidas desde la API
  const[cargando, setCargando] = useState(false); // Bandera para mostrar/ocultar el indicador de carga

  // Estados locales para el control del reproductor de audio
  const[cancionActiva, setCancionActiva] = useState(null); // Objeto con los datos de la pista en reproducción
  const[sonidoActual, setsonidoActual] = useState(null); // Instancia del objeto Audio.Sound cargando en memoria
  const[estaReproduciendo, setEstaReproduciendo] = useState(false); // Estado booleano de reproducción activa/pausada

  // Referencia mutable para el valor animado del ecualizador visual
  const animacionEcualizador = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Detiene y reinicia la animación a su punto inicial al cambiar de estado o canción
    animacionEcualizador.stopAnimation();
    animacionEcualizador.setValue(0);

    // Si la música se está reproduciendo, inicia un bucle continuo de subida y bajada
    if(estaReproduciendo){
      Animated.loop(
        Animated.sequence([
          Animated.timing(animacionEcualizador,{toValue: 1, duration: 300, useNativeDriver: false}),
          Animated.timing(animacionEcualizador,{toValue: 0, duration: 300, useNativeDriver: false}),
        ])
      ).start();
    }
  }, [estaReproduciendo,cancionActiva]);

  // Interpolaciones para calcular alturas dinámicas e independientes para cada barra del ecualizador
  const altoBarra1 = animacionEcualizador.interpolate({inputRange: [0, 1], outputRange: [8,22]});
  const altoBarra2 = animacionEcualizador.interpolate({inputRange: [0, 1], outputRange: [24,10]});
  const altoBarra3 = animacionEcualizador.interpolate({inputRange: [0, 1], outputRange: [12,18]});

  // Función asíncrona para consultar canciones en la API pública de iTunes Search
  const buscarMusica = async () => {
    // Evita realizar peticiones si el campo de texto está vacío o solo contiene espacios
    if(busqueda.trim() === '') return;

    Keyboard.dismiss(); // Oculta el teclado virtual en pantalla
    setCargando(true); // Activa el loader

    try{
      // Formatea el término de búsqueda reemplazando espacios por signos '+' según los requisitos de la API
      const terminoLimpio = busqueda.replace(/ /g,'+');
      const url =`https://itunes.apple.com/search?term=${terminoLimpio}&media=music&limit=30`;

      // Realiza la petición HTTP y parsea la respuesta JSON
      const respuesta = await fetch(url);
      const json = await respuesta.json(); // Actualiza la lista de resultados con los datos recibidos
      setResultado(json.results);
    }catch(error){
      console.error(error); // Captura y muestra errores de red o parsing en consola 
    }finally{
      setCargando(false); // Desactiva el loader sin importar el resultado de la petición 
    }
  };

  // Función callback que monitorea los eventos y cambios de estado del audio
  const monitorDeReproduccion = (estado) => {
    // Detecta si el preview de audio llegó a su fin de forma natural
    if(estado.didJustFinish){
      setEstaReproduciendo(false);
      setCancionActiva(null);
    }
  };

  // Función asíncrona encargada de cargar y reproducir una pista musical seleccionada
  const reproducirCancion = async (cancion) => {
    try{
      // Si ya existía un audio en reproducción, lo descarga de la memoria antes de cargar el nuevo
      if(sonidoActual){
        await sonidoActual.unloadAsync();
      }
      setCancionActiva(cancion);
      setEstaReproduciendo(true);

      // Configura el modo de audio global para que suene incluso con el modo silencio activo en iOS
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true});

      // Crea e inicializa la nueva instancia de sonido con la URL del preview y el callback de estado
      const {sound} = await Audio.Sound.createAsync(
        {uri: cancion.previewUrl},
        { shouldPlay: true},
        monitorDeReproduccion
      );
      setsonidoActual(sound); // Guarda la referencia del objeto de audio en el estado
    }catch(error){
      console.log("Error  al reproducir: ", error);
    }
  };

  // Alterna entre estados de pausa y reproducción del sonido actual
  const alternarPlayPause = async() => {
    if(!sonidoActual) return;

    if(estaReproduciendo){
      await sonidoActual.pauseAsync(); // Pusa el audio
      setEstaReproduciendo(false);
    }else{
      await sonidoActual.playAsync(); // Reanuda la reproducción
      setEstaReproduciendo(true);
    }
  };
  
  // Limpieza de memoria
  useEffect(() => {
    return sonidoActual ? () => {sonidoActual.unloadAsync(); } : undefined;
  }, [sonidoActual]);

  // Estructura visual y renderizado de la UI del componente
  return(
    <View style={styles.contenedor}>
      <View style ={styles.encabezado}>
        <Text style={styles.tituloHeader}>Explorar Musica</Text>
        <View style = {styles.contenedorBusqueda}>
          <TextInput
            style = {styles.input}
            placeholder="Bucar Cancion o artista..."
            placeholderTextColor="#888"
            value={busqueda}
            onChangeText = {setBusqueda}
            onSubmitEditing ={buscarMusica}
          />
          <TouchableOpacity style = {styles.botonBuscar} onPress={buscarMusica}>
            <Ionicons name ="search" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Renderizado condicional: muestra el spinner de carga o la lista de resultados */}
      {cargando ? (
        <View style={styles.zonaCentrada}>
          <ActivityIndicator size = "large" color="#A259FF" />
        </View>
      ) : (
        <FlatList
          data= {resultado}
          keyExtractor={(item) => item.trackId.toString()}

          contentContainerStyle={{paddingBottom: cancionActiva ? 90 : 20}}
          renderItem={({item}) => {

            const esLaActiva = cancionActiva?.trackId === item.trackId;

            return (
              <TouchableOpacity style={styles.tarjetaCancion} onPress={() => reproducirCancion(item)}>
                <Image source={{uri: item.artworkUrl100}} style={styles.portada}/>
                <View style ={styles.infoCancion}>
                  <Text style={[styles.tituloCancion, esLaActiva && { color: '#A259FF'}]} numberOfLines={1}>
                    {item.trackName}
                  </Text> 
                  <Text style={styles.artistaCancion} numberOfLines={1}>{item.artistName}</Text>
                </View>

                {/* Muestra las barras animadas del ecualizador si está sonando, o el icono de play */}
                {esLaActiva && estaReproduciendo ?(
                  <View style = {styles.contenedorEcualizador}>
                    <Animated.View style={[styles.barraEcualizador, { height: altoBarra1}]}/>
                    <Animated.View style={[styles.barraEcualizador, { height: altoBarra2}]}/>
                    <Animated.View style={[styles.barraEcualizador, { height: altoBarra3}]}/>
                  </View>
                ) : (
                  <Ionicons name = "play-circle" size={32} color={esLaActiva ? "#A259FF": "#444"} />
                )}
              </TouchableOpacity>
            )
          }}
        />
      )}

      {/* Barra de control inferior flotante (Mini reproductor), visible solo si hay una canción activa */}
      {cancionActiva && (
        <View style={styles.miniReproductor}>
          <View style={styles.inferiorMiniReproductor}>

            {/* Portada en tamaño reducido */}
            <Image source={{uri: cancionActiva.artworkUrl100}} style={styles.portadaMini} />

            {/* Información básica de la pista activa */}
            <View style={styles.infoMini}>
              <Text style={styles.tituloMini} numberOfLines={1}>{cancionActiva.trackName}</Text>
              <Text style={styles.artistaMini} numberOfLines={1}>{cancionActiva.artistName}</Text>
            </View>

            {/* Botón interactivo para pausar o reanudar el audio */}
            <TouchableOpacity onPress={alternarPlayPause} style={styles.botonPlayPause}>
              <Ionicons
                name= {estaReproduciendo ? "pause-circle" : "play-circle"}
                size= {40}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>

      )}
    </View>
  );
} 

// --- ESTILOS ---
const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 45
  },
  encabezado: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  tituloHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 15,
  },
  contenedorBusqueda: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
  },
  botonBuscar: {
    padding: 8,
    backgroundColor: '#A259FF',
    borderRadius: 8,
    marginLeft: 10,
  },
  zonaCentrada: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tarjetaCancion: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
  },
  portada: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  infoCancion: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  tituloCancion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  artistaCancion: {
    fontSize: 14,
    color: '#AAA',
  },
  contenedorEcualizador: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 24,
    width: 32,
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  barraEcualizador: {
    width: 4,
    backgroundColor: '#A259FF',
    borderRadius: 2,
  },
  miniReproductor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2C2C2E',
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  inferiorMiniReproductor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  portadaMini: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  infoMini: {
    flex: 1,
    marginLeft: 15,
  },
  tituloMini: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  artistaMini: {
    fontSize: 14,
    color: '#CCC',
  },
  botonPlayPause: {
    padding: 5,
  }
});