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
      // The user requested to use the "link name of the logged in academy"
      // We stored this as 'academy_link_name' in LoginModal.
      let tenantKey = localStorage.getItem('academy_link_name');

      // If tenant key not found in localStorage, try to get it from hostname
      if (!tenantKey) {
        let hostname = window.location.hostname;
        
        // Remove .localhost if present (for local development)
        if (hostname.endsWith('.localhost')) {
          hostname = hostname.replace('.localhost', '');
        }

        // Check if hostname is not localhost or empty
        if (hostname && hostname !== 'localhost') {
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
    // Check for 401 in successful response body
    if (response.data && response.data.success === false && response.data.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user_info');
        localStorage.removeItem('academy_link_name');
        document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
        window.location.href = '/auth/login';
        return Promise.reject(new Error('Token invalid or expired'));
      }
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user_info');
        localStorage.removeItem('academy_link_name');
        document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default academyApi;
