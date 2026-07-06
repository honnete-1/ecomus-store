import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Package, Clock } from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/api/auth/orders');
        if (response.data.success) {
          // Based on Swagger, data is array of orders inside response.data.data
          setOrders(response.data.data || []);
        } else {
          setError('Failed to load orders.');
        }
      } catch (err) {
        setError('Error retrieving your order history.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-light-gray border-t-luxury-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-20 text-center max-w-lg mx-auto">
        <div className="inline-flex justify-center items-center w-24 h-24 bg-gray-50 rounded-full mb-6">
          <Package className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-medium text-charcoal mb-4">No Orders Yet</h2>
        <p className="text-text-light">You haven't placed any orders yet. Discover our collection.</p>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-charcoal mb-10">Order History</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-light-gray rounded-lg overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-light-gray flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <p className="text-sm text-text-light mb-1">Order Placed</p>
                <p className="text-charcoal font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <p className="text-sm text-text-light mb-1 sm:text-right">Total</p>
                <p className="text-charcoal font-medium sm:text-right">${order.total.toFixed(2)}</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <p className="text-sm text-text-light mb-1 sm:text-right">Order #</p>
                <p className="text-charcoal font-mono text-sm sm:text-right">{order.id.substring(0, 8).toUpperCase()}</p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="flex items-center text-sm font-medium text-charcoal">
                  <Clock className="w-4 h-4 mr-2 text-luxury-gold" />
                  Status: <span className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs tracking-wider">{order.status}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <span className="text-text-light w-8">{item.quantity}x</span>
                      <span className="text-charcoal font-medium">Product ID: {item.productId.substring(0, 8)}</span>
                    </div>
                    <span className="text-text-light">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
