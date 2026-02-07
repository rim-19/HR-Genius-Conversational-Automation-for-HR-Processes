import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hr_genius_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear user data and redirect to login
      localStorage.removeItem('hr_genius_user');
      localStorage.removeItem('hr_genius_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  logout: () => {
    localStorage.removeItem('hr_genius_user');
    localStorage.removeItem('hr_genius_token');
    window.location.href = '/login';
  },

  register: (data: any) =>
    api.post('/auth/register', data),
};

// Assistant API
export const assistantAPI = {
  sendMessage: (message: string) =>
    api.post('/ai/message', { message }),

  getHistory: () =>
    api.get('/ai/history'),

  clearHistory: () =>
    api.delete('/ai/history'),
};

// Employees API
export const employeesAPI = {
  getAll: (page: number = 1, limit: number = 10, search?: string) =>
    api.get(`/employees?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`),

  getById: (id: string) =>
    api.get(`/employees/${id}`),

  create: (data: any) =>
    api.post('/employees', data),

  update: (id: string, data: any) =>
    api.put(`/employees/${id}`, data),

  delete: (id: string) =>
    api.delete(`/employees/${id}`),
};

// Documents API
export const documentsAPI = {
  getAll: () => api.get('/documents'),

  getById: (id: string) =>
    api.get(`/documents/${id}`),

  generate: (type: string, data: any) =>
    api.post('/documents/generate', { type, data }),

  download: (id: string) =>
    api.get(`/documents/${id}/download`, { responseType: 'blob' }),

  delete: (id: string) =>
    api.delete(`/documents/${id}`),
};

// Dashboard Stats API
export const dashboardAPI = {
  getStats: () => api.get('/stats'),
  getActivity: () => api.get('/activity'),
};

export default api;
