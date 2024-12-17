import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DeliveryAddress.css";

const DeliveryAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    kelurahan: "",
    kecamatan: "",
    kabupaten: "",
    provinsi: "",
    detail: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch all addresses on component mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/delivery-addresses"); // Use your API endpoint
      setAddresses(response.data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/delivery-addresses/${editingId}`, form);
      } else {
        await axios.post("/delivery-addresses", form);
      }
      fetchAddresses();
      resetForm();
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const handleEdit = (address) => {
    setForm(address);
    setEditingId(address._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/delivery-addresses/${id}`);
      fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
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

  return (
    <div className="delivery-address-container">
      <h2>Delivery Address</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-left">
          <input type="text" name="name" value={form.name} onChange={handleInputChange} placeholder="Name" required />
          <textarea name="detail" value={form.detail} onChange={handleInputChange} placeholder="Detail Address" required />
        </div>
        <div className="form-right">
          <input type="text" name="kelurahan" value={form.kelurahan} onChange={handleInputChange} placeholder="Kelurahan" required />
          <input type="text" name="kecamatan" value={form.kecamatan} onChange={handleInputChange} placeholder="Kecamatan" required />
          <input type="text" name="kabupaten" value={form.kabupaten} onChange={handleInputChange} placeholder="Kabupaten" required />
          <input type="text" name="provinsi" value={form.provinsi} onChange={handleInputChange} placeholder="Provinsi" required />
        </div>
        <div className="form-buttons">
          <button type="submit">{editingId ? "Update Address" : "Add Address"}</button>
          {editingId && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="address-list">
        {addresses.map((address) => (
          <div className="address-card" key={address._id}>
            <h3>{address.name}</h3>
            <p>
              {address.detail}, {address.kelurahan}, {address.kecamatan}, {address.kabupaten}, {address.provinsi}
            </p>
            <button onClick={() => handleEdit(address)}>Edit</button>
            <button onClick={() => handleDelete(address._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryAddress;
