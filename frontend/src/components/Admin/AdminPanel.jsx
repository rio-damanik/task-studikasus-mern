import React from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Panel</h2>
      </div>
      <div className="admin-content">
        <div className="admin-card">
          <h3>Products</h3>
          <p>Manage your products</p>
          <button className="admin-button">View Products</button>
        </div>
        <div className="admin-card">
          <h3>Orders</h3>
          <p>View and manage orders</p>
          <button className="admin-button">View Orders</button>
        </div>
        <div className="admin-card">
          <h3>Users</h3>
          <p>Manage user accounts</p>
          <button className="admin-button">View Users</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
