import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { FaUtensils, FaMotorcycle, FaMoneyBillWave, FaCreditCard, FaUpload, FaMapMarkerAlt, FaUser, FaTimes } from 'react-icons/fa';
import { config } from '../../config/config';
import { formatRupiah } from '../../utils/formatRupiah';
import './Order.css';

const Order = () => {
  const navigate = useNavigate();
  const { cart, clearCart, customerName } = useCart();
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
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate('/cart');
      return;
    }
    if (!customerName.trim()) {
      navigate('/cart');
      return;
    }
  }, [cart, customerName, navigate]);

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

  const handleTransferProofChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setTransferProof(file);
      setError('');
    } else {
      setError('Please upload a valid image file');
      e.target.value = '';
    }
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getDeliveryFee = () => {
    return orderType === 'delivery' ? 10000 : 0;
  };

  const calculateTotal = () => {
    const subtotal = getSubtotal();
    const deliveryFee = getDeliveryFee();
    return subtotal + deliveryFee;
  };

  const formatPrice = (price) => {
    try {
      return formatRupiah(price);
    } catch (error) {
      return `Rp ${price.toLocaleString('id-ID')}`;
    }
  };

  const handlePlaceOrder = async () => {
    setShowConfirmation(true);
  };

  const handleConfirmOrder = async () => {
    try {
      setLoading(true);
      setError('');

      const orderData = {
        delivery_fee: orderType === 'delivery' ? 10000 : 0,
        metode_payment: paymentMethod,
        delivery_address: orderType === 'delivery' ? selectedAddress._id : null,
        customer_name: customerName
      };

      console.log('Submitting order:', orderData); // Debug log

      let response;
      
      if (paymentMethod === 'transfer' && transferProof) {
        const formData = new FormData();
        formData.append('transferProof', transferProof);
        formData.append('orderData', JSON.stringify(orderData));
        
        console.log('Submitting with transfer proof'); // Debug log
        
        response = await axios.post(config.endpoints.orders, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        console.log('Submitting regular order'); // Debug log
        
        response = await axios.post(config.endpoints.orders, orderData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }

      console.log('Server response:', response.data); // Debug log

      if (response.data && !response.data.error) {
        clearCart();
        setShowConfirmation(false);
        navigate(`/invoice/${response.data._id}`);
      } else {
        throw new Error(response.data.message || 'Failed to create order');
      }
    } catch (err) {
      console.error('Order submission error:', err.response || err);
      setError(err.response?.data?.message || err.message || 'Failed to place order. Please try again.');
      setShowConfirmation(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order? Your cart will be cleared.')) {
      clearCart();
      navigate('/');
    }
  };

  return (
    <div className="order-container">
      <div className="order-header">
        <h1>Checkout</h1>
        <button className="cancel-order-button" onClick={handleCancelOrder}>
          <FaTimes /> Cancel Order
        </button>
      </div>

      <div className="order-content">
        <div className="customer-section">
          <h2><FaUser /> Customer Information</h2>
          <div className="customer-info">
            <p className="customer-name">Customer Name: {customerName}</p>
          </div>
        </div>

        <div className="order-section">
          <h2>Order Type</h2>
          <div className="order-type-options">
            <button
              className={`order-type-button ${orderType === 'dine-in' ? 'active' : ''}`}
              onClick={() => setOrderType('dine-in')}
            >
              <FaUtensils /> Dine In
            </button>
            <button
              className={`order-type-button ${orderType === 'delivery' ? 'active' : ''}`}
              onClick={() => setOrderType('delivery')}
            >
              <FaMotorcycle /> Delivery
            </button>
          </div>
        </div>

        {orderType === 'delivery' && (
          <div className="order-section delivery-section">
            <h2><FaMapMarkerAlt /> Delivery Address</h2>
            {selectedAddress ? (
              <div className="selected-address">
                <div className="address-card">
                  <div className="address-header">
                    <FaMapMarkerAlt className="address-icon" />
                    <h3>Delivery Location</h3>
                  </div>
                  <div className="address-details">
                    <p><strong>Detail:</strong> {selectedAddress.detail}</p>
                    <div className="address-grid">
                      <div className="address-item">
                        <span className="label">Kelurahan</span>
                        <span className="value">{selectedAddress.kelurahan}</span>
                      </div>
                      <div className="address-item">
                        <span className="label">Kecamatan</span>
                        <span className="value">{selectedAddress.kecamatan}</span>
                      </div>
                      <div className="address-item">
                        <span className="label">Kabupaten</span>
                        <span className="value">{selectedAddress.kabupaten}</span>
                      </div>
                      <div className="address-item">
                        <span className="label">Provinsi</span>
                        <span className="value">{selectedAddress.provinsi}</span>
                      </div>
                    </div>
                  </div>
                  <button className="change-address-button" onClick={() => setShowAddressForm(true)}>
                    <FaMapMarkerAlt /> Change Address
                  </button>
                </div>
              </div>
            ) : (
              <button className="add-address-button" onClick={() => setShowAddressForm(true)}>
                <FaMapMarkerAlt /> Add Delivery Address
              </button>
            )}

            {showAddressForm && (
              <div className="address-form-container">
                <form onSubmit={handleAddressSubmit} className="address-form">
                  <div className="form-header">
                    <h3><FaMapMarkerAlt /> Enter Delivery Address</h3>
                  </div>
                  <div className="form-fields">
                    <div className="form-group">
                      <label>
                        <span className="label-text">Address Detail</span>
                        <input
                          type="text"
                          name="detail"
                          value={addressForm.detail}
                          onChange={handleAddressChange}
                          placeholder="Enter complete address details"
                          required
                        />
                      </label>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>
                          <span className="label-text">Kelurahan</span>
                          <input
                            type="text"
                            name="kelurahan"
                            value={addressForm.kelurahan}
                            onChange={handleAddressChange}
                            placeholder="Enter kelurahan"
                            required
                          />
                        </label>
                      </div>
                      <div className="form-group">
                        <label>
                          <span className="label-text">Kecamatan</span>
                          <input
                            type="text"
                            name="kecamatan"
                            value={addressForm.kecamatan}
                            onChange={handleAddressChange}
                            placeholder="Enter kecamatan"
                            required
                          />
                        </label>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>
                          <span className="label-text">Kabupaten</span>
                          <input
                            type="text"
                            name="kabupaten"
                            value={addressForm.kabupaten}
                            onChange={handleAddressChange}
                            placeholder="Enter kabupaten"
                            required
                          />
                        </label>
                      </div>
                      <div className="form-group">
                        <label>
                          <span className="label-text">Provinsi</span>
                          <input
                            type="text"
                            name="provinsi"
                            value={addressForm.provinsi}
                            onChange={handleAddressChange}
                            placeholder="Enter provinsi"
                            required
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="save-button">
                      <FaMapMarkerAlt /> Save Address
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
              </div>
            )}
          </div>
        )}

        <div className="order-section">
          <h2>Payment Method</h2>
          <div className="payment-options">
            <button
              className={`payment-button ${paymentMethod === 'cash' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('cash')}
            >
              <FaMoneyBillWave /> Cash
            </button>
            <button
              className={`payment-button ${paymentMethod === 'transfer' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('transfer')}
            >
              <FaCreditCard /> Transfer
            </button>
          </div>

          {paymentMethod === 'transfer' && (
            <div className="transfer-proof-section">
              <h3>Upload Transfer Proof</h3>
              <div className="file-upload">
                <label className="file-upload-label">
                  <FaUpload />
                  <span>Choose File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleTransferProofChange}
                    required
                  />
                </label>
                {transferProof && <p>File selected: {transferProof.name}</p>}
              </div>
            </div>
          )}
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-items">
            {cart.map((item) => (
              <div key={item.product._id} className="order-item">
                <div className="item-info">
                  <span className="item-name">{item.product.name}</span>
                  <span className="item-quantity">x{item.quantity}</span>
                </div>
                <span className="item-price">{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="subtotal">
              <span>Subtotal ({getTotalQuantity()} items)</span>
              <span>{formatPrice(getSubtotal())}</span>
            </div>
            {orderType === 'delivery' && (
              <div className="delivery-fee">
                <span>Delivery Fee</span>
                <span>{formatPrice(getDeliveryFee())}</span>
              </div>
            )}
            <div className="total">
              <span>Total</span>
              <span>{formatPrice(calculateTotal())}</span>
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

      {/* Order Confirmation Modal */}
      {showConfirmation && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <h2>Confirm Your Order</h2>
            <div className="confirmation-content">
              <p>Please review your order details:</p>
              <div className="confirmation-details">
                <p><strong>Customer Name:</strong> {customerName}</p>
                <p><strong>Order Type:</strong> {orderType}</p>
                <p><strong>Payment Method:</strong> {paymentMethod}</p>
                <p><strong>Total Amount:</strong> {formatPrice(calculateTotal())}</p>
              </div>
              <div className="confirmation-actions">
                <button 
                  className="confirm-button"
                  onClick={handleConfirmOrder}
                  disabled={loading}
                >
                  Confirm Order
                </button>
                <button 
                  className="cancel-button"
                  onClick={handleCancelConfirmation}
                  disabled={loading}
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
