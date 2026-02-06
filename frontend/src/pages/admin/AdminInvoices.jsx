import { useState, useEffect } from 'react';
import { FiPlus, FiEye, FiDownload, FiSend, FiSearch, FiX, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { invoiceService, customerService, productService } from '../../services/api';
import { formatCurrency, formatDate, getStatusColor, openWhatsApp } from '../../utils/helpers';

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [formData, setFormData] = useState({
    customer_id: '',
    items: [{ product_id: '', quantity: 1, unit_price: 0, discount: 0 }],
    tax_percentage: 18,
    discount_amount: 0,
    notes: '',
    status: 'draft'
  });

  useEffect(() => {
    fetchInvoices();
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await invoiceService.getAll();
      setInvoices(response.data);
    } catch (error) {
      toast.error('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customerService.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to fetch customers');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productService.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products');
    }
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => {
      return sum + (item.quantity * item.unit_price - item.discount);
    }, 0);
    const taxAmount = (subtotal - formData.discount_amount) * (formData.tax_percentage / 100);
    const total = subtotal - formData.discount_amount + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validItems = formData.items.filter(item => item.product_id && item.quantity > 0);
    if (validItems.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    try {
      const { total } = calculateTotals();
      const data = {
        customer_id: formData.customer_id || null,
        items: validItems.map(item => ({
          product_id: item.product_id,
          quantity: parseInt(item.quantity),
          unit_price: parseFloat(item.unit_price),
          discount: parseFloat(item.discount) || 0
        })),
        tax_percentage: parseFloat(formData.tax_percentage) || 0,
        discount_amount: parseFloat(formData.discount_amount) || 0,
        total_amount: total,
        notes: formData.notes,
        status: formData.status
      };

      await invoiceService.create(data);
      toast.success('Invoice created successfully');
      setShowModal(false);
      resetForm();
      fetchInvoices();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    
    try {
      await invoiceService.delete(id);
      toast.success('Invoice deleted successfully');
      fetchInvoices();
    } catch (error) {
      toast.error('Failed to delete invoice');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await invoiceService.updateStatus(id, status);
      toast.success('Invoice status updated');
      fetchInvoices();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDownloadPDF = async (invoice) => {
    try {
      const response = await invoiceService.downloadPDF(invoice.id);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoice.invoice_number}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to download PDF');
    }
  };

  const handleSendWhatsApp = (invoice) => {
    const customer = customers.find(c => c.id === invoice.customer_id);
    if (!customer?.phone) {
      toast.error('Customer phone number not available');
      return;
    }
    
    const message = `Hello ${customer.contact_person},\n\nYour invoice ${invoice.invoice_number} for ${formatCurrency(invoice.total_amount)} is ready.\n\nThank you for your business!\n- Nellusoru Manufacturers`;
    openWhatsApp(customer.phone, message);
  };

  const handleViewInvoice = async (id) => {
    try {
      const response = await invoiceService.getById(id);
      setSelectedInvoice(response.data);
      setShowViewModal(true);
    } catch (error) {
      toast.error('Failed to fetch invoice details');
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product_id: '', quantity: 1, unit_price: 0, discount: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems.length ? newItems : [{ product_id: '', quantity: 1, unit_price: 0, discount: 0 }] });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    // Auto-fill price when product is selected
    if (field === 'product_id') {
      const product = products.find(p => p.id === value);
      if (product?.price) {
        newItems[index].unit_price = product.price;
      }
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const resetForm = () => {
    setFormData({
      customer_id: '',
      items: [{ product_id: '', quantity: 1, unit_price: 0, discount: 0 }],
      tax_percentage: 18,
      discount_amount: 0,
      notes: '',
      status: 'draft'
    });
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer_name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const { subtotal, taxAmount, total } = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10 w-full md:w-48"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-full md:w-auto"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="btn btn-primary whitespace-nowrap"
          >
            <FiPlus className="mr-2" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Invoice #</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Customer</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Date</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Amount</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No invoices found</td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{invoice.invoice_number}</td>
                    <td className="px-6 py-4 text-gray-600">{invoice.customer_name || 'Walk-in'}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(invoice.created_at)}</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">
                      {formatCurrency(invoice.total_amount)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select
                        value={invoice.status}
                        onChange={(e) => handleStatusUpdate(invoice.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs border-0 cursor-pointer ${getStatusColor(invoice.status)}`}
                      >
                        <option value="draft">Draft</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleViewInvoice(invoice.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                          title="View"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(invoice)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                          title="Download PDF"
                        >
                          <FiDownload size={18} />
                        </button>
                        <button
                          onClick={() => handleSendWhatsApp(invoice)}
                          className="p-2 hover:bg-green-50 rounded-lg text-green-600"
                          title="Send via WhatsApp"
                        >
                          <FiSend size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(invoice.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">Create Invoice</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Customer & Status */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Customer</label>
                  <select
                    value={formData.customer_id}
                    onChange={(e) => setFormData({...formData, customer_id: e.target.value})}
                    className="input"
                  >
                    <option value="">Walk-in Customer</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.contact_person} {c.company_name ? `(${c.company_name})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="input"
                  >
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="font-medium text-gray-900">Invoice Items</label>
                  <button type="button" onClick={addItem} className="btn btn-secondary btn-sm">
                    <FiPlus className="mr-1" /> Add Item
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-5">
                        <label className="text-xs text-gray-500">Product</label>
                        <select
                          value={item.product_id}
                          onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                          className="input"
                        >
                          <option value="">Select Product</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs text-gray-500">Qty</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                          className="input"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs text-gray-500">Price</label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.unit_price}
                          onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                          className="input"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs text-gray-500">Discount</label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.discount}
                          onChange={(e) => updateItem(index, 'discount', e.target.value)}
                          className="input"
                        />
                      </div>
                      <div className="col-span-1">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="btn btn-sm bg-red-50 text-red-600 hover:bg-red-100 w-full"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="label">Tax Percentage (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.tax_percentage}
                      onChange={(e) => setFormData({...formData, tax_percentage: e.target.value})}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Discount Amount (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.discount_amount}
                      onChange={(e) => setFormData({...formData, discount_amount: e.target.value})}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="input"
                      rows={2}
                    />
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-red-600">-{formatCurrency(formData.discount_amount || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax ({formData.tax_percentage}%)</span>
                    <span className="font-medium">{formatCurrency(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t text-lg">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-primary-600">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Invoice Modal */}
      {showViewModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">Invoice {selectedInvoice.invoice_number}</h2>
              <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <FiX size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500">Customer</p>
                  <p className="font-medium">{selectedInvoice.customer_name || 'Walk-in Customer'}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(selectedInvoice.created_at)}</p>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-semibold">Item</th>
                      <th className="text-center px-4 py-3 text-sm font-semibold">Qty</th>
                      <th className="text-right px-4 py-3 text-sm font-semibold">Price</th>
                      <th className="text-right px-4 py-3 text-sm font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedInvoice.items?.map((item, i) => (
                      <tr key={i}>
                        <td className="px-4 py-3">{item.product_name}</td>
                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(item.unit_price)}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-2 text-right">
                <div className="flex justify-end gap-8">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium w-24">{formatCurrency(selectedInvoice.subtotal)}</span>
                </div>
                {selectedInvoice.discount_amount > 0 && (
                  <div className="flex justify-end gap-8">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-red-600 w-24">-{formatCurrency(selectedInvoice.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-end gap-8">
                  <span className="text-gray-600">Tax ({selectedInvoice.tax_percentage}%)</span>
                  <span className="font-medium w-24">{formatCurrency(selectedInvoice.tax_amount)}</span>
                </div>
                <div className="flex justify-end gap-8 pt-2 border-t text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary-600 w-24">{formatCurrency(selectedInvoice.total_amount)}</span>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <button
                  onClick={() => handleDownloadPDF(selectedInvoice)}
                  className="btn btn-secondary flex-1"
                >
                  <FiDownload className="mr-2" />
                  Download PDF
                </button>
                <button
                  onClick={() => {
                    handleSendWhatsApp(selectedInvoice);
                    setShowViewModal(false);
                  }}
                  className="btn btn-primary flex-1"
                >
                  <FiSend className="mr-2" />
                  Send via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInvoices;
