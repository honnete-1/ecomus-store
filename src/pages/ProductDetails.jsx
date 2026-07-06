import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { ArrowLeft, ShoppingBag, Check } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/api/public/products/${id}`);
        if (response.data.success) {
          const prodData = response.data.data.product;
          setProduct(prodData);
          if (prodData.variants && prodData.variants.length > 0) {
            setSelectedVariant(prodData.variants[0]);
          }
        } else {
          setError('Failed to load product details.');
        }
      } catch (err) {
        setError('Product not found or server error.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    
    setIsAdding(true);
    try {
      const response = await axiosClient.post('/api/auth/cart/items', {
        productId: product.id,
        variantId: selectedVariant.id,
        quantity: 1
      });
      
      if (response.status === 200) {
        setAddSuccess(true);
        // I dispatch a custom event here so the cart badge could update
        window.dispatchEvent(new Event('cart:updated'));
        setTimeout(() => setAddSuccess(false), 3000);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert("Please log in to add items to your cart.");
      } else {
        alert("Failed to add to cart.");
      }
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 animate-pulse">
        <div className="h-8 bg-light-gray rounded w-32 mb-8"></div>
        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2 bg-light-gray aspect-[4/5] rounded-lg"></div>
          <div className="w-full md:w-1/2 space-y-6">
            <div className="h-10 bg-light-gray rounded w-3/4"></div>
            <div className="h-6 bg-light-gray rounded w-1/4"></div>
            <div className="h-32 bg-light-gray rounded w-full mt-8"></div>
            <div className="h-12 bg-light-gray rounded w-full mt-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-medium text-charcoal mb-4">Product Not Found</h2>
        <p className="text-text-light mb-8">{error}</p>
        <Link to="/products" className="inline-flex items-center text-luxury-gold hover:text-yellow-600 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Collection
        </Link>
      </div>
    );
  }

  const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/600x800?text=No+Image';

  return (
    <div className="py-8">
      <Link to="/products" className="inline-flex items-center text-text-light hover:text-charcoal mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Collection
      </Link>
      
      <div className="flex flex-col md:flex-row gap-12">
        {/* Images */}
        <div className="w-full md:w-1/2">
          <div className="bg-light-gray rounded-lg overflow-hidden aspect-[4/5]">
            <img 
              src={imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Details */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="mb-2 text-sm text-text-light uppercase tracking-widest">{product.brand}</div>
          <h1 className="text-4xl font-medium text-charcoal mb-4">{product.name}</h1>
          <div className="text-2xl text-charcoal mb-8">${product.price.toFixed(2)}</div>
          
          <div className="prose prose-sm text-text-light mb-10">
            <p>{product.description}</p>
          </div>

          {product.variants && product.variants.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-charcoal uppercase tracking-wider mb-3">Select Variant</h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`py-2 px-4 border rounded-md text-sm transition-colors ${
                      selectedVariant?.id === variant.id 
                        ? 'border-charcoal bg-charcoal text-white' 
                        : 'border-light-gray text-charcoal hover:border-gray-400'
                    }`}
                  >
                    {variant.color} - {variant.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto pt-8 border-t border-light-gray">
            <button
              onClick={handleAddToCart}
              disabled={isAdding || product.stock <= 0}
              className={`w-full flex justify-center items-center py-4 px-8 rounded-md text-lg font-medium transition-colors ${
                product.stock <= 0 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : addSuccess 
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-charcoal text-white hover:bg-black'
              }`}
            >
              {isAdding ? (
                <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : product.stock <= 0 ? (
                'Out of Stock'
              ) : addSuccess ? (
                <>
                  <Check className="w-5 h-5 mr-2" /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5 mr-2" /> Add to Cart
                </>
              )}
            </button>
            <p className="text-center text-sm text-text-light mt-4">
              Free shipping and returns on all orders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
