import axios from 'axios';

const api = axios.create({
  baseURL:  'https://api.darab.academy/api/front', 
  headers: {
    'Content-Type': 'application/json',
  },
});




api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      let tenantKey = localStorage.getItem('academy_link_name');
      if (!tenantKey) {
        let hostname = window.location.hostname;
        // Remove .localhost if present
        if (hostname.endsWith('.localhost')) {
          hostname = hostname.replace('.localhost', '');
        }
        if (hostname && hostname !== 'localhost') {
           tenantKey = hostname;
        }
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (tenantKey) {
        config.headers['X-Tenant-Key'] = tenantKey;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
