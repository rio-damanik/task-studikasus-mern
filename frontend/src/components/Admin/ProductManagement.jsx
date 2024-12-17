import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './ProductManagement.css';

const ProductManagement = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchTags();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/products');
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tags');
      setTags(response.data);
    } catch (err) {
      console.error('Failed to fetch tags:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagChange = (tagId) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      }
      return [...prev, tagId];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('stock', formData.stock);
      selectedTags.forEach(tagId => {
        formDataToSend.append('tags[]', tagId);
      });
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (editingProduct) {
        await axios.put(`http://localhost:8000/api/products/${editingProduct._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else {
        await axios.post('http://localhost:8000/api/products', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
      fetchProducts();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category._id,
      stock: product.stock
    });
    setSelectedTags(product.tags.map(tag => tag._id));
    setImagePreview(product.image_url);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:8000/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        fetchProducts();
      } catch (err) {
        setError('Failed to delete product');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: ''
    });
    setSelectedTags([]);
    setImageFile(null);
    setImagePreview('');
  };

  if (!user || user.role !== 'admin') {
    return <div className="unauthorized">Unauthorized Access</div>;
  }

  return (
    <div className="product-management">
      <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label>
            <i className="fas fa-utensils"></i>
            <span>Product Name</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Enter product name"
          />
        </div>

        <div className="form-group">
          <label>
            <i className="fas fa-align-left"></i>
            <span>Description</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            placeholder="Enter product description"
          />
        </div>

        <div className="form-group">
          <label>
            <i className="fas fa-tag"></i>
            <span>Price</span>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            placeholder="Enter price"
          />
        </div>

        <div className="form-group">
          <label>
            <i className="fas fa-list"></i>
            <span>Category</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>
            <i className="fas fa-tags"></i>
            <span>Tags</span>
          </label>
          <div className="tags-container">
            {tags.map(tag => (
              <label key={tag._id} className="tag-checkbox">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag._id)}
                  onChange={() => handleTagChange(tag._id)}
                />
                <span>{tag.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>
            <i className="fas fa-image"></i>
            <span>Product Image</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>
            <i className="fas fa-cubes"></i>
            <span>Stock</span>
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            required
            min="0"
            placeholder="Enter stock quantity"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>{editingProduct ? 'Update Product' : 'Add Product'}</>
            )}
          </button>
          {editingProduct && (
            <button type="button" onClick={resetForm} className="cancel-button">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="products-list">
        <h3>Products List</h3>
        {loading && !editingProduct ? (
          <div className="loading">Loading products...</div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div key={product._id} className="product-card">
                <img src={product.image_url} alt={product.name} className="product-image" />
                <div className="product-details">
                  <h4>{product.name}</h4>
                  <p className="price">Rp {product.price.toLocaleString()}</p>
                  <p className="category">{product.category?.name}</p>
                  <div className="product-tags">
                    {product.tags?.map(tag => (
                      <span key={tag._id} className="tag">{tag.name}</span>
                    ))}
                  </div>
                  <p className="stock">Stock: {product.stock}</p>
                  <div className="product-actions">
                    <button onClick={() => handleEdit(product)} className="edit-button">
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="delete-button">
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
