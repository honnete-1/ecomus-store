import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import CategoryFilter from '../components/CategoryFilter';
import { Search } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = '/api/public/products';
        if (selectedCategoryId) {
          url = `/api/public/products/category/${selectedCategoryId}`;
        }
        
        const response = await axiosClient.get(url);
        if (response.data.success) {
          if (selectedCategoryId) {
            // Category endpoint returns an array in data
            setProducts(response.data.data || []);
          } else {
            // All endpoint returns data.all
            setProducts(response.data.data.all || []);
          }
        } else {
          setError('Failed to load products.');
        }
      } catch (err) {
        setError('Error connecting to the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategoryId]);

  // I implement client-side filtering for search since a specific search endpoint wasn't discovered
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-semibold text-charcoal">The Collection</h2>
          <p className="text-text-light mt-2">Discover our carefully curated selection of luxury items.</p>
        </div>
        
        <div className="w-full md:w-72 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-light-gray rounded-md shadow-sm focus:ring-luxury-gold focus:border-luxury-gold sm:text-sm bg-white text-charcoal"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-10">
        <CategoryFilter 
          selectedCategoryId={selectedCategoryId} 
          onCategorySelect={setSelectedCategoryId} 
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-8">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-light-gray flex flex-col items-center">
          <Search className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-charcoal mb-2">No products found</h3>
          <p className="text-text-light">We couldn't find anything matching "{searchQuery}"</p>
          <button 
            onClick={() => setSearchQuery('')}
            className="mt-6 text-luxury-gold hover:text-yellow-600 font-medium"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
