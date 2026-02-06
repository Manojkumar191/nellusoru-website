import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { openWhatsApp } from '../../utils/helpers';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Offers', path: '/offers' },
    { name: 'Contact', path: '/contact' },
  ];

  const categories = [
    { name: 'Manufacturing Supplies', path: '/products?category=manufacturing-supplies' },
    { name: 'Service Tools', path: '/products?category=service-tools' },
    { name: 'Industrial Components', path: '/products?category=industrial-components' },
    { name: 'Custom Orders', path: '/products?category=custom-orders' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Nellusoru</h3>
                <p className="text-sm text-gray-400">Manufacturers & Services</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Quality manufacturing and reliable services since 2023. Building long-term relationships through customer-centric approach and top-notch quality.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <FaFacebook />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <FaInstagram />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <FaLinkedin />
              </a>
              <button 
                onClick={() => openWhatsApp('Hi, I would like to know more about your services.')}
                className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <FaWhatsapp />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="hover:text-primary-400 transition-colors flex items-center"
                  >
                    <span className="mr-2">›</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Categories</h4>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.path}>
                  <Link 
                    to={category.path}
                    className="hover:text-primary-400 transition-colors flex items-center"
                  >
                    <span className="mr-2">›</span>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FiMapPin className="w-5 h-5 mt-1 mr-3 text-primary-500 flex-shrink-0" />
                <span>Near Karur Road, Kadavur,<br />Karur, Tamil Nadu - 621313</span>
              </li>
              <li>
                <a href="tel:+919876543210" className="flex items-center hover:text-primary-400 transition-colors">
                  <FiPhone className="w-5 h-5 mr-3 text-primary-500" />
                  +91 98765 43210
                </a>
              </li>
              <li>
                <a href="mailto:info@nellusoru.com" className="flex items-center hover:text-primary-400 transition-colors">
                  <FiMail className="w-5 h-5 mr-3 text-primary-500" />
                  info@nellusoru.com
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <button
                onClick={() => openWhatsApp('Hi, I want to enquire about your products.')}
                className="btn btn-whatsapp w-full"
              >
                <FaWhatsapp className="mr-2" />
                Chat on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} Nellusoru Manufacturers and Services. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <span className="text-accent-500 font-medium">Est. 2023</span>
              <span className="text-gray-600">|</span>
              <span className="text-gray-500">Kadavur, Karur</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
