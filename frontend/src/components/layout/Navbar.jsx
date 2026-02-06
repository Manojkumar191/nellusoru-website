import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiPhone, FiMail, FiUser } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { openWhatsApp } from '../../utils/helpers';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Offers', path: '/offers' },
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary-900 text-white py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <a href="tel:+919876543210" className="flex items-center hover:text-primary-300 transition-colors">
              <FiPhone className="mr-2" />
              +91 98765 43210
            </a>
            <a href="mailto:info@nellusoru.com" className="flex items-center hover:text-primary-300 transition-colors">
              <FiMail className="mr-2" />
              info@nellusoru.com
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-primary-300">📍 Kadavur, Karur, Tamil Nadu</span>
            <span className="text-accent-400 font-medium">Since 2023</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Nellusoru</h1>
                <p className="text-xs text-gray-500">Manufacturers & Services</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium transition-colors relative py-2 ${
                    isActive(link.path)
                      ? 'text-primary-600'
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={() => openWhatsApp('Hi, I would like to enquire about your products and services.')}
                className="btn btn-whatsapp btn-sm"
              >
                <FaWhatsapp className="mr-2 text-lg" />
                WhatsApp
              </button>
              <Link to="/contact" className="btn btn-primary btn-sm">
                Get Quote
              </Link>
              <Link to="/admin/login" className="btn btn-sm bg-gray-800 text-white hover:bg-gray-900">
                <FiUser className="mr-2" />
                Admin
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t animate-slide-down">
            <div className="container mx-auto px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block py-3 px-4 rounded-lg font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t space-y-3">
                <button
                  onClick={() => openWhatsApp('Hi, I would like to enquire about your products and services.')}
                  className="w-full btn btn-whatsapp"
                >
                  <FaWhatsapp className="mr-2 text-lg" />
                  WhatsApp Us
                </button>
                <Link to="/contact" className="w-full btn btn-primary block text-center">
                  Get Quote
                </Link>
                <Link to="/admin/login" className="w-full btn bg-gray-800 text-white hover:bg-gray-900 block text-center">
                  <FiUser className="inline mr-2" />
                  Admin Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
