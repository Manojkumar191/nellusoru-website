import { useState } from 'react';
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { enquiryService } from '../../services/api';
import { openWhatsApp, isValidEmail, isValidPhone } from '../../utils/helpers';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }
    if (!isValidPhone(formData.phone)) {
      toast.error('Please enter a valid phone number');
      return;
    }
    if (formData.email && !isValidEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!formData.message.trim()) {
      toast.error('Please enter your message');
      return;
    }

    setLoading(true);
    try {
      await enquiryService.create(formData);
      toast.success('Your enquiry has been submitted successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      toast.error('Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <FiMapPin className="w-6 h-6" />,
      title: 'Visit Us',
      content: 'Near Karur Road, Kadavur, Karur, Tamil Nadu - 621313',
      link: null
    },
    {
      icon: <FiPhone className="w-6 h-6" />,
      title: 'Call Us',
      content: '+91 98765 43210',
      link: 'tel:+919876543210'
    },
    {
      icon: <FiMail className="w-6 h-6" />,
      title: 'Email Us',
      content: 'info@nellusoru.com',
      link: 'mailto:info@nellusoru.com'
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      title: 'Business Hours',
      content: 'Mon - Sat: 9:00 AM - 7:00 PM',
      link: null
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-gray-300">
              Get in touch with us for enquiries, quotes, or any questions
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => (
              <div key={index} className="card p-6 text-center">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary-600">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                {item.link ? (
                  <a href={item.link} className="text-gray-600 hover:text-primary-600 transition-colors">
                    {item.content}
                  </a>
                ) : (
                  <p className="text-gray-600">{item.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input"
                      placeholder="Your phone number"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input"
                      placeholder="Your email"
                    />
                  </div>
                  <div>
                    <label className="label">Company Name</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="input"
                      placeholder="Your company"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="input"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div>
                  <label className="label">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="input resize-none"
                    placeholder="Tell us about your requirements..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg w-full disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </span>
                  ) : (
                    <>
                      <FiSend className="mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-gray-600 mb-4">Or reach us directly via WhatsApp</p>
                <button
                  onClick={() => openWhatsApp('Hi, I would like to make an enquiry.')}
                  className="btn btn-whatsapp btn-lg"
                >
                  <FaWhatsapp className="mr-2" />
                  Chat on WhatsApp
                </button>
              </div>
            </div>

            {/* Map */}
            <div>
              <div className="card overflow-hidden h-full min-h-[500px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31288.69066456899!2d77.93!3d10.62!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba9dc12c76a5c9f%3A0x8b0a21d0c2a8b9b0!2sKadavur%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1640000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '500px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Nellusoru Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gray-900 rounded-3xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Need Immediate Assistance?</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Our team is ready to help you with any enquiries about our products and services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+919876543210" className="btn btn-lg bg-white text-gray-900 hover:bg-gray-100">
                <FiPhone className="mr-2" />
                Call Now
              </a>
              <button
                onClick={() => openWhatsApp('Hi, I need immediate assistance.')}
                className="btn btn-whatsapp btn-lg"
              >
                <FaWhatsapp className="mr-2" />
                WhatsApp Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
