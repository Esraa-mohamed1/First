import axios from 'axios';
import { unwrapEncryptedResponseData } from './decryption';

const api = axios.create({
  baseURL:  'https://api.darab.academy/api/front', 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    response.data = unwrapEncryptedResponseData(response.data);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);




api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      let tenantKey = localStorage.getItem('academy_link_name');
      if (!tenantKey) {
        let hostname = window.location.hostname;
        // Remove .localhost and .darab.academy if present
        if (hostname.endsWith('.localhost')) {
          hostname = hostname.replace('.localhost', '');
        }
        if (hostname.endsWith('.darab.academy')) {
          hostname = hostname.replace('.darab.academy', '');
        }
        if (hostname && hostname !== 'localhost') {
           tenantKey = hostname;
        }
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (tenantKey) {
        const lowerKey = tenantKey.toLowerCase();
        config.headers['X-Tenant-Key'] = lowerKey;
        config.headers['X-Tenant'] = lowerKey;
        config.headers['x-tenant-name'] = lowerKey;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
