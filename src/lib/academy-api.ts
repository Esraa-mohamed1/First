import axios from 'axios';

const academyApi = axios.create({
  baseURL: 'https://api.darab.academy/api/academy/', 
  headers: {
    'Content-Type': 'application/json',
  },
});

academyApi.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      let tenantKey = localStorage.getItem('academy_link_name');
      if (!tenantKey) {
        let hostname = window.location.hostname;
                if (hostname.endsWith('.localhost')) {
          hostname = hostname.replace('.localhost', '');
        }        if (hostname && hostname !== 'localhost') {
           tenantKey = hostname;
        }
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn('AcademyAPI: No token found in localStorage');
      }
      
      if (tenantKey) {
        config.headers['X-Tenant-Key'] = tenantKey;
      } else {
        console.warn('AcademyAPI: No academy_link_name found in localStorage/hostname');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

academyApi.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success === false && response.data.status === 401) {
      if (typeof window !== 'undefined') {
        const hasToken = !!localStorage.getItem('token');
        const isInAcademicArea = window.location.pathname.startsWith('/academic');

        // During onboarding (/auth/*) some endpoints may return 401 (tenant not ready, missing headers, etc).
        // We should not hard-logout and wipe persisted auth unless we're inside the protected academy area
        // (or we actually had a token that became invalid while using the academy).
        if (isInAcademicArea || hasToken) {
          localStorage.removeItem('token');
          localStorage.removeItem('user_info');
          localStorage.removeItem('academy_link_name');
          document.cookie = "token=; path=/; max-age=0; SameSite=Lax";

          if (isInAcademicArea) {
            window.location.href = '/auth/login';
          }
        }

        return Promise.reject(new Error('Unauthorized (401)'));
      }
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        const hasToken = !!localStorage.getItem('token');
        const isInAcademicArea = window.location.pathname.startsWith('/academic');

        if (isInAcademicArea || hasToken) {
          localStorage.removeItem('token');
          localStorage.removeItem('user_info');
          localStorage.removeItem('academy_link_name');
          document.cookie = "token=; path=/; max-age=0; SameSite=Lax";

          if (isInAcademicArea) {
            window.location.href = '/auth/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default academyApi;
