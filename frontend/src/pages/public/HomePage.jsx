import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiPhone, FiMapPin, FiAward, FiUsers, FiTruck, FiShield } from 'react-icons/fi';
import { FaWhatsapp, FaIndustry, FaHandshake, FaCogs } from 'react-icons/fa';
import { productService, offerService, categoryService } from '../../services/api';
import { openWhatsApp, formatCurrency } from '../../utils/helpers';
import ProductCard from '../../components/common/ProductCard';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, offersRes] = await Promise.all([
          productService.getFeatured(),
          categoryService.getAll({ active_only: true }),
          offerService.getActive()
        ]);
        setFeaturedProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setOffers(offersRes.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const whyChooseUs = [
    {
      icon: <FiAward className="w-8 h-8" />,
      title: 'Quality Assured',
      description: 'Top-notch quality goods and services with strict quality control measures.'
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: 'Customer-Centric',
      description: 'We prioritize customer satisfaction and build long-term relationships.'
    },
    {
      icon: <FiTruck className="w-8 h-8" />,
      title: 'Reliable Delivery',
      description: 'Timely delivery and seamless business transactions every time.'
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: 'Trusted Since 2023',
      description: 'Established reputation in Kadavur, Karur for quality manufacturing.'
    }
  ];

  const stats = [
    { number: '100+', label: 'Products', icon: <FaCogs /> },
    { number: '50+', label: 'Happy Customers', icon: <FaHandshake /> },
    { number: '2023', label: 'Established', icon: <FaIndustry /> },
    { number: '24/7', label: 'Support', icon: <FiPhone /> }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-6">
                <span className="w-2 h-2 bg-accent-400 rounded-full mr-2 animate-pulse"></span>
                Trusted Manufacturing Partner Since 2023
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Nellusoru <br />
                <span className="text-accent-400">Manufacturers</span> <br />
                and Services
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-lg">
                Quality manufacturing and reliable services in Kadavur, Karur. Building long-term relationships through customer-centric approach and top-notch quality.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => openWhatsApp('Hi, I would like to enquire about your products and services.')}
                  className="btn btn-whatsapp btn-lg"
                >
                  <FaWhatsapp className="mr-2 text-xl" />
                  Contact Us
                </button>
                <Link to="/products" className="btn btn-secondary btn-lg bg-white/10 border-white text-white hover:bg-white/20">
                  Our Products
                  <FiArrowRight className="ml-2" />
                </Link>
              </div>
              
              {/* Location Badge */}
              <div className="mt-10 flex items-center text-gray-300">
                <FiMapPin className="w-5 h-5 mr-2 text-accent-400" />
                <span>Near Karur Road, Kadavur, Karur, Tamil Nadu</span>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/30 to-accent-600/30 rounded-3xl rotate-6"></div>
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600"
                  alt="Manufacturing"
                  className="relative rounded-3xl shadow-2xl object-cover w-full h-full"
                />
                {/* Floating Card */}
                <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center">
                      <FiCheck className="w-8 h-8 text-accent-600" />
                    </div>
                    <div>
                      <p className="font-bold text-2xl">100%</p>
                      <p className="text-gray-500">Quality Assured</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-primary-600 text-3xl mb-2 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Our Categories</h2>
            <p className="section-subtitle">
              Explore our wide range of manufacturing supplies and services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                className="card card-hover p-6 text-center group"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-600 transition-colors">
                  <FaIndustry className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-500 text-sm">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="section-title mb-4">Featured Products</h2>
              <p className="text-gray-600 max-w-2xl">
                Discover our top-quality manufacturing supplies and industrial components
              </p>
            </div>
            <Link to="/products" className="btn btn-primary mt-4 md:mt-0">
              View All Products
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map((i) => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Why Choose Us</h2>
            <p className="section-subtitle">
              We are committed to providing the best manufacturing solutions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="card p-6 text-center hover:border-primary-500 border-2 border-transparent transition-colors">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary-600">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Section */}
      {offers.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Special Offers</h2>
              <p className="text-primary-200 max-w-2xl mx-auto">
                Check out our latest offers and discounts
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <div key={offer.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold">{offer.title}</h3>
                    {offer.discount_percent && (
                      <span className="bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {offer.discount_percent}% OFF
                      </span>
                    )}
                  </div>
                  <p className="text-primary-200 mb-4">{offer.description}</p>
                  <button
                    onClick={() => openWhatsApp(`Hi, I'm interested in the offer: ${offer.title}`)}
                    className="btn btn-whatsapp w-full"
                  >
                    <FaWhatsapp className="mr-2" />
                    Claim Offer
                  </button>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link to="/offers" className="btn bg-white text-primary-600 hover:bg-gray-100">
                View All Offers
                <FiArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Partner with Us?
                </h2>
                <p className="text-gray-300 text-lg mb-6">
                  Get in touch for quality manufacturing supplies and services. We're here to help your business grow.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => openWhatsApp('Hi, I would like to discuss a business partnership.')}
                    className="btn btn-whatsapp btn-lg"
                  >
                    <FaWhatsapp className="mr-2 text-xl" />
                    WhatsApp Us
                  </button>
                  <Link to="/contact" className="btn btn-lg bg-white text-gray-900 hover:bg-gray-100">
                    Contact Form
                  </Link>
                </div>
              </div>
              <div className="text-white">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FiMapPin className="w-6 h-6 mr-4 text-accent-400" />
                    <span>Near Karur Road, Kadavur, Karur, Tamil Nadu - 621313</span>
                  </div>
                  <div className="flex items-center">
                    <FiPhone className="w-6 h-6 mr-4 text-accent-400" />
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center">
                    <FaWhatsapp className="w-6 h-6 mr-4 text-accent-400" />
                    <span>WhatsApp: +91 98765 43210</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
