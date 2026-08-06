// Sirve para crear la "memoria" de la aplicación.
// Permite que la pantalla se actualice automáticamente cuando los datos cambian.
import { useState } from 'react';

// Importamos los componentes preconstruidos de React Native
import { 
  StyleSheet,       // Para crear los estilos (es el motor de CSS de React Native).
  Text,             // Para mostrar cualquier texto en pantalla.
  View,             // El contenedor principal .
  TextInput,        // La caja donde el usuario escribe (equivalente a <input type="text">).
  Button,           // Un botón nativo.
  FlatList,         // Una lista inteligente que solo renderiza los elementos que caben en pantalla.
  TouchableOpacity  // Un contenedor que hace que su contenido reaccione al toque oscureciéndose.
} from 'react-native';

// FUNCIÓN PRINCIPAL El componente que representa la pantalla entera
export default function App() {
  
  // ZONA DE ESTADOS (La memoria a corto plazo la nuestra app)
   
  // 'tarea' guarda lo que el usuario está escribiendo en el momento.
  // 'setTarea' es la función que usamos para modificar ese texto.
  // Inicia como un texto completamente vacío: ''.
  const [tarea, setTarea] = useState('');
  
  // Estado para la lista completa:
  // 'listaTareas' guarda todo el historial de tareas creadas.
  // 'setListaTareas' es la función para actualizar esa lista general.
  // Inicia como un arreglo vacío: [].
  const [listaTareas, setListaTareas] = useState([]);

  // ZONA DE LÓGICA - las acciones del usuario

  // Función cuando el usuario presiona el botón "Agregar"
  const agregarTarea = () => {
    // .trim() quita los espacios en blanco al inicio y al final.
    // Si después de quitar espacios el texto está vacío, usamos 'return' para detener la función
    // y evitar que se agreguen "tareas invisibles" a la lista.
    if (tarea.trim() === '') return; 
    
    // Actualizamos la lista de tareas poniendo el nuevo dato:
    // Usamos el operador de propagación (...) para copiar todas las tareas viejas que ya existían.
    // Agregamos un nuevo objeto al final con dos propiedades fundamentales:
    //  -id: Usamos Date.now().toString() para generar un identificador único basado 
    //  en los milisegundos de la hora exacta.
    //  -texto: El contenido que el usuario escribió (que está guardado en la variable 'tarea').
    setListaTareas([...listaTareas, { id: Date.now().toString(), texto: tarea }]);
    
    // Una vez guardada la tarea en la lista, limpiamos la caja de texto
    // devolviendo el estado 'tarea' a un string vacío.
    setTarea('');
  };

  // ZONA DE RENDERIZADO lo que el usuario ve en la pantalla de su teléfono
  return (
    // 'View' es el contenedor padre que envuelve a toda la aplicación
    <View style={styles.contenedor}>
      
      {/* Título principal de la aplicación */}
      <Text style={styles.titulo}>Mis Tareas Pendientes</Text>

      {/* Contenedor agrupar la caja de texto y el botón en la misma línea */}
      <View style={styles.zonaInput}>
        
        {/* Caja de texto interactiva */}
        <TextInput 
          style={styles.input}
          placeholder="Escribe una tarea..." // Texto fantasma de ayuda cuando está vacío
          value={tarea} // Conectamos el valor visible de la caja a nuestra variable de memoria 'tarea'
          
          // Cada vez que el usuario teclea una letra, 
          // actualizamos el estado 'tarea' inmediatamente.
          onChangeText={setTarea} 
        />
        
        {/* Botón que dispara la lógica de guardado */}
        <Button 
          title="Agregar" 
          onPress={agregarTarea} // Evento de toque 
          color="#005791ae" 
        />
      </View>

      {/* Lista inteligente y optimizada para móviles */}
      <FlatList 
        // 'data' responde a la pregunta: ¿De dónde saco la información? 
        data={listaTareas} 
        
        // 'keyExtractor' responde a: ¿Cómo identifico cada elemento de forma única para no confundirme?
        keyExtractor={(item) => item.id} 
        
        // 'renderItem' responde a: ¿Cómo quieres que dibuje visualmente cada elemento de la lista?
        renderItem={({ item }) => (
          // Usamos TouchableOpacity para que los alumnos vean cómo reacciona al toque
          <TouchableOpacity style={styles.cajaTarea}>
            {/* Extraemos e imprimimos la propiedad 'texto' del objeto actual */}
            <Text style={styles.textoTarea}>{item.texto}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// ZONA DE ESTILOS (El diseño visual estructurado)
const styles = StyleSheet.create({
  contenedor: {
    flex: 1, // Toma todo el alto disponible de la pantalla del celular
    backgroundColor: '#8ce7df', // Fondo totalmente blanco
    paddingTop: 60, // Da un margen superior grande para que la app no se encime con el reloj o la cámara del celular
    paddingHorizontal: 20, // Márgenes a los lados para que nada pegue con los bordes de la pantalla
  },
  titulo: {
    fontSize: 24, // Tamaño de letra para el encabezado
    fontWeight: 'bold', // Tipografía en negrita
    marginBottom: 20, // Separación inferior para que no se pegue con la caja de texto
    textAlign: 'center', // Centrado perfecto
    color: '#333', // Un gris muy oscuro (más elegante que el negro puro)
  },
  zonaInput: {
    flexDirection: 'row', // Regla de Flexbox vital: Coloca el Input y el Botón uno al lado del otro (horizontal)
    justifyContent: 'space-between', // Separa los elementos empujándolos a los extremos
    marginBottom: 20, // Separación inferior con el inicio de la lista
  },
  input: {
    flex: 1, // Le dice a la caja de texto: "Toma todo el espacio sobrante que el botón no esté usando"
    borderWidth: 1, // Dibuja una línea de borde
    borderColor: '#cccccc3a', // Color gris claro para el borde
    borderRadius: 8, // Esquinas redondeadas suaves
    paddingHorizontal: 15, // Espacio interno para que el texto que escriben no pegue con el borde
    marginRight: 10, // Separación a la derecha para no chocar físicamente con el botón "Agregar"
    height: 45, // Altura cómoda para que el dedo del usuario pueda tocarla sin problema
  },
  cajaTarea: {
    backgroundColor: '#f9f9f9', // Fondo ligeramente gris para separar visualmente cada tarea del fondo blanco
    padding: 15, // Espacio interno para que el texto de la tarea respire
    borderRadius: 8, // Esquinas redondeadas
    marginBottom: 10, // Espacio entre una tarea y la que sigue abajo
    borderWidth: 1, // Borde perimetral
    borderColor: '#eeeeee', // Gris ultra claro para un diseño limpio
  },
  textoTarea: {
    fontSize: 16, // Tamaño de lectura estándar en móviles
    color: '#444', // Gris oscuro para buen contraste y legibilidad
  }
});