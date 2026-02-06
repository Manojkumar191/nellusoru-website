import { useState, useEffect } from 'react';
import { FiMail, FiPhone, FiMessageSquare, FiEye, FiTrash2, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { enquiryService } from '../../services/api';
import { formatDate, getStatusColor, openWhatsApp } from '../../utils/helpers';

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await enquiryService.getAll();
      setEnquiries(response.data);
    } catch (error) {
      toast.error('Failed to fetch enquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await enquiryService.updateStatus(id, status);
      toast.success('Status updated');
      fetchEnquiries();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    
    try {
      await enquiryService.delete(id);
      toast.success('Enquiry deleted');
      fetchEnquiries();
    } catch (error) {
      toast.error('Failed to delete enquiry');
    }
  };

  const handleView = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowModal(true);
    // Mark as read if new
    if (enquiry.status === 'new') {
      handleStatusUpdate(enquiry.id, 'read');
    }
  };

  const handleWhatsAppReply = (enquiry) => {
    const message = `Hello ${enquiry.name},\n\nThank you for your enquiry about "${enquiry.subject || 'our products'}".\n\nWe have received your message and will get back to you shortly.\n\nBest regards,\nNellusoru Manufacturers`;
    openWhatsApp(enquiry.phone, message);
  };

  const filteredEnquiries = enquiries.filter(e => 
    statusFilter === 'all' || e.status === statusFilter
  );

  const newCount = enquiries.filter(e => e.status === 'new').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
          {newCount > 0 && (
            <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
              {newCount} new
            </span>
          )}
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input w-full md:w-auto"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Enquiries List */}
      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))
        ) : filteredEnquiries.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500">
            No enquiries found
          </div>
        ) : (
          filteredEnquiries.map((enquiry) => (
            <div 
              key={enquiry.id} 
              className={`bg-white rounded-xl shadow-sm overflow-hidden border-l-4 ${
                enquiry.status === 'new' ? 'border-l-red-500' : 
                enquiry.status === 'read' ? 'border-l-yellow-500' :
                enquiry.status === 'replied' ? 'border-l-blue-500' : 'border-l-green-500'
              }`}
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{enquiry.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(enquiry.status)}`}>
                        {enquiry.status}
                      </span>
                    </div>
                    
                    {enquiry.subject && (
                      <p className="font-medium text-gray-700 mb-2">{enquiry.subject}</p>
                    )}
                    
                    <p className="text-gray-600 line-clamp-2">{enquiry.message}</p>
                    
                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FiPhone size={14} />
                        <span>{enquiry.phone}</span>
                      </div>
                      {enquiry.email && (
                        <div className="flex items-center gap-1">
                          <FiMail size={14} />
                          <span>{enquiry.email}</span>
                        </div>
                      )}
                      <span>{formatDate(enquiry.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleView(enquiry)}
                      className="btn btn-secondary btn-sm"
                    >
                      <FiEye className="mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => handleWhatsAppReply(enquiry)}
                      className="btn btn-primary btn-sm"
                    >
                      <FiMessageSquare className="mr-1" />
                      Reply
                    </button>
                    <button
                      onClick={() => handleDelete(enquiry.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Modal */}
      {showModal && selectedEnquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Enquiry Details</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <FiX size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="font-semibold text-lg">{selectedEnquiry.name}</p>
                </div>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) => {
                    handleStatusUpdate(selectedEnquiry.id, e.target.value);
                    setSelectedEnquiry({...selectedEnquiry, status: e.target.value});
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedEnquiry.status)}`}
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedEnquiry.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedEnquiry.email || '-'}</p>
                </div>
              </div>

              {selectedEnquiry.subject && (
                <div>
                  <p className="text-sm text-gray-500">Subject</p>
                  <p className="font-medium">{selectedEnquiry.subject}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500">Message</p>
                <p className="bg-gray-50 p-4 rounded-lg mt-2 whitespace-pre-wrap">{selectedEnquiry.message}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Received</p>
                <p className="font-medium">{formatDate(selectedEnquiry.created_at, true)}</p>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <a
                  href={`tel:${selectedEnquiry.phone}`}
                  className="btn btn-secondary flex-1"
                >
                  <FiPhone className="mr-2" />
                  Call
                </a>
                <button
                  onClick={() => {
                    handleWhatsAppReply(selectedEnquiry);
                    handleStatusUpdate(selectedEnquiry.id, 'replied');
                    setShowModal(false);
                  }}
                  className="btn btn-primary flex-1"
                >
                  <FiMessageSquare className="mr-2" />
                  Reply on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEnquiries;
