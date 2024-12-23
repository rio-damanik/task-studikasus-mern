import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import "./Order.css";

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
  }).format(number);
};

const Order = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart, customerName } = useCart();
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmitOrder = async () => {
    if (!customerName) {
      setError("Please enter your name before submitting the order");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const orderData = {
        items: cart.map(item => ({
          product: item.product._id,
          price: item.product.price,
          qty: item.quantity
        })),
        customerName: customerName,
        totalAmount: getTotalPrice()
      };

      const response = await axios.post('http://localhost:8000/api/orders', orderData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      clearCart();
      navigate(`/invoice/${response.data._id}`);
    } catch (error) {
      console.error('Error submitting order:', error);
      setError(error.response?.data?.message || 'Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="order-empty" role="alert">
        <h2>Your Cart is Empty</h2>
        <p>Add some items to your cart first!</p>
        <button 
          onClick={() => navigate('/')} 
          className="return-button"
          aria-label="Return to shop"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="order-container">
      <h1>Order Summary</h1>
      
      <div className="customer-info" role="region" aria-label="Customer Information">
        <h2>Customer Information</h2>
        <p>Name: <span id="customer-name">{customerName || "Not provided"}</span></p>
      </div>

      <div className="order-items" role="region" aria-label="Order Items">
        <h2>Order Items</h2>
        {cart.map((item) => (
          <div 
            key={item.product._id} 
            className="order-item"
            role="listitem"
          >
            <div className="item-info">
              <img 
                src={item.product.image} 
                alt={`Product: ${item.product.name}`}
                className="item-image"
                loading="lazy"
              />
              <div className="item-details">
                <span className="item-name">{item.product.name}</span>
                <span className="item-price-single">
                  {formatRupiah(item.product.price)} each
                </span>
              </div>
              <span className="item-quantity" aria-label={`Quantity: ${item.quantity}`}>
                x {item.quantity}
              </span>
            </div>
            <span className="item-price-total" aria-label={`Total: ${formatRupiah(item.product.price * item.quantity)}`}>
              {formatRupiah(item.product.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="order-summary" role="region" aria-label="Order Summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>{formatRupiah(getTotalPrice())}</span>
        </div>
        <div className="summary-row total">
          <span>Total Amount:</span>
          <span aria-label={`Total amount: ${formatRupiah(getTotalPrice())}`}>
            {formatRupiah(getTotalPrice())}
          </span>
        </div>
        <div className="total-items">Total Items: {totalItems}</div>
      </div>

      {error && (
        <div className="error-message" role="alert" aria-live="polite">
          {error}
        </div>
      )}

      <div className="order-actions">
        <button 
          onClick={() => navigate('/')} 
          className="cancel-button"
          disabled={isSubmitting}
          aria-label="Continue shopping"
        >
          Continue Shopping
        </button>
        <button 
          onClick={handleSubmitOrder} 
          className="submit-button"
          disabled={isSubmitting || !customerName}
          aria-label={isSubmitting ? "Processing order..." : "Place order"}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default Order;
