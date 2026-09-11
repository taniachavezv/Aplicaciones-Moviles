import React, { createContext, useState } from 'react';

// Creamos el contexto (La "nube" de datos)
export const CartContext = createContext();

// Creamos el Proveedor
export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  // Funcion para agregar o sumar si ya existe
  const agregarAlCarrito = (producto) => {
    setCarrito((carritoActual) => {
      const existe = carritoActual.find((item) => item.id === producto.id);
      if (existe) {
        return carritoActual.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...carritoActual, { ...producto, cantidad: 1 }];
    });
  };

  // Funcion para cambiar cantidad (+ o -) y eliminar si llega a 0
  const cambiarCantidad = (id, accion) => {
    setCarrito((carritoActual) => {
      return carritoActual
        .map((item) => {
          if (item.id === id) {
            if (accion === 'sumar') return { ...item, cantidad: item.cantidad + 1 };
            if (accion === 'restar') return { ...item, cantidad: item.cantidad - 1 };
          }
          return item;
        })
        // conservamos solo los que tengan 1 o mas
        .filter((item) => item.cantidad > 0);
    });
  };

  // Funcion para eliminar por completo
  const eliminarDelCarrito = (id) => {
    setCarrito((carritoActual) => carritoActual.filter((item) => item.id !== id));
  };

  //-------------------------------------------------------------------------------------------------------------------------
  // Funcion para vaciar todo el carrito
  // crea una constante llamada vaciarCarrito que al ejecutarse, llame a setCarrito con un arreglo vacio
  const vaciarCarrito = () => {
    setCarrito([]);
  };
  

  //---------------------------------------------------------------------------------------------------------------------------

  // agrega tu nueva funcion vaciarCarrito al value del provider para que pueda ser usada en otros componentes
  return (
    <CartContext.Provider value={{ carrito, agregarAlCarrito, cambiarCantidad, eliminarDelCarrito, vaciarCarrito }}>
      {children}
    </CartContext.Provider>
  );
};