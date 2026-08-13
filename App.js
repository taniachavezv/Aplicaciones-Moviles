import { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  Button, 
  FlatList, 
  Image, 
  Alert, 
  ActivityIndicator 
} from 'react-native';

export default function App() {
  // PASO 2: Arrancar la aplicación y crear las memorias (Estados)
  const [pantallaActual, setPantallaActual] = useState('registro');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true);

  // PASO 3: Consumir la API y adaptar los datos (Carga Inicial)
  useEffect(() => {
    descargarEmpleados();
  }, []);

  const descargarEmpleados = async () => {
    try {
      const respuesta = await fetch('https://randomuser.me/api/?results=5');
      const json = await respuesta.json();

      // Adaptación de datos de la API a nuestro formato usando backticks (`)
      const empleadosAdaptados = json.results.map((user) => ({
        id: user.login.uuid,
        nombre: `${user.name.first} ${user.name.last}`,
        correo: user.email,
        telefono: user.phone,
        imagen: user.picture.large,
      }));

      setEmpleados(empleadosAdaptados);
      setCargando(false);
    } catch (error) {
      console.error("Hubo un problema descargando los datos: ", error);
      setCargando(false);
    }
  };

  // PASO 4: Lógica para el botón "Agregar Empleado"
  const agregarEmpleadoManual = () => {
    // Eliminamos espacios en blanco accidentales al inicio/final
    const nombreLimpio = nombre.trim();
    const correoLimpio = correo.trim();
    const telefonoLimpio = telefono.trim();

    // 1. Validar que no haya campos vacíos
    if (!nombreLimpio || !correoLimpio || !telefonoLimpio) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    // 2. Validar correo electrónico (@ y .)
    if (!correoLimpio.includes('@') || !correoLimpio.includes('.')) {
      Alert.alert('Error', 'Ingresa un correo electrónico válido.');
      return;
    }

    // 3. Validar teléfono (exactamente 10 dígitos numéricos)
    const esNumeroValido = /^\d+$/.test(telefonoLimpio);
    if (telefonoLimpio.length !== 10 || !esNumeroValido) {
      Alert.alert(
        'Error', 
        'El número de teléfono debe contener exactamente 10 dígitos.'
      );
      return;
    }

    // 4. Crear el nuevo objeto con avatar dinámico
    const nuevoEmpleado = {
      id: Date.now().toString(),
      nombre: nombreLimpio,
      correo: correoLimpio,
      telefono: telefonoLimpio,
      imagen: `https://i.pravatar.cc/150?u=${Date.now()}`
    };

    // 5. Inyectar al inicio de la lista maestra
    setEmpleados([nuevoEmpleado, ...empleados]);

    // 6. Alerta de éxito y cambio de pantalla
    Alert.alert(
      '¡Registro Exitoso!',
      `Hola ${nombreLimpio}, tu cuenta ha sido creada.`,
      [
        {
          text: 'Continuar',
          onPress: () => setPantallaActual('lista')
        }
      ]
    );

    // 7. Limpiar campos del formulario
    setNombre('');
    setCorreo('');
    setTelefono('');
  };

  // PASO 5: Las tres caras de la aplicación (Renderizado Condicional)

  // Pantalla 1: Carga
  if (cargando) {
    return (
      <View style={styles.pantallaCentrada}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.textoCarga}>Cargando empleados...</Text>
      </View>
    );
  }

  // Pantalla 2: Lista
  if (pantallaActual === 'lista') {
    return (
      <View style={styles.contenedor}>
        <Text style={styles.tituloPrincipal}>Lista de Empleados</Text>
        
        <View style={styles.espaciadoBoton}>
          <Button 
            title="Registrar Nuevo Empleado" 
            onPress={() => setPantallaActual('registro')} 
          />
        </View>

        <FlatList
          data={empleados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.tarjetaUsuario}>
              <Image source={{ uri: item.imagen }} style={styles.imagenPerfil} />
              <View style={styles.infoUsuario}>
                <Text style={styles.nombreUsuario}>{item.nombre}</Text>
                <Text style={styles.textoDetalle}>✉️ {item.correo}</Text>
                <Text style={styles.textoDetalle}>📞 {item.telefono}</Text>
              </View>
            </View>
          )}
        />
      </View>
    );
  }

  // Pantalla 3: Registro (Renderizado por defecto)
  return (
    <View style={styles.contenedor}>
      <Text style={styles.tituloPrincipal}>Nuevo Ingreso</Text>

      <Text style={styles.etiqueta}>Nombre completo:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Juan Pérez"
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.etiqueta}>Correo electrónico:</Text>
      <TextInput
        style={styles.input}
        placeholder="ejemplo@correo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={correo}
        onChangeText={setCorreo}
      />

      <Text style={styles.etiqueta}>Teléfono (10 dígitos):</Text>
      <TextInput
        style={styles.input}
        placeholder="1234567890"
        keyboardType="numeric"
        maxLength={10}
        value={telefono}
        onChangeText={setTelefono}
      />

      <View style={styles.espaciadoBoton}>
        <Button 
          title="Agregar Empleado" 
          color="#28a745" 
          onPress={agregarEmpleadoManual} 
        />
      </View>

      <View style={styles.espaciadoBoton}>
        <Button 
          title="Ver Lista de Empleados" 
          color="#007bff" 
          onPress={() => setPantallaActual('lista')} 
        />
      </View>
    </View>
  );
}

// PASO 6: Estilos
const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f4f7f6',
    paddingTop: 60,
    paddingHorizontal: 20
  },
  pantallaCentrada: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  textoCarga: {
    marginTop: 15,
    fontSize: 16,
    color: '#555'
  },
  tituloPrincipal: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center'
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 5
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 45,
    marginBottom: 15
  },
  espaciadoBoton: {
    marginBottom: 15
  },
  tarjetaUsuario: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  imagenPerfil: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15
  },
  infoUsuario: {
    flex: 1,
    justifyContent: 'center'
  },
  nombreUsuario: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222'
  },
  textoDetalle: {
    fontSize: 14,
    color: '#555',
    marginTop: 3
  }
});