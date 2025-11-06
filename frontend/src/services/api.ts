import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('hr_genius_user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        // TODO: Add actual token from backend
        config.headers.Authorization = `Bearer ${userData.id}`;
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear user data and redirect to login
      localStorage.removeItem('hr_genius_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  logout: () => 
    api.post('/auth/logout'),
  register: (data: any) => 
    api.post('/auth/register', data),
};

// Assistant API
export const assistantAPI = {
  sendMessage: (message: string) => 
    api.post('/assistant/chat', { message }),
  // TODO: integrate backend endpoint later
  // Example: await axios.post("/api/assistant", { prompt })
  getHistory: () => 
    api.get('/assistant/history'),
  clearHistory: () => 
    api.delete('/assistant/history'),
};

// Employees API
export const employeesAPI = {
  getAll: () => 
    api.get('/employees'),
  // TODO: fetch from /api/employees
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
  getAll: () => 
    api.get('/documents'),
  // TODO: connect to /api/documents
  getById: (id: string) => 
    api.get(`/documents/${id}`),
  generate: (type: string, data: any) => 
    api.post('/documents/generate', { type, data }),
  download: (id: string) => 
    api.get(`/documents/${id}/download`, { responseType: 'blob' }),
  delete: (id: string) => 
    api.delete(`/documents/${id}`),
};

// Workflows API
export const workflowsAPI = {
  getAll: () => 
    api.get('/workflows'),
  // TODO: integrate n8n workflow trigger
  trigger: (workflowId: string, data: any) => 
    api.post(`/workflows/${workflowId}/trigger`, data),
  getStatus: (workflowId: string) => 
    api.get(`/workflows/${workflowId}/status`),
};

export default api;
