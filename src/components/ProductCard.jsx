import React from 'react';
import { Link } from 'react-router-dom';
import { ImageOff } from 'lucide-react';

const ProductCard = ({ product }) => {
  const imageUrl = product.images?.[0]?.url;

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="relative overflow-hidden rounded-lg mb-4 bg-light-gray aspect-[4/5] flex items-center justify-center">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={product.name} 
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <ImageOff className="w-10 h-10 mb-2 opacity-40" />
            <span className="text-[10px] font-medium uppercase tracking-widest opacity-50">No Image</span>
          </div>
        )}
        {product.stock <= 0 && (
          <div className="absolute top-4 left-4 bg-charcoal text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
            Sold Out
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <h3 className="text-charcoal font-medium text-lg truncate mb-1">{product.name}</h3>
        <p className="text-text-light text-sm mb-2">{product.brand}</p>
        <div className="flex justify-between items-center">
          <span className="text-charcoal font-semibold">${product.price.toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
