import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTimes, FaPlus, FaMinus, FaUser } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { formatRupiah } from '../../utils/formatRupiah';
import './Cart.css';

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, customerName, setCustomerName, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const toggleCart = () => setIsOpen(!isOpen);

  const handleUpdateQuantity = (productId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty >= 1) {
      updateQuantity(productId, newQty);
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    if (!customerName.trim()) {
      alert('Please enter customer name');
      const customerNameInput = document.getElementById('customerName');
      if (customerNameInput) {
        customerNameInput.focus();
      }
      return;
    }
    navigate('/order');
  };

  const formatPrice = (price) => {
    try {
      return formatRupiah(price);
    } catch (error) {
      return `Rp ${price.toLocaleString('id-ID')}`;
    }
  };

  return (
    <>
      <button className="cart-toggle" onClick={toggleCart}>
        <FaShoppingCart />
        <span className="cart-badge">{cart.length}</span>
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
                <label htmlFor="customerName" className="customer-label">
                  <FaUser /> Customer Name
                </label>
                <input
                  type="text"
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                  className="customer-name-input"
                  required
                />
              </div>

              {cart.map((item) => (
                <div key={item.product._id} className="cart-item">
                  <div className="item-details">
                    <h3 className="item-name">{item.product.name}</h3>
                    <p className="item-price">{formatPrice(item.product.price)}</p>
                  </div>
                  <div className="quantity-controls">
                    <button
                      className="quantity-button"
                      onClick={() => handleUpdateQuantity(item.product._id, item.quantity, -1)}
                      disabled={item.quantity <= 1}
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
                  <div className="item-subtotal">
                    Subtotal: {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>Total:</span>
            <span>{formatPrice(getTotalPrice())}</span>
          </div>
          <button
            className="checkout-button"
            onClick={handleCheckout}
            disabled={cart.length === 0 || !customerName.trim()}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;