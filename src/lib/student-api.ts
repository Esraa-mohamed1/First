import axios from 'axios';
import { unwrapEncryptedResponseData } from './decryption';

const studentApi = axios.create({
  baseURL: 'https://api.darab.academy/api/user',
  headers: {
    'Content-Type': 'application/json',
  },
});

studentApi.interceptors.response.use(
  (response) => {
    response.data = unwrapEncryptedResponseData(response.data);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

studentApi.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      let tenantKey = localStorage.getItem('academy_link_name');
      
      if (!tenantKey) {
        let hostname = window.location.hostname;
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

export default studentApi;
