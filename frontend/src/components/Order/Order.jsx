import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import DeliveryAddress from '../DeliveryAddress/DeliveryAddress';
import axios from 'axios';
import { FaMapMarkerAlt } from 'react-icons/fa';
import './Order.css';

const Order = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [orderType, setOrderType] = useState('dine-in');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [bankTransferProof, setBankTransferProof] = useState(null);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setShowAddressModal(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBankTransferProof(file);
    }
  };

  const handleSubmitOrder = async () => {
    if (orderType === 'delivery' && !selectedAddress) {
      setError('Please select a delivery address');
      return;
    }

    if (paymentMethod === 'transfer' && !bankTransferProof) {
      setError('Please upload transfer proof');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('items', JSON.stringify(cart.map(item => ({
        product: item.product._id,
        price: item.product.price,
        quantity: item.quantity
      }))));
      formData.append('total', calculateTotal());
      formData.append('orderType', orderType);
      formData.append('paymentMethod', paymentMethod);
      
      if (orderType === 'delivery') {
        formData.append('deliveryAddress', JSON.stringify(selectedAddress));
      }

      if (paymentMethod === 'transfer') {
        formData.append('transferProof', bankTransferProof);
      }

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/api/orders', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      clearCart();
      navigate(`/invoice/${response.data.order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-page">
      <div className="order-container">
        <h1>Order Summary</h1>

        <div className="order-section">
          <h2>Order Type</h2>
          <div className="order-type-options">
            <label>
              <input
                type="radio"
                value="dine-in"
                checked={orderType === 'dine-in'}
                onChange={(e) => setOrderType(e.target.value)}
              />
              Dine In
            </label>
            <label>
              <input
                type="radio"
                value="delivery"
                checked={orderType === 'delivery'}
                onChange={(e) => setOrderType(e.target.value)}
              />
              Delivery
            </label>
          </div>

          {orderType === 'delivery' && (
            <div className="delivery-address-section">
              <h2>Delivery Address</h2>
              {selectedAddress ? (
                <div className="selected-address">
                  <div className="address-info">
                    <h3>{selectedAddress.nama}</h3>
                    <p>{selectedAddress.detail}</p>
                    <p>{selectedAddress.kelurahan}, {selectedAddress.kecamatan}</p>
                    <p>{selectedAddress.kabupaten}, {selectedAddress.provinsi}</p>
                  </div>
                  <button onClick={() => setShowAddressModal(true)} className="change-address-button">
                    Change Address
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowAddressModal(true)} className="select-address-button">
                  <FaMapMarkerAlt /> Select Delivery Address
                </button>
              )}
            </div>
          )}
        </div>

        <div className="order-section">
          <h2>Order Items</h2>
          <div className="order-items">
            {cart.map((item) => (
              <div key={item.product._id} className="order-item">
                <div className="item-info">
                  <h3>{item.product.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <div className="item-price">
                  Rp {(item.product.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-section">
          <h2>Payment Method</h2>
          <div className="payment-options">
            <label>
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash
            </label>
            <label>
              <input
                type="radio"
                value="transfer"
                checked={paymentMethod === 'transfer'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Bank Transfer
            </label>
          </div>

          {paymentMethod === 'transfer' && (
            <div className="transfer-proof-section">
              <label htmlFor="transferProof">Upload Transfer Proof:</label>
              <input
                type="file"
                id="transferProof"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>

        <div className="order-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>Rp {calculateTotal().toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>Rp 10,000</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>Rp {(calculateTotal() + 10000).toLocaleString()}</span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          onClick={handleSubmitOrder}
          disabled={loading}
          className="place-order-button"
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>

        {showAddressModal && (
          <DeliveryAddress
            isModal={true}
            onClose={() => setShowAddressModal(false)}
            onSelect={handleAddressSelect}
            selectedId={selectedAddress?._id}
          />
        )}
      </div>
    </div>
  );
};

export default Order;
