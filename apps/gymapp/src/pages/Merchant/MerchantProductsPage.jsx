// src/pages/Merchant/MerchantProductsPage.jsx
import React, { useState } from 'react';

const MOCK_PRODUCTS = [
  { id: 1, name: "Whey Protein Isolate (Chocolate)", price: 49.99, stock: 89, category: "Supplements", image: "https://via.placeholder.com/80/4ade80/FFFFFF?text=WP" },
  { id: 2, name: "Resistance Band Set (5 Levels)", price: 24.99, stock: 156, category: "Equipment", image: "https://via.placeholder.com/80/fbbf24/FFFFFF?text=RB" },
  { id: 3, name: "Premium Yoga Mat (Eco-Friendly)", price: 69.99, stock: 32, category: "Accessories", image: "https://via.placeholder.com/80/60a5fa/FFFFFF?text=YM" },
  { id: 4, name: "Pre-Workout Formula (Fruit Punch)", price: 39.99, stock: 0, category: "Supplements", image: "https://via.placeholder.com/80/f87171/FFFFFF?text=PW" },
  { id: 5, name: "Fitness Tracker Watch", price: 129.99, stock: 12, category: "Equipment", image: "https://via.placeholder.com/80/8b5cf6/FFFFFF?text=FT" },
  { id: 6, name: "Gym Towel Set (3-Pack)", price: 19.99, stock: 203, category: "Accessories", image: "https://via.placeholder.com/80/06b6d4/FFFFFF?text=GT" },
];

const CATEGORIES = ["All", "Supplements", "Equipment", "Accessories"];

export default function MerchantProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProducts, setSelectedProducts] = useState([]);

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleSelectProduct = (id) => {
    setSelectedProducts(prev =>
      prev.includes(id)
        ? prev.filter(pid => pid !== id)
        : [...prev, id]
    );
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk ${action} for products:`, selectedProducts);
  };

  return (
    <div className="w-full animate-fade-in">
      {/* Header */}
      <div className="bg-transparent p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Product Catalog</h2>
            <p className="text-gray-300">Manage all your listed products</p>
          </div>
          <button className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-6 rounded-lg transition transform hover:scale-105 shadow-md whitespace-nowrap">
            + Add New Product
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 min-w-40"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="bg-blue-900/30 border border-blue-700 p-3 rounded-lg mb-6 flex items-center justify-between">
            <span className="text-blue-200">{selectedProducts.length} products selected</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="bg-teal-600 hover:bg-teal-500 text-white text-sm px-3 py-1 rounded transition"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="bg-gray-600 hover:bg-gray-500 text-white text-sm px-3 py-1 rounded transition"
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="bg-red-600 hover:bg-red-500 text-white text-sm px-3 py-1 rounded transition"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="px-6 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-gray-800 p-5 rounded-xl shadow-xl border border-gray-700 hover:bg-gray-750 transition transform hover:scale-105 group"
            >
              <div className="flex justify-between items-start mb-3">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => toggleSelectProduct(product.id)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className={`text-xs px-2 py-1 rounded-full ${
                  product.stock > 0 ? "bg-green-600 text-green-100" : "bg-red-600 text-red-100"
                }`}>
                  {product.stock > 0 ? `${product.stock}` : "0"} in stock
                </span>
              </div>

              <div className="flex justify-center mb-4">
                <img src={product.image} alt={product.name} className="w-20 h-20 object-contain" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
              <p className="text-teal-400 font-bold text-lg">${product.price}</p>
              <p className="text-gray-400 text-xs mb-4">{product.category}</p>

              <div className="flex gap-1 w-full">
                <button className="flex-1 bg-teal-600 hover:bg-teal-500 text-white text-xs py-2 px-3 rounded transition">
                  Edit
                </button>
                <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs py-2 px-3 rounded transition">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No products found</div>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}