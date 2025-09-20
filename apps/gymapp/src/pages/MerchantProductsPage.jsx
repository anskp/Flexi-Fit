// src/pages/MerchantProductsPage.jsx
import { useState, useEffect } from 'react';
import * as merchantService from '../api/merchantService';
import parseApiError from '../utils/parseApiError';
import Header from '../components/Header';

// A simple form component for creating/editing products
const ProductForm = ({ onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, description, price: parseFloat(price), stock: parseInt(stock, 10) });
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md space-y-4 mb-8">
            <h3 className="text-xl font-semibold">Add New Product</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} className="w-full border-gray-300 rounded-lg" required />
                <input type="number" placeholder="Price ($)" value={price} onChange={e => setPrice(e.target.value)} className="w-full border-gray-300 rounded-lg" required />
                <input type="number" placeholder="Stock Quantity" value={stock} onChange={e => setStock(e.target.value)} className="w-full border-gray-300 rounded-lg" required />
            </div>
            <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full border-gray-300 rounded-lg" rows="3"></textarea>
            <div className="flex justify-end gap-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg">Save Product</button>
            </div>
        </form>
    );
};


export default function MerchantProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await merchantService.getMyProducts();
            if (response.success) {
                setProducts(response.data);
            }
        } catch (err) {
            setError(parseApiError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSaveProduct = async (productData) => {
        try {
            const response = await merchantService.createProduct(productData);
            if (response.success) {
                alert('Product created successfully!');
                setShowForm(false);
                fetchProducts(); // Refresh the list
            }
        } catch (err) {
            setError(parseApiError(err));
        }
    };

    if (loading) return <div>Loading products...</div>;
    if (error) return <div className="p-4 bg-red-100 text-red-800 rounded-lg">{error}</div>;

    return (
        <div>
            <Header title="My Products" subtitle="Manage your inventory and pricing." />
            <div className="mt-6">
                {!showForm && (
                    <button onClick={() => setShowForm(true)} className="px-5 py-2 mb-6 text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700">
                        + Add New Product
                    </button>
                )}
                {showForm && <ProductForm onSave={handleSaveProduct} onCancel={() => setShowForm(false)} />}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.length === 0 && !loading && <p>You haven't added any products yet.</p>}
                    {products.map(product => (
                        <div key={product.id} className="p-4 bg-white rounded-lg shadow">
                            <h3 className="text-lg font-bold">{product.name}</h3>
                            <p className="text-gray-600">${product.price.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                            <p className="mt-2 text-gray-700">{product.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}