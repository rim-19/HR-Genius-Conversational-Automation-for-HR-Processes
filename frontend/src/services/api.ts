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

// Response interceptor — silent token refresh on 401, then logout.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config || {};
    const status = error.response?.status;

    const isAuthCall = typeof original.url === 'string' && original.url.includes('/auth/');
    if (status === 401 && !original._retry && !isAuthCall) {
      original._retry = true;
      const refreshToken = localStorage.getItem('hr_genius_refresh');
      if (refreshToken) {
        try {
          const resp = await api.post('/auth/refresh', { refreshToken });
          const newToken = resp.data.token;
          localStorage.setItem('hr_genius_token', newToken);
          original.headers = { ...original.headers, Authorization: `Bearer ${newToken}` };
          return api(original); // retry the original request
        } catch {
          /* refresh failed → fall through to logout */
        }
      }
      localStorage.removeItem('hr_genius_user');
      localStorage.removeItem('hr_genius_token');
      localStorage.removeItem('hr_genius_refresh');
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

// Self-service ("me")
export const meAPI = {
  getMyEmployee: () => api.get('/me/employee'),
};

// Leave management
export const leaveAPI = {
  list: () => api.get('/leave'),
  create: (data: { type?: string; startDate: string; endDate: string; reason?: string; employeeId?: number }) =>
    api.post('/leave', data),
  review: (id: number, status: 'approved' | 'rejected') => api.patch(`/leave/${id}`, { status }),
};

// Notifications
export const notificationsAPI = {
  list: () => api.get('/notifications'),
  markRead: (id: number) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};

// Document templates
export const templatesAPI = {
  list: () => api.get('/templates'),
  update: (id: number, data: { name?: string; guidance?: string }) => api.put(`/templates/${id}`, data),
};

// Audit log + GDPR export
export const auditAPI = {
  list: (page: number = 1, limit: number = 20) => api.get(`/audit?page=${page}&limit=${limit}`),
  exportEmployee: (id: number) => api.get(`/audit/employee/${id}/export`),
};

export default api;
