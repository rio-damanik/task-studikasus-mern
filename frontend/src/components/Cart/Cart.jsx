import React, { useState } from 'react';
import { FaShoppingCart, FaTimes, FaPlus, FaMinus, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Cart.css';

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(number);
};

const Cart = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const {
    cart,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    customerName,
    setCustomerName
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

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    if (!customerName.trim()) {
      alert('Please enter customer name');
      return;
    }
    navigate('/order');
    setIsOpen(false);
  };

  return (
    <>
      <button className="cart-toggle" onClick={toggleCart}>
        <FaShoppingCart />
      </button>

      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button className="close-button" onClick={toggleCart}>
            <FaTimes />
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-cart-message">Your cart is empty</p>
          ) : (
            <>
              <div className="customer-info">
                <div className="input-group">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    placeholder="Enter customer name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="customer-name-input"
                  />
                </div>
              </div>
              {cart.map((item) => (
                <div key={item.product._id} className="cart-item">
                  <div className="item-details">
                    <h3 className="item-name">{item.product.name}</h3>
                    <p className="item-price">{formatRupiah(item.product.price)}</p>
                  </div>
                  <div className="quantity-controls">
                    <button
                      className="quantity-button"
                      onClick={() => handleUpdateQuantity(item.product._id, item.quantity, -1)}
                    >
                      <FaMinus />
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="quantity-button"
                      onClick={() => handleUpdateQuantity(item.product._id, item.quantity, 1)}
                    >
                      <FaPlus />
                    </button>
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveItem(item.product._id)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>Total:</span>
            <span>{formatRupiah(getTotalPrice())}</span>
          </div>
          <button
            className="checkout-button"
            onClick={handleCheckout}
            disabled={cart.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;