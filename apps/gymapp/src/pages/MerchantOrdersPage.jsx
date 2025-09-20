// src/pages/MerchantOrdersPage.jsx
import { useState, useEffect } from 'react';
import * as merchantService from '../api/merchantService';
import parseApiError from '../utils/parseApiError';
import Header from '../components/Header';

export default function MerchantOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await merchantService.getMyOrders();
                if (response.success) {
                    setOrders(response.data);
                }
            } catch (err) {
                setError(parseApiError(err));
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div>Loading orders...</div>;
    if (error) return <div className="p-4 bg-red-100 text-red-800 rounded-lg">{error}</div>;

    return (
        <div>
            <Header title="My Orders" subtitle="View and manage incoming customer orders." />
            <div className="mt-6 bg-white rounded-lg shadow">
                <div className="space-y-4 p-4">
                    {orders.length === 0 && !loading && <p>You have no orders yet.</p>}
                    {orders.map(order => (
                        <div key={order.id} className="p-4 border rounded-md">
                            <div className="flex justify-between font-bold">
                                <span>Order #{order.id.slice(-6)}</span>
                                <span>Customer: {order.user.email}</span>
                                <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="mt-2 pl-4 border-l-2">
                                <h4 className="font-semibold">Items in this Order:</h4>
                                {order.items.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span>{item.product.name} (x{item.quantity})</span>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}