import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./DeliveryAddress.css";

const DeliveryAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useAuth();
  const [form, setForm] = useState({
    name: "",
    kelurahan: "",
    kecamatan: "",
    kabupaten: "",
    provinsi: "",
    detail: "",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:8000/api/delivery-addresses", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAddresses(response.data.data || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setError("Failed to load addresses. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:8000/api/delivery-addresses/${editingId}`, 
          form,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      } else {
        await axios.post(
          "http://localhost:8000/api/delivery-addresses", 
          form,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      }
      await fetchAddresses();
      resetForm();
    } catch (error) {
      console.error("Error saving address:", error);
      setError("Failed to save address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address) => {
    setEditingId(address._id);
    setForm({
      name: address.name,
      kelurahan: address.kelurahan,
      kecamatan: address.kecamatan,
      kabupaten: address.kabupaten,
      provinsi: address.provinsi,
      detail: address.detail,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.delete(
        `http://localhost:8000/api/delivery-addresses/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      await fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      setError("Failed to delete address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      kelurahan: "",
      kecamatan: "",
      kabupaten: "",
      provinsi: "",
      detail: "",
    });
    setEditingId(null);
  };

  if (loading && addresses.length === 0) {
    return <div className="loading">Loading addresses...</div>;
  }

  return (
    <div className="delivery-address-container">
      <h2>{editingId ? "Edit Address" : "Add New Address"}</h2>
      
      {error && <div className="error-message" role="alert">{error}</div>}

      <form onSubmit={handleSubmit} className="address-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="detail">Detail Address:</label>
          <textarea
            id="detail"
            name="detail"
            value={form.detail}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="kelurahan">Kelurahan:</label>
            <input
              type="text"
              id="kelurahan"
              name="kelurahan"
              value={form.kelurahan}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="kecamatan">Kecamatan:</label>
            <input
              type="text"
              id="kecamatan"
              name="kecamatan"
              value={form.kecamatan}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="kabupaten">Kabupaten:</label>
            <input
              type="text"
              id="kabupaten"
              name="kabupaten"
              value={form.kabupaten}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="provinsi">Provinsi:</label>
            <input
              type="text"
              id="provinsi"
              name="provinsi"
              value={form.provinsi}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-actions">
          {editingId && (
            <button 
              type="button" 
              onClick={resetForm}
              className="cancel-button"
              disabled={loading}
            >
              Cancel
            </button>
          )}
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? "Saving..." : editingId ? "Update Address" : "Add Address"}
          </button>
        </div>
      </form>

      <div className="addresses-list">
        <h3>Saved Addresses</h3>
        {addresses.length === 0 ? (
          <p>No addresses saved yet.</p>
        ) : (
          addresses.map((address) => (
            <div key={address._id} className="address-card">
              <div className="address-content">
                <h4>{address.name}</h4>
                <p>{address.detail}</p>
                <p>
                  {address.kelurahan}, {address.kecamatan}, {address.kabupaten}, {address.provinsi}
                </p>
              </div>
              <div className="address-actions">
                <button
                  onClick={() => handleEdit(address)}
                  className="edit-button"
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(address._id)}
                  className="delete-button"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DeliveryAddress;
