import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://bowoye-backend-5nd0.onrender.com/api' : 'http://localhost:3001/api');

// Créer une instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
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

// Intercepteur pour gérer les réponses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Ne pas supprimer automatiquement le token - laisser AuthContext gérer
      console.warn('Token expiré ou invalide - AuthContext va gérer la déconnexion');
    }
    return Promise.reject(error);
  }
);

// API d'authentification
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/auth/password', passwordData),
};

// API d'authentification avec OTP (vérification email)
export const authOTPAPI = {
  register: (userData) => api.post('/auth-otp/register', userData),
  verify: (email, otp) => api.post('/auth-otp/verify', { email, otp }),
  resendOTP: (email) => api.post('/auth-otp/resend-otp', { email }),
  login: (email, password) => api.post('/auth-otp/login', { email, password }),
};

// API des produits
export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getRecommendedProducts: (id) => api.get(`/products/${id}/recommended`),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  addReview: (id, reviewData) => api.post(`/products/${id}/reviews`, reviewData),
};

// API des catégories
export const categoriesAPI = {
  getCategories: () => api.get('/categories'),
  getCategoriesByType: (type) => api.get(`/categories/type/${type}`),
  getCategory: (id) => api.get(`/categories/${id}`),
  createCategory: (categoryData) => api.post('/categories', categoryData),
  updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
  getCategoryStats: () => api.get('/categories/stats'),
};

// API des commandes
export const ordersAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  getAllOrders: (params) => api.get('/orders', { params }),
  updateOrderStatus: (id, statusData) => api.put(`/orders/${id}/status`, statusData),
  getOrderStats: () => api.get('/orders/stats'),
};

// API des devis
export const quotesAPI = {
  createQuote: (quoteData) => api.post('/quotes', quoteData),
  getMyQuotes: (params) => api.get('/quotes/my-quotes', { params }),
  getQuote: (id) => api.get(`/quotes/${id}`),
  getAllQuotes: (params) => api.get('/quotes', { params }),
  updateQuoteStatus: (id, statusData) => api.put(`/quotes/${id}/status`, statusData),
  getQuoteStats: () => api.get('/quotes/stats'),
};

// API des comparaisons
export const comparisonAPI = {
  getMyComparisons: () => api.get('/comparisons'),
  addToComparison: (productId) => api.post('/comparisons/add', { productId }),
  removeFromComparison: (productId) => api.delete(`/comparisons/remove/${productId}`),
  clearComparison: () => api.delete('/comparisons/clear'),
};

// API utilitaire
export const utilsAPI = {
  healthCheck: () => api.get('/health'),
};

export default api;
