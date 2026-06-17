import axios from 'axios';

// -----------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------

export interface CreatePagePayload {
  title: string;
  slug: string;
  status: string;
  template?: string;
}

export interface CreatedPageResponse {
  id: number | string;
  title: string;
  slug: string;
  status: string;
  [key: string]: any;
}

// -----------------------------------------------------------------------
// Axios instance (auth token + tenant key from localStorage)
// -----------------------------------------------------------------------

const academyApi = axios.create({
  baseURL: 'https://api.darab.academy/api/academy',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

academyApi.interceptors.request.use((config) => {
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
});

// -----------------------------------------------------------------------
// createPage — POST /pages
// -----------------------------------------------------------------------

/**
 * Creates a new academy page via the API.
 * The endpoint expects x-www-form-urlencoded body with: title, slug, status.
 * Returns the created page object which includes the server-assigned `id`.
 */
export const createPage = async (
  payload: CreatePagePayload
): Promise<CreatedPageResponse> => {
  const formData = new URLSearchParams();
  formData.append('title', payload.title);
  formData.append('slug', payload.slug);
  formData.append('status', payload.status);
  if (payload.template) {
    formData.append('template', payload.template);
    formData.append('template_id', payload.template);
  }

  const response = await academyApi.post<any>('/pages', formData);

  // Handle both { id, ... } and { data: { id, ... } } response shapes
  const data = response.data?.data ?? response.data;

  if (!data) {
    throw new Error('No data returned from pages API');
  }

  return data as CreatedPageResponse;
};
