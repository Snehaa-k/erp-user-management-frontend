import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://erp-user-management-backend.onrender.com/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/api/auth/login/', credentials),
  logout: () => api.post('/api/auth/logout/', { refresh: localStorage.getItem('refresh_token') }),
  getCurrentUser: () => api.get('/api/auth/me/'),
};

export const companyAPI = {
  getAll: () => api.get('/api/companies/'),
  create: (data) => api.post('/api/companies/', data),
  update: (id, data) => api.put(`/api/companies/${id}/`, data),
  delete: (id) => api.delete(`/api/companies/${id}/`),
};

export const userAPI = {
  getAll: () => api.get('/api/users/'),
  create: (data) => api.post('/api/users/', data),
  update: (id, data) => api.put(`/api/users/${id}/`, data),
  delete: (id) => api.delete(`/api/users/${id}/`),
  assignRole: (userId, roleId) => api.post(`/api/users/${userId}/assign_role/`, { role_id: roleId }),
  removeRole: (userId, roleId) => api.delete(`/api/users/${userId}/remove_role/`, { data: { role_id: roleId } }),
  assignCompany: (userId, companyId) => api.post(`/api/users/${userId}/assign_company/`, { company_id: companyId }),
};

export const roleAPI = {
  getAll: () => api.get('/api/roles/'),
  create: (data) => api.post('/api/roles/', data),
  update: (id, data) => api.put(`/api/roles/${id}/`, data),
  delete: (id) => api.delete(`/api/roles/${id}/`),
  assignPermissions: (roleId, permissions) => api.post(`/api/roles/${roleId}/assign_permissions/`, { permissions }),
};

export const permissionAPI = {
  getAll: () => api.get('/api/permissions/'),
};

export const auditAPI = {
  getAll: (params) => api.get('/api/audit-logs/', { params }),
};

export default api;