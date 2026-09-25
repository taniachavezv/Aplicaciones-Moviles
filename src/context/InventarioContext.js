// importamos las herramientas de react necesarias para crear el contexto y manejar los estados
import React, { createContext, useState, useEffect } from 'react';
// importamos la libreria que nos permite guardar informacion en el disco duro del telefono
import AsyncStorage from '@react-native-async-storage/async-storage';

// creamos el contexto. esto funciona como una nube de datos global para toda la aplicacion
export const InventarioContext = createContext();

// el proveedor es un componente que envuelve a las demas pantallas para compartirles la informacion
export const InventarioProvider = ({ children }) => {
  // estado que guarda nuestro arreglo de productos en la memoria ram (la memoria rapida pero volatil)
  const [productos, setProductos] = useState([]);
  
  // bandera de seguridad. sirve para evitar que un arreglo vacio borre nuestro disco duro al abrir la app
  const [cargado, setCargado] = useState(false); 

  // primer useeffect: se ejecuta una sola vez cuando la aplicacion recien se abre.
  // su trabajo es ir a buscar los datos que se quedaron guardados de la sesion anterior
  useEffect(() => {
    cargarDatos();
  }, []);

  // segundo useeffect: vigila constantemente al arreglo de productos.
  // cada vez que agregas, editas o borras algo, este se dispara para guardar los cambios en el telefono.
  // el "if (cargado)" asegura que solo guarde si ya terminamos de leer el disco primero.
  useEffect(() => {
    if (cargado) {
      guardarDatos();
    }
  }, [productos, cargado]);

  // =========================================================
  // persistencia de datos (interaccion con la memoria fisica)
  // =========================================================
  
  // funcion para guardar los datos en el celular
  const guardarDatos = async () => {
    try {
      // el disco fisico no entiende de arreglos u objetos, asi que convertimos los productos a texto plano
      const jsonValue = JSON.stringify(productos);
      // guardamos ese texto en el sistema bajo el nombre de llave '@db_productos'
      await AsyncStorage.setItem('@db_productos', jsonValue);
    } catch (error) {
      console.log("error guardando:", error);
    }
  };

  // funcion para leer los datos del celular
  const cargarDatos = async () => {
    try {
      // vamos al almacenamiento y extraemos el texto guardado con nuestra llave
      const jsonValue = await AsyncStorage.getItem('@db_productos');
      // si el disco no esta vacio (es decir, ya habiamos guardado cosas antes)
      if (jsonValue != null) {
        // revivimos el texto convirtiendolo de nuevo a un arreglo real y lo metemos al estado
        setProductos(JSON.parse(jsonValue));
      }
      // avisamos que ya terminamos de cargar para que la app tenga permiso de guardar nuevos cambios
      setCargado(true);
    } catch (error) {
      console.log("error cargando:", error);
    }
  };

  // =========================================================
  // operaciones logicas (modificaciones en la memoria ram)
  // =========================================================
  
  // funcion para crear un nuevo registro
  const agregarProducto = (nombre, precio, categoria, vendedor) => {
    // creamos un objeto con un id unico basado en los milisegundos de la hora exacta (date.now)
    // y aseguramos que el precio sea tratado como un numero decimal con parsefloat
    const nuevo = { id: Date.now().toString(), nombre, precio: parseFloat(precio), categoria, vendedor };
    // copiamos los productos que ya teniamos y pegamos el nuevo al final de la lista
    setProductos([...productos, nuevo]);
  };

  // funcion para editar un registro que ya existe
  const actualizarProducto = (id, nuevoNombre, nuevoPrecio, nuevaCategoria, nuevoVendedor) => {
    // usamos map para recorrer la lista uno por uno. si el id coincide con el que queremos editar,
    // tomamos sus datos viejos y los sobreescribimos con los nuevos. si no coincide, lo ignoramos.
    setProductos(productos.map(item => 
      item.id === id 
        ? { ...item, nombre: nuevoNombre, precio: parseFloat(nuevoPrecio), categoria: nuevaCategoria, vendedor: nuevoVendedor }
        : item
    ));
  };

  // funcion para borrar un registro
  const eliminarProducto = (id) => {
    // usamos filter para crear una lista nueva que deje pasar a todos los productos,
    // excepto al producto que tenga el id exacto que mandamos a eliminar
    setProductos(productos.filter(item => item.id !== id));
  };

  // finalmente, exportamos nuestras variables y funciones a traves del provider
  // para que cualquier pantalla conectada pueda usarlas libremente
  return (
    <InventarioContext.Provider value={{ productos, agregarProducto, actualizarProducto, eliminarProducto }}>
      {children}
    </InventarioContext.Provider>
  );
};