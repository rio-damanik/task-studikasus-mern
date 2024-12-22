import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './Invoice.css';

// Helper function to format numbers as Rupiah currency
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(number);
};

const Invoice = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/order/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInvoice(response.data);
      } catch (err) {
        setError('Failed to load invoice');
        console.error('Error fetching invoice:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [orderId, token]);

  if (loading) {
    return (
      <div className="invoice-container">
        <div className="loading">Loading invoice...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="invoice-container">
        <div className="error">{error}</div>
        <button onClick={() => navigate('/')} className="back-button">
          Back to Home
        </button>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="invoice-container">
        <div className="error">Invoice not found</div>
        <button onClick={() => navigate('/')} className="back-button">
          Back to Home
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="invoice-container">
      <div className="invoice-content">
        <div className="invoice-header">
          <h1>Invoice</h1>
          <div className="invoice-info">
            <p>Order ID: #{invoice.order_number || orderId}</p>
            <p>Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
            <p>Status: {invoice.status}</p>
          </div>
        </div>

        {invoice.delivery_address && (
          <div className="delivery-info">
            <h2>Delivery Information</h2>
            <div className="address">
              <p>{invoice.delivery_address.name}</p>
              <p>{invoice.delivery_address.detail}</p>
              <p>
                {invoice.delivery_address.kelurahan}, {invoice.delivery_address.kecamatan}
              </p>
              <p>
                {invoice.delivery_address.kabupaten}, {invoice.delivery_address.provinsi}
              </p>
            </div>
          </div>
        )}

        <div className="order-items">
          <h2>Order Items</h2>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {(invoice.orderItems || []).map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.qty}</td>
                  <td>{formatRupiah(item.price)}</td>
                  <td>{formatRupiah(item.price * item.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="invoice-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>{formatRupiah(invoice.sub_total || 0)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee:</span>
            <span>{formatRupiah(invoice.delivery_fee || 0)}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>{formatRupiah(invoice.total || 0)}</span>
          </div>
        </div>

        <div className="invoice-footer">
          {invoice.metode_payment && (
            <p>Payment Method: {invoice.metode_payment}</p>
          )}
          <div className="actions">
            <button onClick={handlePrint} className="print-button">
              Print Invoice
            </button>
            <button onClick={() => navigate('/')} className="back-button">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
