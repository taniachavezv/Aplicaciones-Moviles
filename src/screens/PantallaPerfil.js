import React, { useState, useEffect } from 'react';
// importamos los componentes visuales basicos de react native
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, ScrollView, Modal } from 'react-native';
// importamos la herramienta para acceder a la galeria del celular
import * as ImagePicker from 'expo-image-picker';
// importamos la herramienta para crear listas desplegables
import { Picker } from '@react-native-picker/picker';
// importamos nuestra conexion a la base de datos en la nube
import { db } from '../credenciales/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function PantallaPerfil() {
  // variable para controlar si el formulario flotante (modal) esta abierto o cerrado
  const [modalVisible, setModalVisible] = useState(false);

  // =========================================================
  // reto 1: declaracion de estados
  // =========================================================
  // instrucciones: declara los 10 estados que usara nuestro perfil.
  // 5 textos (inicializados en '') y 5 imagenes (inicializados en null).
  // ejemplo texto: const [nombre, setNombre] = useState('');
  // ejemplo imagen: const [portada, setPortada] = useState(null);
  
  // escribe tu codigo aqui abajo (te faltan 8):
  const [nombre, setNombre] = useState('');
  const [frase, setFrase] = useState('');
  const [edad, setEdad] = useState('');
  const [genero, setGenero] = useState('');
  const [estadoCivil, setEstadoCivil] = useState('');

  const [portada, setPortada] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [destacada1, setDestacada1] = useState(null);
  const [destacada2, setDestacada2] = useState(null);
  const [destacada3, setDestacada3] = useState(null);
  
  // =========================================================

  // creamos una lista automatica de numeros del 15 al 99 para las edades
  const opcionesEdad = Array.from({ length: 85 }, (_, i) => (i + 15).toString());

  // funcion que abre la galeria, permite recortar la foto y la convierte a texto (base64)
  const seleccionarImagen = async (setEstadoImagen) => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3], // forzamos un recorte horizontal
      quality: 0.1,   // calidad muy baja para que la base de datos no la rechace
      base64: true,   // activamos la traduccion de imagen a texto
    });

    if (!resultado.canceled) {
      // si el usuario no cancelo, guardamos la imagen en el estado correspondiente
      setEstadoImagen(`data:image/jpeg;base64,${resultado.assets[0].base64}`);
    }
  };

  // funcion para subir nuestra informacion a la nube
  const guardarPerfil = async () => {
    try {
      // preparamos el "sobre" con la direccion a donde enviaremos los datos
      const docRef = doc(db, "usuarios", "mi_perfil");
      
      // =========================================================
      // reto 2: guardar datos en firestore
      // =========================================================
      // instrucciones: envia a la base de datos un objeto con las 10 propiedades.
      // asegúrate de nombrar la llave igual que la variable de tu estado.
      
      await setDoc(docRef, {
        nombre: nombre,
        frase: frase,
        edad: edad,
        genero: genero,
        estadoCivil: estadoCivil,
        portada: portada,
        perfil: perfil,
        destacada1: destacada1,
        destacada2: destacada2,
        destacada3: destacada3,
        // escribe tu codigo aqui abajo (te faltan 9):
        
        
      });
      // =========================================================
      
      // cerramos el modal y mostramos un aviso de exito
      setModalVisible(false);
      Alert.alert('exito', 'perfil actualizado en la nube');
    } catch (error) {
      Alert.alert('error', 'no se pudo guardar el perfil');
      console.log(error);
    }
  };

  // funcion para descargar nuestra informacion de la nube
  const cargarPerfil = async () => {
    try {
      // buscamos nuestro documento en la base de datos
      const docRef = doc(db, "usuarios", "mi_perfil");
      const docSnap = await getDoc(docRef);
      
      // si el documento existe, extraemos la informacion
      if (docSnap.exists()) {
        // =========================================================
        // reto 3: recuperar datos de firestore
        // =========================================================
        // instrucciones: extrae los valores del objeto 'datos' y actualiza tus estados.
        // usa el operador logico || para poner un valor por defecto si el campo esta vacio.
        // te dejamos un ejemplo de texto y uno de imagen.
        
        const datos = docSnap.data();
        setNombre(datos.nombre || '');
        setFrase(datos.frase || '');
        setEdad(datos.edad || '');
        setGenero(datos.genero || '');
        setEstadoCivil(datos.estadoCivil || '');

        setPerfil(datos.perfil || null);
        setPortada(datos.portada || null);
        setDestacada1(datos.destacada1 || null);
        setDestacada2(datos.destacada2 || null);
        setDestacada3(datos.destacada3 || null);
        
        // escribe tu codigo aqui abajo (te faltan 8):
        
        
        
        // =========================================================
      }
    } catch (error) {
      console.log("error al cargar: ", error);
    }
  };

  // si el usuario se arrepiente, recargamos la info original y cerramos la ventana
  const cancelarEdicion = () => {
    cargarPerfil();
    setModalVisible(false);
  };

  // useeffect es un vigía que ejecuta cargarPerfil() automaticamente al abrir la app
  useEffect(() => {
    cargarPerfil();
  }, []);

  return (
    <View style={styles.contenedor}>
      {/* ========================================================= */}
      {/* 1. PANTALLA PRINCIPAL (SOLO LECTURA)                        */}
      {/* ========================================================= */}
      <ScrollView>
        <View style={styles.cajaPortada}>
          {portada ? <Image source={{ uri: portada }} style={styles.imagenPortada} /> : <Text style={styles.textoGris}>sin portada</Text>}
        </View>

        <View style={styles.contenedorPerfilReadOnly}>
          <View style={styles.cajaPerfil}>
            {perfil ? <Image source={{ uri: perfil }} style={styles.imagenPerfil} /> : <Text style={styles.textoGrisPequeno}>sin foto</Text>}
          </View>
        </View>

        <View style={styles.infoReadOnly}>
          <Text style={styles.textoNombre}>{nombre || 'Usuario Desconocido'}</Text>
          <Text style={styles.textoFrase}>{frase || 'me gusta...'}</Text>
        </View>

        <View style={styles.filaEstadisticas}>
          <View style={styles.cajaEstadistica}>
            <Text style={styles.labelEstadistica}>Edad</Text>
            <Text style={styles.valorEstadistica}>{edad ? `${edad} años` : '--'}</Text>
          </View>
          <View style={styles.divisor} />
          <View style={styles.cajaEstadistica}>
            <Text style={styles.labelEstadistica}>Género</Text>
            <Text style={styles.valorEstadistica}>{genero || '--'}</Text>
          </View>
          <View style={styles.divisor} />
          <View style={styles.cajaEstadistica}>
            <Text style={styles.labelEstadistica}>Estado Civil</Text>
            <Text style={styles.valorEstadistica}>{estadoCivil || '--'}</Text>
          </View>
        </View>

        <Text style={styles.tituloSeccion}>Fotos Destacadas</Text>
        <View style={styles.filaDestacadas}>
          {/* ========================================================= */}
          {/* reto 4: vista de fotos destacadas                         */}
          {/* ========================================================= */}
          {/* instrucciones: basandote en la foto destacada 1, replica el   */}
          {/* componente <View> para renderizar la foto 2 y la foto 3.  */}
          
          <View style={styles.cajaDestacada}>{destacada1 ? <Image source={{ uri: destacada1 }} style={styles.imgDestacada} /> : <Text style={styles.textoGrisPequeno}>vacío</Text>}</View>
          <View style={styles.cajaDestacada}>{destacada2 ? <Image source={{ uri: destacada2 }} style={styles.imgDestacada} /> : <Text style={styles.textoGrisPequeno}>vacío</Text>}</View>
          <View style={styles.cajaDestacada}>{destacada3 ? <Image source={{ uri: destacada3 }} style={styles.imgDestacada} /> : <Text style={styles.textoGrisPequeno}>vacío</Text>}</View>
          
          {/* escribe tu codigo aqui abajo: */}
          
          
          {/* ========================================================= */}
        </View>

        <TouchableOpacity style={styles.botonAbrirModal} onPress={() => setModalVisible(true)}>
          <Text style={styles.textoBoton}>editar perfil</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ========================================================= */}
      {/* 2. MODAL DE EDICION (FORMULARIO OCULTO)                     */}
      {/* ========================================================= */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <ScrollView style={styles.contenedorModal}>
          <Text style={styles.tituloModal}>Editar Perfil</Text>

          <TouchableOpacity onPress={() => seleccionarImagen(setPortada)}>
            <View style={styles.cajaPortada}>
              {portada ? <Image source={{ uri: portada }} style={styles.imagenPortada} /> : <Text style={styles.textoGris}>toca para portada</Text>}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => seleccionarImagen(setPerfil)} style={styles.botonPerfil}>
            <View style={styles.cajaPerfil}>
              {perfil ? <Image source={{ uri: perfil }} style={styles.imagenPerfil} /> : <Text style={styles.textoGrisPequeno}>toca para foto</Text>}
            </View>
          </TouchableOpacity>

          <View style={styles.formulario}>
            {/* onchangetext actualiza el estado cada vez que el usuario teclea algo */}
            <TextInput style={styles.inputNombre} placeholder="tu nombre" placeholderTextColor="#666" value={nombre} onChangeText={setNombre} />
            <TextInput style={styles.inputFrase} placeholder="me gusta..." placeholderTextColor="#666" value={frase} onChangeText={setFrase} />
            
            <Text style={styles.labelPicker}>Selecciona tu edad:</Text>
            <View style={styles.cajaPicker}>
              <Picker selectedValue={edad} onValueChange={setEdad} style={styles.picker} dropdownIconColor="#000">
                <Picker.Item label="Seleccionar..." value="" color="#888" />
                {opcionesEdad.map(anio => (
                  <Picker.Item key={anio} label={`${anio} años`} value={anio} color="#000" />
                ))}
              </Picker>
            </View>

            <Text style={styles.labelPicker}>Selecciona tu género:</Text>
            <View style={styles.cajaPicker}>
              <Picker selectedValue={genero} onValueChange={setGenero} style={styles.picker} dropdownIconColor="#000">
                {/* ========================================================= */}
                {/* reto 5: opciones de genero                                */}
                {/* ========================================================= */}
                {/* instrucciones: agrega los Picker.Item para Hombre, Mujer, */}
                {/* No binario y Prefiero no decirlo. recuerda el color="#000".*/}
                
                <Picker.Item label="Seleccionar..." value="" color="#888" />
                {/* escribe tu codigo aqui abajo: */}
                <Picker.Item label="Hombre" value="Hombre" color="#000" />
                <Picker.Item label="Mujer" value="Mujer" color="#000" />
                <Picker.Item label="No binario" value="No binario" color="#000" />
                <Picker.Item label="Prefiero no decirlo" value="Prefiero no decirlo" color="#000" />
                {/* ========================================================= */}
              </Picker>
            </View>

            <Text style={styles.labelPicker}>Situación civil:</Text>
            <View style={styles.cajaPicker}>
              <Picker selectedValue={estadoCivil} onValueChange={setEstadoCivil} style={styles.picker} dropdownIconColor="#000">
                {/* ========================================================= */}
                {/* reto 6: opciones de estado civil                          */}
                {/* ========================================================= */}
                {/* instrucciones: agrega los Picker.Item para Soltero/a,     */}
                {/* Casado/a, Unión libre, Viudo/a y Divorciado/a.            */}
                
                <Picker.Item label="Seleccionar..." value="" color="#888" />
                <Picker.Item label="Soltero/a" value="Soltero/a" color="#000" />
                <Picker.Item label="Casado/a" value="Casado/a" color="#000" />
                <Picker.Item label="Unión libre" value="Unión libre" color="#000" />
                <Picker.Item label="Viudo/a" value="Viudo/a" color="#000" />
                <Picker.Item label="Divorciado/a" value="Divorciado/a" color="#000" />
                
                {/* escribe tu codigo aqui abajo: */}
                
                
                {/* ========================================================= */}
              </Picker>
            </View>
          </View>

          <Text style={styles.tituloSeccion}>editar fotos destacadas</Text>
          <View style={styles.filaDestacadas}>
            {/* ========================================================= */}
            {/* reto 7: edicion de fotos destacadas                       */}
            {/* ========================================================= */}
            {/* instrucciones: te damos la estructura del boton para editar   */}
            {/* la foto 1. basandote en esto, programa los botones para la    */}
            {/* destacada2 y destacada3.                                      */}
            
            <TouchableOpacity onPress={() => seleccionarImagen(setDestacada1)}>
              <View style={styles.cajaDestacada}>{destacada1 ? <Image source={{ uri: destacada1 }} style={styles.imgDestacada} /> : <Text style={styles.textoGrisPequeno}>toca</Text>}</View>
            </TouchableOpacity>
            
            {/* escribe tu codigo aqui abajo: */}
            <TouchableOpacity onPress={() => seleccionarImagen(setDestacada2)}>
              <View style={styles.cajaDestacada}>{destacada2 ? <Image source={{ uri: destacada2 }} style={styles.imgDestacada} /> : <Text style={styles.textoGrisPequeno}>toca</Text>}</View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => seleccionarImagen(setDestacada3)}>
              <View style={styles.cajaDestacada}>{destacada3 ? <Image source={{ uri: destacada3 }} style={styles.imgDestacada} /> : <Text style={styles.textoGrisPequeno}>toca</Text>}</View>
            </TouchableOpacity>
            
            {/* ========================================================= */}
          </View>

          <View style={styles.filaBotones}>
            <TouchableOpacity style={styles.botonGuardar} onPress={guardarPerfil}>
              <Text style={styles.textoBoton}>guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonCancelar} onPress={cancelarEdicion}>
              <Text style={styles.textoBotonSecundario}>cancelar</Text>
            </TouchableOpacity>
          </View>
          
          <View style={{ height: 60 }} />
        </ScrollView>
      </Modal>
    </View>
  );
}

// =========================================================
// HOJA DE ESTILOS (CSS)
// aqui le damos diseño, color y tamaño a todos los elementos
// =========================================================
const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#0a0a0a' },
  contenedorModal: { flex: 1, backgroundColor: '#111' },
  tituloModal: { color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  
  cajaPortada: { width: '100%', height: 180, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' },
  imagenPortada: { width: '100%', height: '100%', resizeMode: 'cover' },
  
  contenedorPerfilReadOnly: { alignSelf: 'center', marginTop: -60, zIndex: 10 },
  botonPerfil: { alignSelf: 'center', marginTop: -60, zIndex: 10 },
  cajaPerfil: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#0a0a0a', overflow: 'hidden' },
  imagenPerfil: { width: '100%', height: '100%', resizeMode: 'cover' },
  
  infoReadOnly: { padding: 20, alignItems: 'center', paddingBottom: 10 },
  textoNombre: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginBottom: 5 },
  textoFrase: { color: '#aaa', fontSize: 16, fontStyle: 'italic', textAlign: 'center' },
  
  filaEstadisticas: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a', marginHorizontal: 20, borderRadius: 10, paddingVertical: 15, marginBottom: 20 },
  cajaEstadistica: { alignItems: 'center', flex: 1 },
  labelEstadistica: { color: '#888', fontSize: 12, marginBottom: 5, textTransform: 'uppercase' },
  valorEstadistica: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  divisor: { width: 1, height: '70%', backgroundColor: '#333' },

  formulario: { padding: 20 },
  inputNombre: { color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#333' },
  inputFrase: { color: '#aaa', fontSize: 16, fontStyle: 'italic', textAlign: 'center', marginBottom: 30 },
  
  labelPicker: { color: '#aaa', fontSize: 14, marginBottom: 5, marginLeft: 5 },
  cajaPicker: { backgroundColor: '#fff', borderRadius: 8, marginBottom: 20, overflow: 'hidden' },
  picker: { color: '#000', height: 50 },
  
  tituloSeccion: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginTop: 10, marginBottom: 10 },
  filaDestacadas: { flexDirection: 'row', justifyContent: 'space-evenly', paddingHorizontal: 10 },
  cajaDestacada: { width: 100, height: 100, borderRadius: 10, backgroundColor: '#222', overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  imgDestacada: { width: '100%', height: '100%', resizeMode: 'cover' },
  
  botonAbrirModal: { backgroundColor: '#a259ff', paddingVertical: 15, marginHorizontal: 20, borderRadius: 10, alignItems: 'center', marginTop: 40 },
  
  filaBotones: { flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 40 },
  botonGuardar: { backgroundColor: '#a259ff', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10 },
  botonCancelar: { backgroundColor: 'transparent', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10, borderWidth: 1, borderColor: '#ff5252' },
  
  textoBoton: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  textoBotonSecundario: { color: '#ff5252', fontWeight: 'bold', fontSize: 16 },
  textoGris: { color: '#666' },
  textoGrisPequeno: { color: '#666', fontSize: 12 }
});