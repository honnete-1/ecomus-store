import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { cart, loading, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (loading && (!cart.items || cart.items.length === 0)) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-light-gray border-t-luxury-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="inline-flex justify-center items-center w-24 h-24 bg-gray-50 rounded-full mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-medium text-charcoal mb-4">Your Cart is Empty</h2>
        <p className="text-text-light mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="inline-flex items-center bg-charcoal text-white px-8 py-3 rounded-md hover:bg-black transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold text-charcoal mb-10">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-2/3">
          <div className="border-t border-light-gray">
            {cart.items.map((item) => (
              <div key={item.id || item.variantId} className="flex py-6 border-b border-light-gray">
                {/* Note: In a real app with full populated items, you'd show the image here. Assuming API provides basic info in cart items */}
                <div className="w-24 h-32 bg-gray-100 rounded-md shrink-0 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-gray-300" />
                </div>
                
                <div className="ml-6 flex-1 flex flex-col">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-charcoal">{item.name || 'Product'}</h3>
                      {item.variantId && <p className="text-sm text-text-light mt-1">Variant ID: {item.variantId.substring(0, 8)}</p>}
                    </div>
                    <p className="text-lg font-medium text-charcoal">${(item.price || 0).toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center border border-light-gray rounded-md">
                      <button 
                        onClick={() => updateQuantity(item.id || item.variantId, Math.max(1, item.quantity - 1))}
                        className="p-2 text-text-light hover:text-charcoal transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-medium text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id || item.variantId, item.quantity + 1)}
                        className="p-2 text-text-light hover:text-charcoal transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id || item.variantId)}
                      className="text-text-light hover:text-red-500 transition-colors flex items-center text-sm"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-full lg:w-1/3">
          <div className="bg-gray-50 rounded-lg p-6 border border-light-gray">
            <h2 className="text-xl font-medium text-charcoal mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 pb-6 border-b border-light-gray">
              <div className="flex justify-between text-text-light">
                <span>Subtotal</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-text-light">
                <span>Shipping</span>
                <span>Complimentary</span>
              </div>
            </div>
            
            <div className="flex justify-between text-lg font-medium text-charcoal mb-8">
              <span>Total</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-charcoal hover:bg-black transition-colors"
            >
              Checkout <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
