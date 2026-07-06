import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const CategoryFilter = ({ selectedCategoryId, onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosClient.get('/api/categories');
        if (response.data && Array.isArray(response.data)) {
          setCategories(response.data);
        } else if (response.data && response.data.data) {
          // If wrapped in success data object
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 w-24 bg-light-gray rounded-full shrink-0"></div>
        ))}
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
      <button
        onClick={() => onCategorySelect(null)}
        className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
          selectedCategoryId === null
            ? 'bg-charcoal text-white'
            : 'bg-white border border-light-gray text-charcoal hover:border-charcoal'
        }`}
      >
        All Products
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedCategoryId === category.id
              ? 'bg-charcoal text-white'
              : 'bg-white border border-light-gray text-charcoal hover:border-charcoal'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
