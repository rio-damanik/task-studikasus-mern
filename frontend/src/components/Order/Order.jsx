import React, { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState({
    detail: "",
    kelurahan: "",
    kecamatan: "",
    kabupaten: "",
    provinsi: ""
  });
  const [metodePayment, setMetodePayment] = useState("tunai");

  useEffect(() => {
    // Check if cart is empty when component mounts
    if (cart.length === 0) {
      navigate('/');
    }
  }, [cart, navigate]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentChange = (e) => {
    setMetodePayment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // First create delivery address
      const addressResponse = await axios.post(
        "http://localhost:8000/api/delivery-address",
        deliveryAddress,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Then create order with cart items
      const orderData = {
        delivery_fee: 10000,
        delivery_address: addressResponse.data._id,
        metode_payment: metodePayment,
        customerName: customerName,
        cart_items: cart.map(item => ({
          product: item.product._id,
          name: item.product.name,
          price: item.product.price,
          qty: item.quantity
        }))
      };

      const orderResponse = await axios.post(
        "http://localhost:8000/api/order",
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Clear cart and redirect to invoice
      clearCart();
      navigate(`/invoice/${orderResponse.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create order");
      console.error("Error creating order:", err);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="order-container">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <button onClick={() => navigate("/")} className="back-button">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-container">
      <h2>Complete Your Order</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="customer-info">
        <h3>Customer Information</h3>
        <p>Name: {customerName}</p>
      </div>

      <div className="order-summary">
        <h3>Order Summary</h3>
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.product._id} className="cart-item">
              <div className="item-info">
                <h4>{item.product.name}</h4>
                <p>{item.quantity}x {formatRupiah(item.product.price)}</p>
              </div>
              <div className="item-total">
                {formatRupiah(item.product.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
        <div className="order-totals">
          <div className="subtotal">
            <span>Subtotal:</span>
            <span>{formatRupiah(getTotalPrice())}</span>
          </div>
          <div className="delivery-fee">
            <span>Delivery Fee:</span>
            <span>{formatRupiah(10000)}</span>
          </div>
          <div className="total">
            <span>Total:</span>
            <span>{formatRupiah(getTotalPrice() + 10000)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-section">
          <h3>Delivery Address</h3>
          <input
            type="text"
            name="detail"
            placeholder="Street address"
            value={deliveryAddress.detail}
            onChange={handleAddressChange}
            required
          />
          <input
            type="text"
            name="kelurahan"
            placeholder="Kelurahan"
            value={deliveryAddress.kelurahan}
            onChange={handleAddressChange}
            required
          />
          <input
            type="text"
            name="kecamatan"
            placeholder="Kecamatan"
            value={deliveryAddress.kecamatan}
            onChange={handleAddressChange}
            required
          />
          <input
            type="text"
            name="kabupaten"
            placeholder="Kabupaten"
            value={deliveryAddress.kabupaten}
            onChange={handleAddressChange}
            required
          />
          <input
            type="text"
            name="provinsi"
            placeholder="Provinsi"
            value={deliveryAddress.provinsi}
            onChange={handleAddressChange}
            required
          />
        </div>

        <div className="form-section">
          <h3>Payment Method</h3>
          <div className="payment-options">
            <label>
              <input
                type="radio"
                name="payment"
                value="tunai"
                checked={metodePayment === "tunai"}
                onChange={handlePaymentChange}
              />
              Cash
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="transfer"
                checked={metodePayment === "transfer"}
                onChange={handlePaymentChange}
              />
              Transfer
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-button" 
          disabled={loading}
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default Order;
