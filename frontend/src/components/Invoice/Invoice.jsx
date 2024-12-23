import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
  FaSpinner,
  FaHome,
  FaPrint,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCheckCircle,
  FaTimesCircle,
  FaUtensils,
  FaMotorcycle
} from 'react-icons/fa';
import './Invoice.css';

const Invoice = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const orderType = searchParams.get('type');
  const navigate = useNavigate();
  const { token } = useAuth();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        if (!token) {
          navigate('/login', { state: { from: `/invoice/${orderId}` } });
          return;
        }

        const response = await axios.get(`http://localhost:8000/api/invoices/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data && !response.data.error) {
          setInvoice(response.data);
        } else {
          throw new Error(response.data?.message || 'Failed to load invoice');
        }
      } catch (error) {
        console.error('Failed to fetch invoice:', error);
        setError(error.response?.data?.message || 'Failed to load invoice');
        
        if (error.response?.status === 401) {
          navigate('/login', { state: { from: `/invoice/${orderId}` } });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [orderId, token, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>Loading invoice...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <FaTimesCircle className="error-icon" />
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="back-home-button">
          <FaHome /> Back to Home
        </button>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="error-container">
        <FaTimesCircle className="error-icon" />
        <p>Invoice not found</p>
        <button onClick={() => navigate('/')} className="back-home-button">
          <FaHome /> Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="invoice-container">
      <div className="invoice-header">
        <div className="header-content">
          <h1>Invoice</h1>
          <p className="invoice-number">#{invoice.order?.order_number || orderId}</p>
          <p className="invoice-date">Date: {formatDate(invoice.createdAt)}</p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/')} className="back-home-button">
            <FaHome /> Back to Home
          </button>
          <button onClick={handlePrint} className="print-button">
            <FaPrint /> Print Invoice
          </button>
        </div>
      </div>

      <div className="invoice-status">
        <div className={`status-badge ${invoice.payment_status}`}>
          {invoice.payment_status === 'paid' ? (
            <><FaCheckCircle /> Paid</>
          ) : (
            <><FaTimesCircle /> {invoice.payment_status}</>
          )}
        </div>
        <div className="order-type">
          {orderType === 'delivery' ? (
            <><FaMotorcycle /> Delivery Order</>
          ) : (
            <><FaUtensils /> Dine-in Order</>
          )}
        </div>
      </div>

      <div className="invoice-details">
        <div className="payment-info">
          <h3><FaCreditCard /> Payment Method</h3>
          <p>{invoice.metode_payment === 'transfer' ? 'Bank Transfer' : 'Cash Payment'}</p>
        </div>

        {orderType === 'delivery' && invoice.delivery_address && (
          <div className="delivery-info">
            <h3><FaMapMarkerAlt /> Delivery Address</h3>
            <p>
              {invoice.delivery_address.detail}<br />
              Kel. {invoice.delivery_address.kelurahan},<br />
              Kec. {invoice.delivery_address.kecamatan},<br />
              {invoice.delivery_address.kabupaten},<br />
              {invoice.delivery_address.provinsi}
            </p>
          </div>
        )}
      </div>

      <div className="invoice-items">
        <h3>Order Items</h3>
        <div className="items-table">
          <div className="table-header">
            <span>Item</span>
            <span>Quantity</span>
            <span>Price</span>
            <span>Total</span>
          </div>
          {invoice.order?.orderItems?.map((item, index) => (
            <div key={index} className="table-row">
              <span>{item.name}</span>
              <span>{item.qty}</span>
              <span>{formatPrice(item.price)}</span>
              <span>{formatPrice(item.price * item.qty)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="invoice-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>{formatPrice(invoice.sub_total)}</span>
        </div>
        {orderType === 'delivery' && invoice.delivery_fee > 0 && (
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>{formatPrice(invoice.delivery_fee)}</span>
          </div>
        )}
        <div className="summary-row total">
          <span>Total Amount</span>
          <span>{formatPrice(invoice.total)}</span>
        </div>
      </div>

      <div className="invoice-footer">
        <p>Thank you for your order!</p>
        <p className="footer-note">
          For any questions about this invoice, please contact our customer service
        </p>
      </div>
    </div>
  );
};

export default Invoice;
