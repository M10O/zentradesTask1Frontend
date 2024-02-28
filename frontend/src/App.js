import React, { useState, useEffect } from 'react';
import logo from '../src/logo.png'; // Import the logo image
import backgroundImage from '../src/bg-image.jpg';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
        const uniqueSubcategories = [...new Set(data.map(product => product.subcategory))];
        setSubcategories(uniqueSubcategories);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSubcategoryFilter = (e) => {
    const selectedSubcategory = e.target.value;
    if (selectedSubcategory === 'All') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => product.subcategory === selectedSubcategory);
      setFilteredProducts(filtered);
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = () => {
    const sortableProducts = [...filteredProducts];
    if (sortConfig.key !== null) {
      sortableProducts.sort((a, b) => {
        const valueA = isNaN(a[sortConfig.key]) ? a[sortConfig.key] : parseInt(a[sortConfig.key]);
        const valueB = isNaN(b[sortConfig.key]) ? b[sortConfig.key] : parseInt(b[sortConfig.key]);
        if (valueA < valueB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableProducts;
  };

  return (
    <div className="App">
      <img src={logo} alt="Logo" className="logo" style={{ marginTop: '20px', marginBottom: '20px' }} /> {/* Use the logo image */}
      <div className="background-container" />
      <div className="overlay" />
      <div className="content">
        <div className="table-box">
          <h1>Product List</h1>
          <div className="filter-container">
            <label htmlFor="subcategoryFilter">Filter by Subcategory:</label>
            <select id="subcategoryFilter" onChange={handleSubcategoryFilter}>
              <option value="All">All</option>
              {subcategories.map((subcategory, index) => (
                <option key={index} value={subcategory}>{subcategory}</option>
              ))}
            </select>
          </div>
          <div className="table-container">
            <table className="product-table">
              <thead>
                <tr>
                  <th onClick={() => requestSort('title')}>Title</th>
                  <th onClick={() => requestSort('subcategory')}>Subcategory</th>
                  <th onClick={() => requestSort('price')}>
                    Price {sortConfig.key === 'price' && (
                      sortConfig.direction === 'ascending' ? '▲' : '▼'
                    )}
                  </th>
                  <th onClick={() => requestSort('popularity')}>
                    Popularity {sortConfig.key === 'popularity' && (
                      sortConfig.direction === 'ascending' ? '▲' : '▼'
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts().map(product => (
                  <tr key={product.title}>
                    <td>{product.title}</td>
                    <td>{product.subcategory}</td>
                    <td>${product.price}</td>
                    <td>{product.popularity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
