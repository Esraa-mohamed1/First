import api from '@/lib/api';
import { ApiResponse, Academy, CreateAcademyPayload, UpdateAcademyPayload } from '@/types/api';
import { getStoredAuthToken } from '@/lib/auth-storage';

const SUPER_ADMIN_API_URL = 'https://api.darab.academy/api/superAdmin';

export interface AcademyQueryParams {
  page?: number;
  limit?: number;
}

export interface AcademyListResponse {
  items: Academy[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export const getAcademies = async (params?: AcademyQueryParams): Promise<AcademyListResponse> => {
  try {
    const token = getStoredAuthToken();
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const response = await api.get<ApiResponse<Academy[]>>('/academies', {
      baseURL: SUPER_ADMIN_API_URL,
      params: {
        ...(params?.page ? { page: params.page } : {}),
        ...(params?.limit ? { limit: params.limit, per_page: params.limit } : {})
      },
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });

    let rawData: Academy[] = [];
    if (response.data && (response.data.status || response.data.success)) {
      rawData = Array.isArray(response.data.data) ? response.data.data : [];
    } else if (Array.isArray(response.data)) {
      rawData = response.data;
    } else if (Array.isArray((response.data as any)?.data)) {
      rawData = (response.data as any).data;
    }

    const meta = response.data?.meta || (response.data as any)?.pagination;
    const total = meta?.total !== undefined ? meta.total : rawData.length;
    const currentPage = meta?.current_page !== undefined ? meta.current_page : page;
    const perPage = meta?.per_page !== undefined ? meta.per_page : limit;
    const totalPages = meta?.last_page !== undefined ? meta.last_page : Math.max(1, Math.ceil(total / perPage));

    return {
      items: rawData,
      total,
      page: currentPage,
      totalPages,
      limit: perPage
    };
  } catch (error) {
    console.error('Failed to fetch academies:', error);
    return {
      items: [],
      total: 0,
      page: 1,
      totalPages: 1,
      limit: 10
    };
  }
};

export const getAcademyById = async (id: number): Promise<Academy | null> => {
  try {
    const token = getStoredAuthToken();
    const response = await api.get<ApiResponse<Academy>>(`/academies/${id}`, {
      baseURL: SUPER_ADMIN_API_URL,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    if (response.data && (response.data.status || response.data.success)) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch academy ${id}:`, error);
    return null;
  }
};

export const createAcademy = async (payload: CreateAcademyPayload): Promise<ApiResponse<Academy>> => {
  try {
    const token = getStoredAuthToken();
    const response = await api.post<ApiResponse<Academy>>('/academies', payload, {
      baseURL: SUPER_ADMIN_API_URL,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to create academy:', error);
    throw error.response?.data || error;
  }
};

export const updateAcademy = async (id: number, payload: Partial<UpdateAcademyPayload>): Promise<ApiResponse<Academy>> => {
  try {
    const token = getStoredAuthToken();
    const response = await api.put<ApiResponse<Academy>>(`/academies/${id}`, payload, {
      baseURL: SUPER_ADMIN_API_URL,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  } catch (error: any) {
    console.error(`Failed to update academy ${id}:`, error);
    throw error.response?.data || error;
  }
};

export const deleteAcademy = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const token = getStoredAuthToken();
    const response = await api.delete<ApiResponse<any>>(`/academies/${id}`, {
      baseURL: SUPER_ADMIN_API_URL,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  } catch (error: any) {
    console.error(`Failed to delete academy ${id}:`, error);
    throw error.response?.data || error;
  }
};
