import React, { useEffect, useState } from "react";
import { FaFire, FaSnowflake, FaLeaf, FaHamburger, FaWater, FaTag, FaShoppingCart } from 'react-icons/fa';
import { GiChickenOven, GiCook } from 'react-icons/gi';
import { MdLocalDining, MdCategory } from 'react-icons/md';
import "./Product.css";
import { useCart } from '../../context/CartContext';

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(number);
};

const Product = () => {
  const [productList, setProductList] = useState([]);
  const [categories, setCategories] = useState([
    { _id: 'makanan', name: 'Makanan' },
    { _id: 'minuman', name: 'Minuman' },
    { _id: 'dessert', name: 'Dessert' }
  ]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const { addToCart: addToCartContext } = useCart();

  // Data tag statis
  const tags = [
    { _id: 'tag1', name: 'Pedas' },
    { _id: 'tag2', name: 'Dingin' },
    { _id: 'tag3', name: 'Vegetarian' },
    { _id: 'tag4', name: 'Halal' },
    { _id: 'tag5', name: 'Goreng' },
    { _id: 'tag6', name: 'Berkuah' },
    { _id: 'tag7', name: 'Bakar' },
    { _id: 'tag8', name: 'Populer' }
  ];

  const getTagIcon = (tag) => {
    switch (tag.toLowerCase()) {
      case 'pedas':
        return <FaFire />;
      case 'dingin':
        return <FaSnowflake />;
      case 'vegetarian':
        return <FaLeaf />;
      case 'halal':
        return <GiCook />;
      case 'goreng':
        return <FaHamburger />;
      case 'berkuah':
        return <FaWater />;
      case 'bakar':
        return <GiChickenOven />;
      case 'populer':
        return <MdLocalDining />;
      default:
        return <FaTag />;
    }
  };

  const getTagColor = (tagName) => {
    const tagColors = {
      'pedas': '#ff4d4d',
      'populer': '#ffd700',
      'dingin': '#00bfff',
      'vegetarian': '#32cd32',
      'halal': '#4caf50',
      'goreng': '#ff8c00',
      'berkuah': '#4169e1',
      'bakar': '#ff6b6b'
    };
    return tagColors[tagName.toLowerCase()] || '#808080';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsRes = await fetch('http://localhost:8000/api/products?limit=100');
        const productsData = await productsRes.json();
        
        // Kategorikan produk berdasarkan namanya
        const products = productsData.data.map(product => {
          // Jika produk belum memiliki kategori, tentukan berdasarkan nama
          if (!product.category) {
            const nameLower = product.name.toLowerCase();
            if (nameLower.includes('nasi') || 
                nameLower.includes('mie') || 
                nameLower.includes('ayam') || 
                nameLower.includes('bakso') ||
                nameLower.includes('sop') ||
                nameLower.includes('ikan') ||
                nameLower.includes('buntut') ||
                nameLower.includes('bakar') ||
                nameLower.includes('capcay') ||
                nameLower.includes('rendang') ||
                nameLower.includes('gado')) {
              product.category = { _id: '656c0eb807d3e9dbe63afa89', name: 'Makanan' };
            } else if (nameLower.includes('es') || 
                      nameLower.includes('teh') || 
                      nameLower.includes('jus') || 
                      nameLower.includes('kopi') ||
                      nameLower.includes('thai') ||
                      nameLower.includes('tea')) {
              product.category = { _id: '656c0eb807d3e9dbe63afa92', name: 'Minuman' };
            } else if (nameLower.includes('smoothie') ||
                      nameLower.includes('pudding') ||
                      nameLower.includes('ice cream') ||
                      nameLower.includes('dessert')) {
              product.category = { _id: '656c0eb807d3e9dbe63afa96', name: 'Dessert' };
            }
          }
          // Menambahkan tag statis ke setiap produk
          product.tags = [
            tags[Math.floor(Math.random() * 3)], // Tambahkan 1-3 tag random
            tags[Math.floor(Math.random() * 3) + 3],
            tags[Math.floor(Math.random() * 2) + 6]
          ];
          return product;
        });
        
        setProductList(products);

        // Fetch categories
        const categoriesRes = await fetch('http://localhost:8000/api/categories');
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData || []);

      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    addToCartContext(product);
    alert(`${product.name} added to cart!`);
  };

  const handleTagClick = (tagId) => {
    setSelectedTag(tagId === selectedTag ? 'all' : tagId);
  };

  const filteredProducts = productList.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category?._id === selectedCategory;
    const tagMatch = selectedTag === 'all' || 
      product.tags?.some(tag => tag._id === selectedTag);
    return categoryMatch && tagMatch;
  });

  return (
    <div className="pos-container">
      <div className="pos-filters">
        {/* Category Buttons */}
        <div className="filter-section">
          <h3 className="filter-title"><MdCategory /> Categories</h3>
          <div className="filter-buttons">
            <button 
              className={`filter-button ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              Semua Menu
            </button>
            {categories.map(category => (
              <button
                key={category._id}
                className={`filter-button ${selectedCategory === category._id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category._id)}
              >
                {category.name || 'Uncategorized'}
              </button>
            ))}
          </div>
        </div>

        {/* Tag Buttons */}
        <div className="filter-section">
          <h3 className="filter-title"><FaTag /> Tags</h3>
          <div className="filter-buttons">
            <button 
              className={`filter-button ${selectedTag === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedTag('all')}
            >
              Semua Tag
            </button>
            {tags.map(tag => (
              <button 
                key={tag._id}
                className={`filter-button tag ${selectedTag === tag._id ? 'active' : ''}`}
                onClick={() => handleTagClick(tag._id)}
                style={{
                  backgroundColor: selectedTag === tag._id ? getTagColor(tag.name) : 'transparent',
                  color: selectedTag === tag._id ? 'white' : getTagColor(tag.name),
                  borderColor: getTagColor(tag.name)
                }}
              >
                {getTagIcon(tag.name)} {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pos-grid">
        {filteredProducts.map(product => (
          <div key={product._id} className="pos-card">
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="pos-image"
            />
            <div className="pos-info">
              <div className="pos-header">
                <div className="pos-category">
                  <MdCategory /> {product.category?.name || 'Uncategorized'}
                </div>
                <div className="pos-tags">
                  {product.tags?.map(tag => (
                    <button
                      key={tag._id}
                      className={`pos-tag-button ${selectedTag === tag._id ? 'active' : ''}`}
                      onClick={() => handleTagClick(tag._id)}
                      style={{
                        backgroundColor: selectedTag === tag._id ? getTagColor(tag.name) : 'transparent',
                        color: selectedTag === tag._id ? 'white' : getTagColor(tag.name),
                        borderColor: getTagColor(tag.name)
                      }}
                    >
                      {getTagIcon(tag.name)} {tag.name}
                    </button>
                  ))}
                </div>
                <h3>{product.name}</h3>
                <p className="pos-description">{product.description}</p>
              </div>
              <div className="pos-content">
                <div className="pos-footer">
                  <span className="pos-price">{formatRupiah(product.price)}</span>
                  <button 
                    className="pos-add-button"
                    onClick={() => handleAddToCart(product)}
                  >
                    <FaShoppingCart /> Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
