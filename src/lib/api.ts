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




const getFullTenantDomain = (): string => {
  if (typeof window === 'undefined') return '';

  let hostname = (window.location.hostname || '').trim().toLowerCase();
  if (hostname.endsWith('.localhost')) {
    hostname = hostname.replace(/\.localhost$/, '').trim().toLowerCase();
  }

  if (hostname && hostname !== 'localhost') {
    if (hostname.endsWith('darab.academy') || hostname.includes('.')) {
      return hostname.toLowerCase();
    }
    return `${hostname.toLowerCase()}.darab.academy`;
  }

  const storedLink = localStorage.getItem('academy_link_name');
  if (storedLink) {
    const clean = storedLink.trim().toLowerCase();
    if (clean.includes('.')) {
      return clean.toLowerCase();
    }
    return `${clean.toLowerCase()}.darab.academy`;
  }

  try {
    const rawUser = localStorage.getItem('user_info');
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      if (parsed.domain) return String(parsed.domain).trim().toLowerCase();
      if (parsed.custom_domain) return String(parsed.custom_domain).trim().toLowerCase();
      if (parsed.subdomain) {
        const sub = String(parsed.subdomain).trim().toLowerCase();
        return sub.includes('.') ? sub : `${sub}.darab.academy`;
      }
      if (parsed.academy_link_name) {
        const link = String(parsed.academy_link_name).trim().toLowerCase();
        return link.includes('.') ? link : `${link}.darab.academy`;
      }
    }
  } catch {}

  return '';
};

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const fullTenantDomain = getFullTenantDomain();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (fullTenantDomain) {
        const lowerDomain = fullTenantDomain.trim().toLowerCase();
        config.headers['X-Tenant-Key'] = lowerDomain;
        config.headers['X-Tenant'] = lowerDomain;
        config.headers['x-tenant-name'] = lowerDomain;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
