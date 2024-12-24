import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUtensils, FaMotorcycle, FaPrint, FaHome } from 'react-icons/fa';
import { config } from '../../config/config';
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
        const response = await axios.get(`${config.endpoints.orders}/${orderId}`);
        console.log('Invoice data:', response.data); // Debug log
        if (response.data && !response.data.error) {
          setInvoice(response.data);
        } else {
          throw new Error(response.data?.message || 'Invoice not found');
        }
      } catch (err) {
        console.error('Error fetching invoice:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load invoice');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchInvoice();
    }
  }, [orderId]);

  const formatPrice = (price) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('id-ID', {
      weekday: 'long',
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

  // Calculate subtotal from orderItems
  const subtotal = invoice.orderItems?.reduce((sum, item) => {
    return sum + (item.price * item.qty);
  }, 0) || 0;

  return (
    <div className="invoice-container">
      <div className="invoice-header">
        <div className="order-type-icon">
          {invoice.delivery_address ? <FaMotorcycle size={40} /> : <FaUtensils size={40} />}
        </div>
        <h1>Order Invoice</h1>
        <p className="invoice-number">#{orderId}</p>
        <p className="invoice-date">{formatDate(invoice.createdAt)}</p>
      </div>

      <div className="invoice-details">
        <div className="customer-info">
          <h3>Customer</h3>
          <p>{invoice.customer_name}</p>
        </div>

        <div className="order-info">
          <h3>Order Type</h3>
          <p className="order-type">
            {invoice.delivery_address ? 'Delivery Order' : 'Pickup Order'}
          </p>
        </div>

        <div className="payment-info">
          <h3>Payment Method</h3>
          <p>{invoice.metode_payment === 'transfer' ? 'Bank Transfer' : 'Cash Payment'}</p>
        </div>

        {invoice.delivery_address && (
          <div className="delivery-info">
            <h3>Delivery Address</h3>
            <div className="address-details">
              <p>{invoice.delivery_address.detail}</p>
              <p>{invoice.delivery_address.kelurahan}, {invoice.delivery_address.kecamatan}</p>
              <p>{invoice.delivery_address.kabupaten}, {invoice.delivery_address.provinsi}</p>
            </div>
          </div>
        )}
      </div>

      <div className="order-items">
        <h3>Order Items</h3>
        <div className="items-list">
          {invoice.orderItems?.map((item, index) => (
            <div key={index} className="order-item">
              <div className="item-info">
                <h4>{item.name}</h4>
                <p className="item-quantity">Quantity: {item.qty}</p>
                <p className="item-price">Price: {formatPrice(item.price)}</p>
              </div>
              <div className="item-total">
                {formatPrice(item.price * item.qty)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="invoice-summary">
        <div className="summary-row subtotal">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {invoice.delivery_fee > 0 && (
          <div className="summary-row delivery-fee">
            <span>Delivery Fee</span>
            <span>{formatPrice(invoice.delivery_fee)}</span>
          </div>
        )}
        <div className="summary-row total">
          <span>Total Amount</span>
          <span>{formatPrice(subtotal + (invoice.delivery_fee || 0))}</span>
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