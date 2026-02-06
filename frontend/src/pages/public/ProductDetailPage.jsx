import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiPackage, FiTag } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { productService } from '../../services/api';
import { openWhatsApp, formatCurrency } from '../../utils/helpers';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await productService.getBySlug(slug);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
          <Link to="/products" className="btn btn-primary">
            <FiArrowLeft className="mr-2" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary-600">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/products" className="text-gray-500 hover:text-primary-600">Products</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Image */}
              <div className="bg-gray-100 p-8 flex items-center justify-center">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="max-w-full max-h-96 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center text-gray-400">
                    <FiPackage size={120} />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-8 lg:p-12">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.is_featured && (
                    <span className="bg-accent-100 text-accent-700 text-xs font-semibold px-3 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                  {product.category_name && (
                    <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {product.category_name}
                    </span>
                  )}
                </div>

                {/* Brand */}
                {product.brand && (
                  <p className="text-primary-600 font-medium uppercase tracking-wide text-sm mb-2">
                    {product.brand}
                  </p>
                )}

                {/* Name */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                {/* Description */}
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Specifications */}
                {product.specifications && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Specifications:</h3>
                    <p className="text-gray-600">{product.specifications}</p>
                  </div>
                )}

                {/* Price */}
                <div className="border-t border-b py-6 mb-6">
                  <div className="flex items-end justify-between">
                    {product.price ? (
                      <div>
                        <span className="text-gray-500 text-sm">Price</span>
                        <div className="flex items-baseline">
                          <span className="text-4xl font-bold text-gray-900">
                            {formatCurrency(product.price)}
                          </span>
                          {product.unit && (
                            <span className="text-gray-500 ml-2">/ {product.unit}</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span className="text-gray-500 text-sm">Price</span>
                        <p className="text-2xl font-semibold text-primary-600">Contact for Price</p>
                      </div>
                    )}
                    
                    {product.min_order_quantity > 1 && (
                      <div className="text-right">
                        <span className="text-gray-500 text-sm">Min. Order</span>
                        <p className="font-semibold text-gray-900">
                          {product.min_order_quantity} {product.unit || 'units'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center text-gray-600">
                      <FiCheck className="w-5 h-5 text-accent-500 mr-2" />
                      Quality Assured
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiCheck className="w-5 h-5 text-accent-500 mr-2" />
                      B2B Pricing
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiCheck className="w-5 h-5 text-accent-500 mr-2" />
                      Bulk Orders
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiCheck className="w-5 h-5 text-accent-500 mr-2" />
                      Cash Accepted
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => openWhatsApp('', product.name)}
                    className="btn btn-whatsapp btn-lg flex-1"
                  >
                    <FaWhatsapp className="mr-2 text-xl" />
                    Enquire on WhatsApp
                  </button>
                  <Link to="/contact" className="btn btn-secondary btn-lg">
                    Contact Form
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Products */}
          <div className="mt-8">
            <Link to="/products" className="btn btn-secondary">
              <FiArrowLeft className="mr-2" />
              Back to Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;
