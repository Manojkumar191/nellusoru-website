import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { openWhatsApp, formatCurrency, truncateText } from '../../utils/helpers';

const ProductCard = ({ product }) => {
  return (
    <div className="card card-hover overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-4xl">📦</span>
          </div>
        )}
        
        {/* Featured Badge */}
        {product.is_featured && (
          <span className="absolute top-3 left-3 bg-accent-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Featured
          </span>
        )}
        
        {/* Category Badge */}
        {product.category_name && (
          <span className="absolute top-3 right-3 bg-white/90 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
            {product.category_name}
          </span>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5">
        {/* Brand */}
        {product.brand && (
          <span className="text-xs font-medium text-primary-600 uppercase tracking-wide">
            {product.brand}
          </span>
        )}
        
        {/* Name */}
        <h3 className="text-lg font-semibold text-gray-900 mt-1 mb-2 line-clamp-2">
          <Link 
            to={`/products/${product.slug}`}
            className="hover:text-primary-600 transition-colors"
          >
            {product.name}
          </Link>
        </h3>
        
        {/* Description */}
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {truncateText(product.description, 80)}
        </p>
        
        {/* Price & Unit */}
        <div className="flex items-end justify-between mb-4">
          {product.price ? (
            <div>
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(product.price)}
              </span>
              {product.unit && (
                <span className="text-gray-500 text-sm ml-1">
                  / {product.unit}
                </span>
              )}
            </div>
          ) : (
            <span className="text-lg font-medium text-primary-600">
              Contact for Price
            </span>
          )}
          
          {product.min_order_quantity > 1 && (
            <span className="text-xs text-gray-500">
              Min: {product.min_order_quantity} {product.unit || 'units'}
            </span>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => openWhatsApp('', product.name)}
            className="flex-1 btn btn-whatsapp btn-sm"
          >
            <FaWhatsapp className="mr-1" />
            Enquire
          </button>
          <Link
            to={`/products/${product.slug}`}
            className="btn btn-secondary btn-sm"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
