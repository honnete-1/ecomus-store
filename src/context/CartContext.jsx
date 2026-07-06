import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [], total: 0 });
      return;
    }
    
    try {
      setLoading(true);
      const response = await axiosClient.get('/api/auth/cart');
      if (response.data) {
        // Handle different possible response structures based on typical Swagger returns
        const cartData = response.data.data || response.data;
        setCart({
          items: cartData.items || [],
          total: cartData.total || 0,
          id: cartData.id
        });
      }
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
    
    // Listen to custom event for cross-component cart updates (e.g. from ProductDetails)
    const handleCartUpdate = () => fetchCart();
    window.addEventListener('cart:updated', handleCartUpdate);
    
    return () => window.removeEventListener('cart:updated', handleCartUpdate);
  }, [fetchCart]);

  const updateQuantity = async (itemId, quantity) => {
    try {
      await axiosClient.patch(`/api/auth/cart/items/${itemId}`, { quantity });
      await fetchCart();
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axiosClient.delete(`/api/auth/cart/items/${itemId}`);
      await fetchCart();
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };

  const clearCart = async () => {
    try {
      await axiosClient.delete('/api/auth/cart');
      await fetchCart();
    } catch (error) {
      console.error("Failed to clear cart", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
