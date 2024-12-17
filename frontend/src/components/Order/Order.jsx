import React, { useState } from "react";
import "./Order.css";

// Format rupiah untuk Indonesia
const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(number);
};

const Order = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Burger", price: 10000, quantity: 2 },
    { id: 2, name: "Coffee", price: 5000, quantity: 1 },
  ]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    alert("Checkout completed!");
    setCartItems([]); // Clear cart after checkout
  };

  return (
    <div className="order-container">
      <h2>Pesanan Anda</h2>
      {cartItems.length > 0 ? (
        <>
          <div className="order-list">
            {cartItems.map((item) => (
              <div className="order-item" key={item.id}>
                <div className="order-details">
                  <h3>{item.name}</h3>
                  <p>
                    {formatRupiah(item.price)} x {item.quantity}
                  </p>
                </div>
                <p className="order-total">{formatRupiah(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="order-summary">
            <h3>Total: {formatRupiah(calculateTotal())}</h3>
            <button className="checkout-button" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </>
      ) : (
        <p className="empty-message">Keranjang Anda kosong!</p>
      )}
    </div>
  );
};

export default Order;
