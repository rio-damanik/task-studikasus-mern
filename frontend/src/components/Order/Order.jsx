import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { FaUtensils, FaMotorcycle, FaMoneyBillWave, FaCreditCard, FaUpload, FaMapMarkerAlt } from 'react-icons/fa';
import './Order.css';

const Order = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [orderType, setOrderType] = useState('dine-in');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    nama: '',
    detail: '',
    kelurahan: '',
    kecamatan: '',
    kabupaten: '',
    provinsi: ''
  });
  const [transferProof, setTransferProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setSelectedAddress(addressForm);
    setShowAddressForm(false);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const deliveryFee = orderType === 'delivery' ? 10000 : 0;
    return subtotal + deliveryFee;
  };

  const handlePlaceOrder = async () => {
    if (!cart.length) {
      setError('Your cart is empty');
      return;
    }

    if (orderType === 'delivery' && !selectedAddress) {
      setError('Please select a delivery address');
      return;
    }

    if (paymentMethod === 'transfer' && !transferProof) {
      setError('Please upload transfer proof');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { state: { from: '/order' } });
        return;
      }

      const orderData = {
        delivery_fee: orderType === 'delivery' ? 10000 : 0,
        metode_payment: paymentMethod,
        items: cart.map(item => ({
          name: item.product.name,
          price: item.product.price,
          qty: item.quantity,
          product: item.product._id
        })),
        ...(orderType === 'delivery' && selectedAddress && { 
          delivery_address: {
            kelurahan: selectedAddress.kelurahan,
            kecamatan: selectedAddress.kecamatan,
            kabupaten: selectedAddress.kabupaten,
            provinsi: selectedAddress.provinsi,
            detail: selectedAddress.detail
          }
        })
      };

      let response;
      if (paymentMethod === 'transfer' && transferProof) {
        const formData = new FormData();
        formData.append('transferProof', transferProof);
        Object.keys(orderData).forEach(key => {
          if (key === 'items') {
            formData.append(key, JSON.stringify(orderData[key]));
          } else if (key === 'delivery_address' && orderData[key]) {
            formData.append(key, JSON.stringify(orderData[key]));
          } else {
            formData.append(key, orderData[key]);
          }
        });

        response = await axios.post('http://localhost:8000/api/orders', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axios.post('http://localhost:8000/api/orders', orderData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      if (response.data && response.data._id) {
        clearCart();
        navigate(`/invoice/${response.data._id}`);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-container">
      <div className="order-header">
        <h1>Complete Your Order</h1>
        <p>Please select your order type and payment method</p>
      </div>

      <div className="order-content">
        <div className="order-section">
          <h2>Order Type</h2>
          <div className="order-type-options">
            <div 
              className={`order-type-option ${orderType === 'dine-in' ? 'selected' : ''}`}
              onClick={() => setOrderType('dine-in')}
            >
              <FaUtensils className="option-icon" />
              <h3>Dine In</h3>
              <p>Eat at our restaurant</p>
            </div>
            <div 
              className={`order-type-option ${orderType === 'delivery' ? 'selected' : ''}`}
              onClick={() => setOrderType('delivery')}
            >
              <FaMotorcycle className="option-icon" />
              <h3>Delivery</h3>
              <p>Delivered to your address</p>
            </div>
          </div>
        </div>

        {orderType === 'delivery' && (
          <div className="order-section">
            <h2>Delivery Address</h2>
            {selectedAddress ? (
              <div className="selected-address">
                <div className="address-info">
                  <h3>{selectedAddress.nama}</h3>
                  <p>{selectedAddress.detail}</p>
                  <p>{selectedAddress.kelurahan}, {selectedAddress.kecamatan}</p>
                  <p>{selectedAddress.kabupaten}, {selectedAddress.provinsi}</p>
                </div>
                <button 
                  className="change-address-button"
                  onClick={() => setShowAddressForm(true)}
                >
                  <FaMapMarkerAlt /> Change Address
                </button>
              </div>
            ) : showAddressForm ? (
              <form onSubmit={handleAddressSubmit} className="address-form">
                <div className="form-group">
                  <label htmlFor="nama">Name</label>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    value={addressForm.nama}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="detail">Address Detail</label>
                  <textarea
                    id="detail"
                    name="detail"
                    value={addressForm.detail}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="kelurahan">Kelurahan</label>
                    <input
                      type="text"
                      id="kelurahan"
                      name="kelurahan"
                      value={addressForm.kelurahan}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="kecamatan">Kecamatan</label>
                    <input
                      type="text"
                      id="kecamatan"
                      name="kecamatan"
                      value={addressForm.kecamatan}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="kabupaten">Kabupaten</label>
                    <input
                      type="text"
                      id="kabupaten"
                      name="kabupaten"
                      value={addressForm.kabupaten}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="provinsi">Provinsi</label>
                    <input
                      type="text"
                      id="provinsi"
                      name="provinsi"
                      value={addressForm.provinsi}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-address-button">
                    Save Address
                  </button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setShowAddressForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button 
                className="add-address-button"
                onClick={() => setShowAddressForm(true)}
              >
                <FaMapMarkerAlt /> Add Delivery Address
              </button>
            )}
          </div>
        )}

        <div className="order-section">
          <h2>Payment Method</h2>
          <div className="payment-options">
            <div 
              className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('cash')}
            >
              <FaMoneyBillWave className="option-icon" />
              <h3>Cash</h3>
              <p>Pay with cash on delivery/pickup</p>
            </div>
            <div 
              className={`payment-option ${paymentMethod === 'transfer' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('transfer')}
            >
              <FaCreditCard className="option-icon" />
              <h3>Bank Transfer</h3>
              <p>Pay via bank transfer</p>
            </div>
          </div>

          {paymentMethod === 'transfer' && (
            <div className="transfer-proof-section">
              <h3>Upload Transfer Proof</h3>
              <div className="upload-area">
                <label htmlFor="transfer-proof">
                  <FaUpload className="upload-icon" />
                  <span>Click to upload proof of payment</span>
                </label>
                <input
                  id="transfer-proof"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setTransferProof(e.target.files[0])}
                />
              </div>
              {transferProof && (
                <p className="file-name">Selected: {transferProof.name}</p>
              )}
            </div>
          )}
        </div>

        <div className="order-section">
          <h2>Order Summary</h2>
          <div className="cart-items">
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="item-image">
                  <img src={item.product.image} alt={item.product.name} />
                </div>
                <div className="item-details">
                  <h3>{item.product.name}</h3>
                  <p className="item-quantity">Quantity: {item.quantity}</p>
                  <p className="item-price">Rp {item.product.price.toLocaleString()}</p>
                </div>
                <div className="item-total">
                  Rp {(item.product.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rp {calculateSubtotal().toLocaleString()}</span>
            </div>
            {orderType === 'delivery' && (
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>Rp 10,000</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Total</span>
              <span>Rp {calculateTotal().toLocaleString()}</span>
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        
        <button
          className="place-order-button"
          onClick={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default Order;
