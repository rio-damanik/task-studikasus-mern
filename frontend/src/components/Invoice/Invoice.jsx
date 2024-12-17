import React, { useState } from "react";
import "./Invoice.css";

// Helper function to format numbers as Rupiah currency
const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(number);
};

// Helper function to format ISO date string to a readable format
const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  }).format(date);
};

const Invoice = () => {
  // Mock invoice data with recipient's name and timestamp
  const [invoice, setInvoice] = useState({
    delivery_fee: 20000,
    metode_payment: "transfer",
    recipient_name: "John Doe",
    created_at: "2024-12-15T20:44:17+07:00", // Using the provided timestamp
    delivery_address: {
      kelurahan: "Kelurahan A",
      kecamatan: "Kecamatan B",
      kabupaten: "Kabupaten C",
      provinsi: "Provinsi D",
      detail: "Jalan Raya No. 123, Blok D",
    },
    order: {
      orderItems: [
        {
          _id: "1",
          product: { name: "Burger", price: 20000 },
          quantity: 2,
        },
        {
          _id: "2",
          product: { name: "Cake", price: 15000 },
          quantity: 1,
        },
        {
          _id: "3",
          product: { name: "Coffee", price: 10000 },
          quantity: 3,
        },
      ],
    },
  });

  // Calculate subtotal based on order items
  const calculateSubtotal = () => {
    return invoice.order.orderItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  // Calculate total including delivery fee
  const calculateTotal = () => {
    return calculateSubtotal() + invoice.delivery_fee;
  };

  return (
    <div className="invoice-container">
      <h2>Invoice</h2>

      <div className="invoice-details">
        {/* Displaying the recipient's name */}
        <div className="invoice-recipient">
          <h3>Recipient</h3>
          <p>{invoice.recipient_name}</p>
        </div>

        <div className="invoice-address">
          <h3>Delivery Address</h3>
          <p>{invoice.delivery_address.detail}</p>
          <p>
            {invoice.delivery_address.kelurahan}, {invoice.delivery_address.kecamatan}, {invoice.delivery_address.kabupaten}, {invoice.delivery_address.provinsi}
          </p>
        </div>

        <div className="invoice-summary">
          <div className="summary-item">
            <span>Subtotal:</span>
            <span>{formatRupiah(calculateSubtotal())}</span>
          </div>
          <div className="summary-item">
            <span>Delivery Fee:</span>
            <span>{formatRupiah(invoice.delivery_fee)}</span>
          </div>
          <div className="summary-item total">
            <span>Total:</span>
            <span>{formatRupiah(calculateTotal())}</span>
          </div>
          <div className="summary-item">
            <span>Payment Method:</span>
            <span>{invoice.metode_payment === "tunai" ? "Cash" : "Transfer"}</span>
          </div>
          <div className="summary-item">
            <span>Created At:</span>
            <span>{formatDateTime(invoice.created_at)}</span>
          </div>
        </div>
      </div>

      <div className="invoice-items">
        <h3>Order Items</h3>
        {invoice.order.orderItems.map((item) => (
          <div className="invoice-item" key={item._id}>
            <div className="item-details">
              <span className="item-name">{item.product.name}</span>
              <span className="item-quantity">x{item.quantity}</span>
            </div>
            <div className="item-price">{formatRupiah(item.product.price * item.quantity)}</div>
          </div>
        ))}
      </div>

      <button className="invoice-button">Confirm Order</button>
    </div>
  );
};

export default Invoice;
