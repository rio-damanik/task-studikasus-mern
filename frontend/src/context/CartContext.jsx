import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');

  const addToCart = (product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.product._id === product._id);
      if (existingItem) {
        return currentCart.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart(currentCart =>
      currentCart.map(item =>
        item.product._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(currentCart => currentCart.filter(item => item.product._id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerName('');
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        customerName,
        setCustomerName,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
