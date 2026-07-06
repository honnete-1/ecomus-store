import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axiosClient from '../api/axiosClient';
import { CheckCircle, ArrowLeft } from 'lucide-react';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setError('');
    
    try {
      const response = await axiosClient.post('/api/auth/orders');
      if (response.status === 201) {
        setOrderSuccess(true);
        // I wait to let the success screen render, then clear cart and wait
        clearCart();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="py-20 text-center max-w-lg mx-auto">
        <div className="inline-flex justify-center items-center w-24 h-24 bg-green-50 rounded-full mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-3xl font-medium text-charcoal mb-4">Order Confirmed</h2>
        <p className="text-text-light mb-8">Thank you for your purchase. We will email you with your tracking information shortly.</p>
        <button 
          onClick={() => navigate('/orders')}
          className="bg-charcoal text-white px-8 py-3 rounded-md hover:bg-black transition-colors"
        >
          View Orders
        </button>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-medium text-charcoal mb-4">Your Cart is Empty</h2>
        <button onClick={() => navigate('/products')} className="text-luxury-gold">Return to Shop</button>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-3xl mx-auto">
      <button onClick={() => navigate('/cart')} className="inline-flex items-center text-text-light hover:text-charcoal mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
      </button>

      <h1 className="text-3xl font-semibold text-charcoal mb-8">Checkout</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-8 text-sm">
          {error}
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-8 border border-light-gray mb-8">
        <h2 className="text-xl font-medium text-charcoal mb-6">Order Summary</h2>
        <div className="space-y-4 mb-6">
          {cart.items.map((item) => (
            <div key={item.id || item.variantId} className="flex justify-between text-sm">
              <span className="text-charcoal">{item.quantity}x {item.name || 'Product'}</span>
              <span className="text-charcoal">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        <div className="border-t border-light-gray pt-6 mb-8">
          <div className="flex justify-between text-lg font-medium text-charcoal">
            <span>Total</span>
            <span>${cart.total.toFixed(2)}</span>
          </div>
        </div>

        <button 
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-charcoal hover:bg-black transition-colors disabled:opacity-70"
        >
          {isProcessing ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            `Pay $${cart.total.toFixed(2)}`
          )}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
