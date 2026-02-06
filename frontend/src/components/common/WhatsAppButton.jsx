import { FaWhatsapp } from 'react-icons/fa';
import { openWhatsApp } from '../../utils/helpers';

const WhatsAppButton = () => {
  return (
    <button
      onClick={() => openWhatsApp('Hi, I would like to enquire about your products and services.')}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="text-2xl group-hover:scale-110 transition-transform" />
      <span className="absolute right-full mr-3 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Chat with us
      </span>
    </button>
  );
};

export default WhatsAppButton;
