import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// API Service Functions
export const authService = {
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentInvoices: () => api.get('/dashboard/recent-invoices'),
  getRecentEnquiries: () => api.get('/dashboard/recent-enquiries'),
};

export const categoryService = {
  getAll: (params) => api.get('/categories', { params }),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getFeatured: () => api.get('/products/featured'),
  getById: (id) => api.get(`/products/${id}`),
  getBySlug: (slug) => api.get(`/products/slug/${slug}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const customerService = {
  getAll: (params) => api.get('/customers', { params }),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

export const invoiceService = {
  getAll: (params) => api.get('/invoices', { params }),
  getById: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post('/invoices', data),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  delete: (id) => api.delete(`/invoices/${id}`),
  getPdf: (id) => api.get(`/invoices/${id}/pdf`, { responseType: 'blob' }),
  sendWhatsApp: (id, phone) => api.post(`/invoices/${id}/send-whatsapp?phone_number=${phone}`),
};

export const offerService = {
  getAll: (params) => api.get('/offers', { params }),
  getActive: () => api.get('/offers/active'),
  getById: (id) => api.get(`/offers/${id}`),
  create: (data) => api.post('/offers', data),
  update: (id, data) => api.put(`/offers/${id}`, data),
  delete: (id) => api.delete(`/offers/${id}`),
  toggle: (id) => api.patch(`/offers/${id}/toggle`),
};

export const enquiryService = {
  getAll: (params) => api.get('/enquiries', { params }),
  getById: (id) => api.get(`/enquiries/${id}`),
  create: (data) => api.post('/enquiries', data),
  update: (id, data) => api.put(`/enquiries/${id}`, data),
  delete: (id) => api.delete(`/enquiries/${id}`),
  updateStatus: (id, status) => api.patch(`/enquiries/${id}/status?new_status=${status}`),
};
