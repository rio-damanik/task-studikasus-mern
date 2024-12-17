import React, { useState } from 'react';
import { FaShoppingCart, FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import './Cart.css';

// Helper function to format numbers as Rupiah currency
const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(number);
};

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    cart,
    customerName,
    setCustomerName,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice
  } = useCart();

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const handleUpdateQuantity = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!customerName?.trim()) {
      alert('Please enter your name before checking out');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    const orderSummary = `
      Order Summary for ${customerName}:
      ${cart.map(item => `
        - ${item.product.name} x${item.quantity} = ${formatRupiah(item.product.price * item.quantity)}`).join('')}
      
      Total: ${formatRupiah(getTotalPrice())}
    `;
    
    alert(orderSummary);
    clearCart();
    setIsOpen(false);
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      {/* FAB Cart Button */}
      <button className="cart-toggle" onClick={toggleCart}>
        <FaShoppingCart />
        {totalItems > 0 && (
          <span className="cart-count">{totalItems}</span>
        )}
      </button>

      {/* Cart Drawer */}
      <div className={`cart-section ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button className="close-button" onClick={toggleCart}>
            <FaTimes />
          </button>
        </div>

        <input
          type="text"
          className="customer-name-input"
          placeholder="Enter your name"
          value={customerName || ''}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        {cart.length === 0 ? (
          <p className="empty-cart-message">Your cart is empty</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.product._id} className="cart-item">
                  <div className="item-info">
                    <h3>{item.product.name}</h3>
                    <p>{formatRupiah(item.product.price)}</p>
                  </div>
                  
                  <div className="item-controls">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity, -1)}
                        className="quantity-button"
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity, 1)}
                        className="quantity-button"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    
                    <button
                      className="remove-button"
                      onClick={() => removeFromCart(item.product._id)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                  
                  <div className="item-total">
                    {formatRupiah(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <div className="total">
                <span>Total:</span>
                <span>{formatRupiah(getTotalPrice())}</span>
              </div>
              <button 
                className="checkout-button"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;