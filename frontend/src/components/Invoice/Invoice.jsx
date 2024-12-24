import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUtensils, FaMotorcycle, FaPrint, FaHome } from 'react-icons/fa';
import './Invoice.css';

const Invoice = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login', { state: { from: `/invoice/${orderId}` } });
          return;
        }

        const response = await axios.get(`http://localhost:8000/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setInvoice(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching invoice:', err);
        setError(err.response?.data?.message || 'Failed to load invoice');
        setLoading(false);

        if (err.response?.status === 401) {
          navigate('/login', { state: { from: `/invoice/${orderId}` } });
        }
      }
    };

    fetchInvoice();
  }, [orderId, navigate]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading invoice...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!invoice) {
    return <div className="error-message">Invoice not found</div>;
  }

  return (
    <div className={`invoice-container ${invoice.orderType}`}>
      <div className="invoice-header">
        <div className="order-type-icon">
          {invoice.orderType === 'delivery' ? <FaMotorcycle size={40} /> : <FaUtensils size={40} />}
        </div>
        <h1>Order Invoice</h1>
        <p className="invoice-number">#{orderId}</p>
        <p className="invoice-date">{formatDate(invoice.createdAt)}</p>
      </div>

      <div className="invoice-details">
        <div className="order-info">
          <h3>Order Type</h3>
          <p className="order-type">
            {invoice.orderType === 'delivery' ? 'Delivery Order' : 'Dine-in Order'}
          </p>
        </div>

        <div className="payment-info">
          <h3>Payment Method</h3>
          <p>{invoice.paymentMethod === 'transfer' ? 'Bank Transfer' : 'Cash Payment'}</p>
        </div>

        {invoice.orderType === 'delivery' && invoice.deliveryAddress && (
          <div className="delivery-info">
            <h3>Delivery Address</h3>
            <div className="address-details">
              <p className="customer-name">{invoice.deliveryAddress.nama}</p>
              <p>{invoice.deliveryAddress.detail}</p>
              <p>
                {invoice.deliveryAddress.kelurahan}, {invoice.deliveryAddress.kecamatan}
              </p>
              <p>
                {invoice.deliveryAddress.kabupaten}, {invoice.deliveryAddress.provinsi}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="order-items">
        <h3>Order Items</h3>
        <div className="items-list">
          {invoice.items.map((item, index) => (
            <div key={index} className="order-item">
              <div className="item-info">
                <h4>{item.product.name}</h4>
                <p className="item-quantity">Quantity: {item.quantity}</p>
                <p className="item-price">Price: Rp {item.price.toLocaleString()}</p>
              </div>
              <div className="item-total">
                Rp {(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="invoice-summary">
        <div className="summary-row subtotal">
          <span>Subtotal</span>
          <span>Rp {invoice.total.toLocaleString()}</span>
        </div>
        {invoice.orderType === 'delivery' && (
          <div className="summary-row delivery-fee">
            <span>Delivery Fee</span>
            <span>Rp {(invoice.deliveryFee || 0).toLocaleString()}</span>
          </div>
        )}
        <div className="summary-row total">
          <span>Total Amount</span>
          <span>Rp {((invoice.total || 0) + (invoice.deliveryFee || 0)).toLocaleString()}</span>
        </div>
      </div>

      <div className="invoice-footer">
        <p className="thank-you">Thank you for your order!</p>
        <div className="invoice-actions">
          <button onClick={() => window.print()} className="print-button">
            <FaPrint /> Print Invoice
          </button>
          <button onClick={() => navigate('/')} className="back-button">
            <FaHome /> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;