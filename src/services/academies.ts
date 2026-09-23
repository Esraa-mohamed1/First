import api from '@/lib/api';
import { ApiResponse, Academy, CreateAcademyPayload, UpdateAcademyPayload } from '@/types/api';
import { getStoredAuthToken } from '@/lib/auth-storage';

const SUPER_ADMIN_API_URL = 'https://api.darab.academy/api/superAdmin';

export interface AcademyQueryParams {
  page?: number;
  limit?: number;
  package_id?: number | string;
  date_from?: string;
  date_to?: string;
  period?: string;
  search?: string;
}

export interface AcademyListResponse {
  items: Academy[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface AcademyStatsQueryParams {
  package_id?: number | string;
  date_from?: string;
  date_to?: string;
  period?: string;
}

export interface AcademyStats {
  active: number;
  inactive: number;
  total: number;
}

export const getAcademyStats = async (params?: AcademyStatsQueryParams): Promise<AcademyStats> => {
  try {
    const token = getStoredAuthToken();
    const queryParams: Record<string, any> = {};

    if (params?.package_id && params.package_id !== 'all') {
      queryParams.package_id = params.package_id;
    }
    if (params?.date_from) {
      queryParams.date_from = params.date_from;
    }
    if (params?.date_to) {
      queryParams.date_to = params.date_to;
    }
    if (params?.period && params.period !== 'all') {
      queryParams.period = params.period;
    }

    const response = await api.get<{
      success?: boolean;
      status?: number;
      message?: string;
      data?: {
        active?: number;
        inactive?: number;
        total?: number;
      };
    }>('/academies/stats', {
      baseURL: SUPER_ADMIN_API_URL,
      params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });

    if (response.data && response.data.data) {
      return {
        active: Number(response.data.data.active) || 0,
        inactive: Number(response.data.data.inactive) || 0,
        total: Number(response.data.data.total) || 0
      };
    }
    return { active: 0, inactive: 0, total: 0 };
  } catch (error) {
    console.error('Failed to fetch academy stats:', error);
    return { active: 0, inactive: 0, total: 0 };
  }
};

export const getAcademies = async (params?: AcademyQueryParams): Promise<AcademyListResponse> => {
  try {
    const token = getStoredAuthToken();
    const page = params?.page || 1;
    const limit = params?.limit || 10;

    const queryParams: Record<string, any> = {
      page,
      limit,
      per_page: limit
    };

    if (params?.package_id && params.package_id !== 'all') {
      queryParams.package_id = params.package_id;
    }
    if (params?.date_from) {
      queryParams.date_from = params.date_from;
    }
    if (params?.date_to) {
      queryParams.date_to = params.date_to;
    }
    if (params?.period && params.period !== 'all') {
      queryParams.period = params.period;
    }
    if (params?.search) {
      queryParams.search = params.search;
    }

    const response = await api.get<ApiResponse<Academy[]>>('/academies', {
      baseURL: SUPER_ADMIN_API_URL,
      params: queryParams,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });

    const resBody = response.data as any;

    let rawData: Academy[] = [];
    if (Array.isArray(resBody)) {
      rawData = resBody;
    } else if (Array.isArray(resBody?.data)) {
      rawData = resBody.data;
    } else if (resBody?.data && Array.isArray(resBody.data.data)) {
      rawData = resBody.data.data;
    } else if (Array.isArray(resBody?.items)) {
      rawData = resBody.items;
    }

    const meta =
      resBody?.meta ||
      resBody?.pagination ||
      (resBody?.data && typeof resBody.data === 'object' && !Array.isArray(resBody.data) ? resBody.data : null) ||
      resBody;

    const total =
      meta?.total !== undefined && typeof meta.total === 'number'
        ? meta.total
        : (resBody?.total !== undefined && typeof resBody.total === 'number' ? resBody.total : rawData.length);

    const currentPage =
      meta?.current_page !== undefined
        ? Number(meta.current_page)
        : (resBody?.current_page !== undefined ? Number(resBody.current_page) : page);

    const perPage =
      meta?.per_page !== undefined
        ? Number(meta.per_page)
        : (resBody?.per_page !== undefined ? Number(resBody.per_page) : limit);

    const lastPageFromMeta =
      meta?.last_page !== undefined
        ? Number(meta.last_page)
        : (resBody?.last_page !== undefined ? Number(resBody.last_page) : undefined);

    const totalPages = lastPageFromMeta !== undefined ? lastPageFromMeta : Math.max(1, Math.ceil(total / perPage));

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
