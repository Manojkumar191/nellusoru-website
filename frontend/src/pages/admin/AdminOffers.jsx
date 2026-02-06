import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { offerService } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/helpers';

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    min_order_amount: '',
    valid_from: '',
    valid_until: '',
    is_active: true
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await offerService.getAll();
      setOffers(response.data);
    } catch (error) {
      toast.error('Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.discount_value) {
      toast.error('Title and discount value are required');
      return;
    }

    try {
      const data = {
        ...formData,
        discount_value: parseFloat(formData.discount_value),
        min_order_amount: formData.min_order_amount ? parseFloat(formData.min_order_amount) : null,
        valid_from: formData.valid_from || null,
        valid_until: formData.valid_until || null
      };

      if (editingOffer) {
        await offerService.update(editingOffer.id, data);
        toast.success('Offer updated successfully');
      } else {
        await offerService.create(data);
        toast.success('Offer created successfully');
      }
      
      setShowModal(false);
      resetForm();
      fetchOffers();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    
    try {
      await offerService.delete(id);
      toast.success('Offer deleted successfully');
      fetchOffers();
    } catch (error) {
      toast.error('Failed to delete offer');
    }
  };

  const handleToggle = async (offer) => {
    try {
      await offerService.update(offer.id, { is_active: !offer.is_active });
      toast.success(`Offer ${offer.is_active ? 'deactivated' : 'activated'}`);
      fetchOffers();
    } catch (error) {
      toast.error('Failed to update offer');
    }
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description || '',
      discount_type: offer.discount_type,
      discount_value: offer.discount_value,
      min_order_amount: offer.min_order_amount || '',
      valid_from: offer.valid_from ? offer.valid_from.split('T')[0] : '',
      valid_until: offer.valid_until ? offer.valid_until.split('T')[0] : '',
      is_active: offer.is_active
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingOffer(null);
    setFormData({
      title: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      min_order_amount: '',
      valid_from: '',
      valid_until: '',
      is_active: true
    });
  };

  const getDiscountDisplay = (offer) => {
    if (offer.discount_type === 'percentage') {
      return `${offer.discount_value}% OFF`;
    }
    return `${formatCurrency(offer.discount_value)} OFF`;
  };

  const isOfferValid = (offer) => {
    const now = new Date();
    const from = offer.valid_from ? new Date(offer.valid_from) : null;
    const until = offer.valid_until ? new Date(offer.valid_until) : null;
    
    if (from && now < from) return false;
    if (until && now > until) return false;
    return offer.is_active;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Offers & Discounts</h1>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="btn btn-primary"
        >
          <FiPlus className="mr-2" />
          Create Offer
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))
        ) : offers.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-8 text-center text-gray-500">
            No offers found. Create your first offer!
          </div>
        ) : (
          offers.map((offer) => (
            <div 
              key={offer.id} 
              className={`bg-white rounded-xl shadow-sm overflow-hidden border-2 ${
                isOfferValid(offer) ? 'border-green-200' : 'border-gray-100'
              }`}
            >
              {/* Discount Badge */}
              <div className={`px-6 py-4 ${isOfferValid(offer) ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-400'}`}>
                <p className="text-white font-bold text-2xl">{getDiscountDisplay(offer)}</p>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{offer.title}</h3>
                  <button
                    onClick={() => handleToggle(offer)}
                    className={`p-1 rounded ${offer.is_active ? 'text-green-600' : 'text-gray-400'}`}
                    title={offer.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {offer.is_active ? <FiToggleRight size={28} /> : <FiToggleLeft size={28} />}
                  </button>
                </div>

                {offer.description && (
                  <p className="text-gray-600 text-sm mb-4">{offer.description}</p>
                )}

                <div className="space-y-2 text-sm">
                  {offer.min_order_amount && (
                    <p className="text-gray-500">
                      Min. Order: <span className="font-medium">{formatCurrency(offer.min_order_amount)}</span>
                    </p>
                  )}
                  {offer.valid_from && (
                    <p className="text-gray-500">
                      From: <span className="font-medium">{formatDate(offer.valid_from)}</span>
                    </p>
                  )}
                  {offer.valid_until && (
                    <p className="text-gray-500">
                      Until: <span className="font-medium">{formatDate(offer.valid_until)}</span>
                    </p>
                  )}
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <button
                    onClick={() => handleEdit(offer)}
                    className="btn btn-secondary btn-sm flex-1"
                  >
                    <FiEdit2 className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(offer.id)}
                    className="btn btn-sm bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">
                {editingOffer ? 'Edit Offer' : 'Create Offer'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="label">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="input"
                  placeholder="e.g., Summer Sale"
                  required
                />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="input"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Discount Type</label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({...formData, discount_type: e.target.value})}
                    className="input"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="label">Discount Value *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({...formData, discount_value: e.target.value})}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Minimum Order Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.min_order_amount}
                  onChange={(e) => setFormData({...formData, min_order_amount: e.target.value})}
                  className="input"
                  placeholder="Optional"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Valid From</label>
                  <input
                    type="date"
                    value={formData.valid_from}
                    onChange={(e) => setFormData({...formData, valid_from: e.target.value})}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Valid Until</label>
                  <input
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({...formData, valid_until: e.target.value})}
                    className="input"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="w-5 h-5 rounded text-primary-600"
                />
                <span>Active</span>
              </label>

              <div className="flex gap-4 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  {editingOffer ? 'Update Offer' : 'Create Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOffers;
