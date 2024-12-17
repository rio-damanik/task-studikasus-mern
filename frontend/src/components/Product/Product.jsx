// src/components/Product/Product.jsx
import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaTag } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import "./Product.css";
import { fetchProducts } from "../../services/api";
import { useOutletContext } from 'react-router-dom';

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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch products
        const productsResponse = await fetch('http://localhost:8000/api/products');
        const productsData = await productsResponse.json();
        setProductList(productsData.data || []);

        // Fetch categories
        const categoriesResponse = await fetch('http://localhost:8000/api/categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData || []);

        // Fetch tags
        const tagsResponse = await fetch('http://localhost:8000/api/tags');
        const tagsData = await tagsResponse.json();
        setTags(tagsData || []);

        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const handleTagClick = (tagId) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      }
      return [...prev, tagId];
    });
  };

  const filteredProducts = productList.filter(product => {
    const categoryMatch = !selectedCategory || product.category?._id === selectedCategory;
    const tagsMatch = selectedTags.length === 0 || 
      (product.tags && product.tags.some(tag => selectedTags.includes(tag._id)));
    return categoryMatch && tagsMatch;
  });

  const handleAddToCart = (product) => {
    // Implement cart functionality
    alert(`${product.name} added to cart!`);
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="product-container">
      <div className="filters-section">
        <div className="filter-group">
          <h3><MdCategory /> Categories</h3>
          <div className="filter-buttons">
            {categories.map(category => (
              <button
                key={category._id}
                className={`filter-chip ${selectedCategory === category._id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category._id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3><FaTag /> Tags</h3>
          <div className="filter-buttons">
            {tags.map(tag => (
              <button
                key={tag._id}
                className={`filter-chip ${selectedTags.includes(tag._id) ? 'active' : ''}`}
                onClick={() => handleTagClick(tag._id)}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div className="product-card" key={product._id}>
            <div className="product-image-container">
              <img 
                src={product.image_url || "/placeholder.png"} 
                alt={product.name} 
                className="product-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder.png';
                }}
              />
              <div className="product-badges">
                {product.category && (
                  <span className="category-badge">
                    {product.category.name}
                  </span>
                )}
                {product.tags && product.tags.map(tag => (
                  <span key={tag._id} className="tag-badge">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="product-details">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">
                {product.description || ""}
              </p>
              <div className="product-footer">
                <span className="product-price">{formatRupiah(product.price)}</span>
                <button 
                  className="add-to-cart-button" 
                  onClick={() => handleAddToCart(product)}
                >
                  <FaShoppingCart /> Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
