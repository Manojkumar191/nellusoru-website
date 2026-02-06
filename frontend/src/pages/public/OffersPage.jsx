import { useState, useEffect } from 'react';
import { FiTag, FiCalendar, FiPercent } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { offerService } from '../../services/api';
import { openWhatsApp, formatDate } from '../../utils/helpers';

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await offerService.getActive();
        setOffers(response.data);
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent-600 to-accent-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-6">
              <FiTag className="mr-2" />
              Special Offers & Announcements
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Current Offers</h1>
            <p className="text-xl text-accent-100">
              Take advantage of our latest deals and discounts
            </p>
          </div>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
                  <div className="h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🏷️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Offers</h3>
              <p className="text-gray-500 mb-6">
                Check back soon for exciting offers and announcements!
              </p>
              <button
                onClick={() => openWhatsApp('Hi, I would like to know about any upcoming offers.')}
                className="btn btn-whatsapp"
              >
                <FaWhatsapp className="mr-2" />
                Ask About Offers
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {offers.map((offer) => (
                <div key={offer.id} className="card overflow-hidden group hover:shadow-xl transition-shadow">
                  {/* Offer Image or Gradient */}
                  {offer.image_url ? (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={offer.image_url}
                        alt={offer.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
                      {offer.discount_percent ? (
                        <div className="text-center text-white">
                          <span className="text-6xl font-bold">{offer.discount_percent}%</span>
                          <p className="text-xl">OFF</p>
                        </div>
                      ) : (
                        <FiTag className="w-20 h-20 text-white/50" />
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Discount Badge */}
                    {offer.discount_percent && (
                      <span className="inline-flex items-center px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-semibold mb-3">
                        <FiPercent className="mr-1" />
                        {offer.discount_percent}% Discount
                      </span>
                    )}

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{offer.title}</h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-4">{offer.description}</p>

                    {/* Validity */}
                    {(offer.start_date || offer.end_date) && (
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <FiCalendar className="mr-2" />
                        {offer.start_date && offer.end_date ? (
                          <span>Valid: {formatDate(offer.start_date)} - {formatDate(offer.end_date)}</span>
                        ) : offer.end_date ? (
                          <span>Valid until: {formatDate(offer.end_date)}</span>
                        ) : (
                          <span>Starts: {formatDate(offer.start_date)}</span>
                        )}
                      </div>
                    )}

                    {/* CTA */}
                    <button
                      onClick={() => openWhatsApp(`Hi, I'm interested in the offer: ${offer.title}`)}
                      className="btn btn-whatsapp w-full"
                    >
                      <FaWhatsapp className="mr-2" />
                      Claim This Offer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary-800 to-primary-900 rounded-3xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Don't Miss Out!</h2>
            <p className="text-xl text-primary-200 mb-8 max-w-2xl mx-auto">
              Contact us to learn about exclusive deals and bulk order discounts for your business.
            </p>
            <button
              onClick={() => openWhatsApp('Hi, I would like to know about bulk order discounts.')}
              className="btn btn-whatsapp btn-lg"
            >
              <FaWhatsapp className="mr-2" />
              Get Exclusive Deals
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OffersPage;
