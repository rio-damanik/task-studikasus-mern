import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeliveryAddress } from '../../context/DeliveryAddressContext';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaTimes, FaCheck } from 'react-icons/fa';
import './DeliveryAddress.css';

const DeliveryAddress = ({ isModal, onClose, onSelect, selectedId }) => {
  const navigate = useNavigate();
  const { 
    addresses, 
    loading, 
    error: contextError, 
    fetchAddresses, 
    addAddress,
    updateAddress,
    deleteAddress 
  } = useDeliveryAddress();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    nama: '',
    detail: '',
    kelurahan: '',
    kecamatan: '',
    kabupaten: '',
    provinsi: ''
  });

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    if (formError) setFormError('');
  };

  const validateForm = () => {
    if (!form.nama.trim()) return 'Name is required';
    if (!form.detail.trim()) return 'Address detail is required';
    if (!form.kelurahan.trim()) return 'Kelurahan is required';
    if (!form.kecamatan.trim()) return 'Kecamatan is required';
    if (!form.kabupaten.trim()) return 'Kabupaten is required';
    if (!form.provinsi.trim()) return 'Provinsi is required';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      let savedAddress;
      if (editingId) {
        savedAddress = await updateAddress(editingId, form);
      } else {
        savedAddress = await addAddress(form);
      }
      resetForm();
      setShowForm(false);
      await fetchAddresses();
      
      if (isModal && onSelect) {
        onSelect(savedAddress);
      }
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to save address');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (address) => {
    setEditingId(address._id);
    setForm({
      nama: address.nama,
      detail: address.detail,
      kelurahan: address.kelurahan,
      kecamatan: address.kecamatan,
      kabupaten: address.kabupaten,
      provinsi: address.provinsi
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }
    try {
      await deleteAddress(id);
      await fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const resetForm = () => {
    setForm({
      nama: '',
      detail: '',
      kelurahan: '',
      kecamatan: '',
      kabupaten: '',
      provinsi: ''
    });
    setEditingId(null);
    setFormError('');
  };

  const handleBack = () => {
    if (isModal && onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const handleSelect = (address) => {
    if (onSelect) {
      onSelect(address);
    }
  };

  const containerClass = isModal ? 'delivery-address-modal' : 'delivery-address-page';

  return (
    <div className={containerClass}>
      {isModal && (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="content-wrapper">
              <div className="page-header">
                <button onClick={handleBack} className="back-button">
                  <FaTimes />
                </button>
                <h1>Select Delivery Address</h1>
                {!showForm && (
                  <button onClick={() => setShowForm(true)} className="add-address-button">
                    <FaPlus /> Add New Address
                  </button>
                )}
              </div>

              {contextError && <div className="error-message">{contextError}</div>}

              {showForm ? (
                <div className="address-form-container">
                  <div className="form-header">
                    <h2>{editingId ? 'Edit Address' : 'Add New Address'}</h2>
                    <button 
                      onClick={() => {
                        setShowForm(false);
                        resetForm();
                      }} 
                      className="close-button"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  {formError && <div className="error-message">{formError}</div>}

                  <form onSubmit={handleSubmit} className="address-form">
                    <div className="form-group">
                      <label htmlFor="nama">Name:</label>
                      <input
                        type="text"
                        id="nama"
                        name="nama"
                        value={form.nama}
                        onChange={handleInputChange}
                        placeholder="Enter recipient name"
                        disabled={submitting}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="detail">Detail Address:</label>
                      <textarea
                        id="detail"
                        name="detail"
                        value={form.detail}
                        onChange={handleInputChange}
                        placeholder="Enter street name, building number, etc."
                        disabled={submitting}
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
                          placeholder="Enter kelurahan"
                          disabled={submitting}
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
                          placeholder="Enter kecamatan"
                          disabled={submitting}
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
                          placeholder="Enter kabupaten"
                          disabled={submitting}
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
                          placeholder="Enter provinsi"
                          disabled={submitting}
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button 
                        type="button" 
                        onClick={() => {
                          setShowForm(false);
                          resetForm();
                        }}
                        className="cancel-button"
                        disabled={submitting}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="submit-button"
                        disabled={submitting}
                      >
                        {submitting ? 'Saving...' : (editingId ? 'Update Address' : 'Save Address')}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="addresses-container">
                  {loading ? (
                    <div className="loading-message">Loading addresses...</div>
                  ) : addresses.length === 0 ? (
                    <div className="no-addresses">
                      <p>You haven't added any delivery addresses yet.</p>
                      <button onClick={() => setShowForm(true)} className="add-first-address-button">
                        <FaPlus /> Add Your First Address
                      </button>
                    </div>
                  ) : (
                    <div className="address-grid">
                      {addresses.map((address) => (
                        <div key={address._id} className={`address-card ${selectedId === address._id ? 'selected' : ''}`}>
                          <div className="address-info">
                            <h3>{address.nama}</h3>
                            <p>{address.detail}</p>
                            <p>{address.kelurahan}, {address.kecamatan}</p>
                            <p>{address.kabupaten}, {address.provinsi}</p>
                          </div>
                          <div className="address-actions">
                            {isModal ? (
                              <button 
                                onClick={() => handleSelect(address)} 
                                className="select-button"
                              >
                                {selectedId === address._id ? (
                                  <><FaCheck /> Selected</>
                                ) : (
                                  'Select'
                                )}
                              </button>
                            ) : (
                              <>
                                <button 
                                  onClick={() => handleEdit(address)} 
                                  className="edit-button"
                                >
                                  <FaEdit /> Edit
                                </button>
                                <button 
                                  onClick={() => handleDelete(address._id)} 
                                  className="delete-button"
                                >
                                  <FaTrash /> Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {!isModal && (
        <div className="content-wrapper">
          <div className="page-header">
            <button onClick={handleBack} className="back-button">
              <FaArrowLeft /> Back
            </button>
            <h1>Delivery Addresses</h1>
            {!showForm && (
              <button onClick={() => setShowForm(true)} className="add-address-button">
                <FaPlus /> Add New Address
              </button>
            )}
          </div>

          {contextError && <div className="error-message">{contextError}</div>}

          {showForm ? (
            <div className="address-form-container">
              <div className="form-header">
                <h2>{editingId ? 'Edit Address' : 'Add New Address'}</h2>
                <button 
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }} 
                  className="close-button"
                >
                  <FaTimes />
                </button>
              </div>

              {formError && <div className="error-message">{formError}</div>}

              <form onSubmit={handleSubmit} className="address-form">
                <div className="form-group">
                  <label htmlFor="nama">Name:</label>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    value={form.nama}
                    onChange={handleInputChange}
                    placeholder="Enter recipient name"
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="detail">Detail Address:</label>
                  <textarea
                    id="detail"
                    name="detail"
                    value={form.detail}
                    onChange={handleInputChange}
                    placeholder="Enter street name, building number, etc."
                    disabled={submitting}
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
                      placeholder="Enter kelurahan"
                      disabled={submitting}
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
                      placeholder="Enter kecamatan"
                      disabled={submitting}
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
                      placeholder="Enter kabupaten"
                      disabled={submitting}
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
                      placeholder="Enter provinsi"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="cancel-button"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={submitting}
                  >
                    {submitting ? 'Saving...' : (editingId ? 'Update Address' : 'Save Address')}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="addresses-container">
              {loading ? (
                <div className="loading-message">Loading addresses...</div>
              ) : addresses.length === 0 ? (
                <div className="no-addresses">
                  <p>You haven't added any delivery addresses yet.</p>
                  <button onClick={() => setShowForm(true)} className="add-first-address-button">
                    <FaPlus /> Add Your First Address
                  </button>
                </div>
              ) : (
                <div className="address-grid">
                  {addresses.map((address) => (
                    <div key={address._id} className={`address-card ${selectedId === address._id ? 'selected' : ''}`}>
                      <div className="address-info">
                        <h3>{address.nama}</h3>
                        <p>{address.detail}</p>
                        <p>{address.kelurahan}, {address.kecamatan}</p>
                        <p>{address.kabupaten}, {address.provinsi}</p>
                      </div>
                      <div className="address-actions">
                        {isModal ? (
                          <button 
                            onClick={() => handleSelect(address)} 
                            className="select-button"
                          >
                            {selectedId === address._id ? (
                              <><FaCheck /> Selected</>
                            ) : (
                              'Select'
                            )}
                          </button>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleEdit(address)} 
                              className="edit-button"
                            >
                              <FaEdit /> Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(address._id)} 
                              className="delete-button"
                            >
                              <FaTrash /> Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryAddress;
