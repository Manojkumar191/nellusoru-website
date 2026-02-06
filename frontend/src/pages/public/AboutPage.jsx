import { FiCheck, FiAward, FiUsers, FiTarget, FiHeart, FiMapPin, FiPhone } from 'react-icons/fi';
import { FaWhatsapp, FaIndustry, FaHandshake } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { openWhatsApp } from '../../utils/helpers';

const AboutPage = () => {
  const values = [
    {
      icon: <FiAward className="w-8 h-8" />,
      title: 'Quality Excellence',
      description: 'We maintain the highest standards in manufacturing, ensuring every product meets rigorous quality requirements.'
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: 'Customer First',
      description: 'Our business is built on customer satisfaction. We go above and beyond to meet and exceed expectations.'
    },
    {
      icon: <FaHandshake className="w-8 h-8" />,
      title: 'Long-term Relationships',
      description: 'We believe in building lasting partnerships with our clients through trust, reliability, and consistency.'
    },
    {
      icon: <FiTarget className="w-8 h-8" />,
      title: 'Precision & Accuracy',
      description: 'Every product is manufactured with precision, meeting exact specifications and industry standards.'
    }
  ];

  const milestones = [
    { year: '2023', title: 'Company Founded', description: 'Nellusoru Manufacturers and Services was established in Kadavur, Karur.' },
    { year: '2023', title: 'First Major Client', description: 'Secured our first major B2B partnership in the region.' },
    { year: '2024', title: 'Product Expansion', description: 'Expanded our product range to include custom manufacturing solutions.' },
    { year: '2025', title: 'Growing Strong', description: 'Continuing to serve customers with quality and dedication.' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Nellusoru Manufacturers and Services is your trusted partner for quality manufacturing 
              and reliable services in Kadavur, Karur, Tamil Nadu.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
                <FaIndustry className="mr-2" />
                Since 2023
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Building Trust Through Quality Manufacturing
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Nellusoru Manufacturers and Services in Kadavur, Karur is known for satisfactorily 
                catering to the demands of its customer base. Since its establishment in 2023, 
                the business has focused on customer centricity, long-term relationships, and 
                delivering top-notch quality goods and services.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Located near Karur Road, our company emphasizes seamless business interactions 
                and is committed to providing manufacturing supplies, service tools, and industrial 
                components that meet the highest quality standards.
              </p>
              
              <div className="space-y-4">
                {['Quality-driven manufacturing', 'Customer-centric approach', 'B2B focused solutions', 'Trusted local presence'].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center mr-3">
                      <FiCheck className="w-4 h-4 text-accent-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600"
                  alt="Manufacturing facility"
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">N</span>
                  </div>
                  <div>
                    <p className="font-bold text-xl text-gray-900">Est. 2023</p>
                    <p className="text-gray-500">Kadavur, Karur</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Our Core Values</h2>
            <p className="section-subtitle">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card p-8 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-600">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-500">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Our Journey</h2>
            <p className="section-subtitle">
              Key milestones in our growth story
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 mb-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    {milestone.year.slice(-2)}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-full bg-primary-200 my-2"></div>
                  )}
                </div>
                <div className="card p-6 flex-1">
                  <span className="text-primary-600 font-semibold">{milestone.year}</span>
                  <h3 className="text-xl font-semibold text-gray-900 mt-1">{milestone.title}</h3>
                  <p className="text-gray-500 mt-2">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Visit Our Location</h2>
              <p className="text-gray-300 text-lg mb-8">
                We are conveniently located near Karur Road in Kadavur. 
                Feel free to visit us or contact us for any enquiries.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <FiMapPin className="w-6 h-6 mr-4 text-accent-400" />
                  <span>Near Karur Road, Kadavur, Karur, Tamil Nadu - 621313</span>
                </div>
                <div className="flex items-center">
                  <FiPhone className="w-6 h-6 mr-4 text-accent-400" />
                  <span>+91 98765 43210</span>
                </div>
              </div>
              
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => openWhatsApp('Hi, I would like to know more about Nellusoru Manufacturers.')}
                  className="btn btn-whatsapp btn-lg"
                >
                  <FaWhatsapp className="mr-2" />
                  WhatsApp Us
                </button>
                <Link to="/contact" className="btn btn-lg bg-white text-gray-900 hover:bg-gray-100">
                  Contact Form
                </Link>
              </div>
            </div>
            
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31288.69066456899!2d77.93!3d10.62!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba9dc12c76a5c9f%3A0x8b0a21d0c2a8b9b0!2sKadavur%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1640000000000!5m2!1sen!2sin"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Nellusoru Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
