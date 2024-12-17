// src/components/Product/Product.jsx
import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import "./Product.css";
import { fetchProducts } from "../../services/api";
import { useOutletContext } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

// Rupiah formatting function
const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(number);
};

const Product = () => {
  const context = useOutletContext() || {};
  const { selectedTag } = context;
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localSelectedTag, setLocalSelectedTag] = useState(selectedTag);
  const { addToCart: addToCartContext } = useCart();

  const filteredProducts = localSelectedTag && productList.length > 0
    ? productList.filter((product) => 
        product.tags && product.tags.some(tag => 
          (typeof tag === 'object' ? tag._id : tag) === localSelectedTag
        )
      ) 
    : productList;

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const response = await fetchProducts();
        const data = await response.json();
        setProductList(data.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    getProducts();
  }, []);

  useEffect(() => {
    setLocalSelectedTag(selectedTag);
  }, [selectedTag]);

  const handleAddToCart = (product) => {
    addToCartContext(product);
    // Show some feedback to the user
    alert(`${product.name} added to cart!`);
  };

  const handleTagClick = (tagId, tagName) => {
    setLocalSelectedTag(tagId === localSelectedTag ? null : tagId);
  };

  const renderTag = (tag) => {
    if (!tag) return null;
    // Handle both object tags and string tag IDs
    const tagId = typeof tag === 'object' ? tag._id : tag;
    const tagName = typeof tag === 'object' ? tag.name : tag;
    
    return (
      <button 
        key={tagId} 
        className={`tag-button ${localSelectedTag === tagId ? 'active' : ''}`}
        onClick={() => handleTagClick(tagId, tagName)}
      >
        {tagName}
      </button>
    );
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="product-container">
      <h2>Products {localSelectedTag && `- ${localSelectedTag}`}</h2>
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div className="product-card" key={product._id}>
            <img 
              src={product.image_url || "https://via.placeholder.com/100"} 
              alt={product.name} 
              className="product-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder.png';
              }}
            />
            <div className="product-details">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">
                {product.description || ""}
              </p>
              <div className="product-tags">
                {product.tags && Array.isArray(product.tags) && product.tags.map(tag => renderTag(tag))}
              </div>
              <p className="product-price">{formatRupiah(product.price)}</p>
              <button 
                className="add-to-cart-button" 
                onClick={() => handleAddToCart(product)}
              >
                <FaShoppingCart /> Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
