import api from '@/lib/api';
import { ApiResponse, Package, CreatePackagePayload, Feature } from '@/types/api';
import { getStoredAuthToken } from '@/lib/auth-storage';

const SUPER_ADMIN_API_URL = 'https://api.darab.academy/api/superAdmin';

export interface AdminPackageQueryParams {
  page?: number;
  limit?: number;
}

export interface AdminPackageListResponse {
  items: Package[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export async function getAdminPackages(params: AdminPackageQueryParams): Promise<AdminPackageListResponse>;
export async function getAdminPackages(): Promise<Package[]>;
export async function getAdminPackages(params?: AdminPackageQueryParams): Promise<AdminPackageListResponse | Package[]> {
  try {
    const token = getStoredAuthToken();
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const response = await api.get<ApiResponse<Package[]>>('/packages', {
      baseURL: SUPER_ADMIN_API_URL,
      params: params ? {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        per_page: params.limit ?? 10
      } : undefined,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });

    const resBody = response.data as any;

    let rawData: Package[] = [];
    if (Array.isArray(resBody)) {
      rawData = resBody;
    } else if (Array.isArray(resBody?.data)) {
      rawData = resBody.data;
    } else if (resBody?.data && Array.isArray(resBody.data.data)) {
      rawData = resBody.data.data;
    } else if (Array.isArray(resBody?.items)) {
      rawData = resBody.items;
    }

    const metaObj =
      resBody?.meta ||
      resBody?.pagination ||
      (resBody?.data && typeof resBody.data === 'object' && !Array.isArray(resBody.data) ? resBody.data : null) ||
      resBody;

    const total =
      metaObj?.total !== undefined && typeof metaObj.total === 'number'
        ? metaObj.total
        : (resBody?.total !== undefined && typeof resBody.total === 'number' ? resBody.total : rawData.length);

    const currentPage =
      metaObj?.current_page !== undefined
        ? Number(metaObj.current_page)
        : (resBody?.current_page !== undefined ? Number(resBody.current_page) : page);

    const perPage =
      metaObj?.per_page !== undefined
        ? Number(metaObj.per_page)
        : (resBody?.per_page !== undefined ? Number(resBody.per_page) : limit);

    const lastPageFromMeta =
      metaObj?.last_page !== undefined
        ? Number(metaObj.last_page)
        : (resBody?.last_page !== undefined ? Number(resBody.last_page) : undefined);

    const totalPages = lastPageFromMeta !== undefined ? lastPageFromMeta : Math.max(1, Math.ceil(total / perPage));

    if (params) {
      return {
        items: rawData,
        total,
        page: currentPage,
        totalPages,
        limit: perPage
      };
    }

    return rawData;
  } catch (error) {
    console.error('Failed to fetch packages:', error);
    if (params) {
      return {
        items: [],
        total: 0,
        page: 1,
        totalPages: 1,
        limit: 10
      };
    }
    return [];
  }
}

export const createPackage = async (payload: CreatePackagePayload): Promise<ApiResponse<Package>> => {
  try {
    const response = await api.post<ApiResponse<Package>>('/packages', payload, {
      baseURL: SUPER_ADMIN_API_URL
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to create package:', error);
    throw error.response?.data || error;
  }
};

export const getFeatures = async (): Promise<Feature[]> => {
  try {
    const response = await api.get<ApiResponse<Feature[]>>('/features', {
      baseURL: SUPER_ADMIN_API_URL
    });
    if (response.data.status) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch features:', error);
    return [];
  }
};

export const createFeature = async (title: string): Promise<ApiResponse<Feature>> => {
  try {
    const response = await api.post<ApiResponse<Feature>>('/features', { title }, {
      baseURL: SUPER_ADMIN_API_URL
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to create feature:', error);
    throw error.response?.data || error;
  }
};

export const getPackageById = async (id: number): Promise<Package | null> => {
  try {
    const response = await api.get<ApiResponse<Package>>(`/packages/${id}`, {
      baseURL: SUPER_ADMIN_API_URL
    });
    if (response.data.status) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch package ${id}:`, error);
    return null;
  }
};

export const updatePackage = async (id: number, payload: CreatePackagePayload): Promise<ApiResponse<Package>> => {
  try {
    const token = getStoredAuthToken();
    const response = await api.put<ApiResponse<Package>>(`/packages/${id}`, payload, {
      baseURL: SUPER_ADMIN_API_URL,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  } catch (error: any) {
    console.error(`Failed to update package ${id}:`, error);
    throw error.response?.data || error;
  }
};

export const deletePackage = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const response = await api.delete<ApiResponse<any>>(`/packages/${id}`, {
      baseURL: SUPER_ADMIN_API_URL
    });
    return response.data;
  } catch (error: any) {
    console.error(`Failed to delete package ${id}:`, error);
    throw error.response?.data || error;
  }
};
export const updateFeature = async (id: number, label: string): Promise<ApiResponse<Feature>> => {
  try {
    const token = getStoredAuthToken();
    const response = await api.put<ApiResponse<Feature>>(`/features/${id}`, { label: label }, {
      baseURL: SUPER_ADMIN_API_URL,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  } catch (error: any) {
    console.error(`Failed to update feature ${id}:`, error);
    throw error.response?.data || error;
  }
};

export const deleteFeature = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const response = await api.delete<ApiResponse<any>>(`/features/${id}`, {
      baseURL: SUPER_ADMIN_API_URL
    });
    return response.data;
  } catch (error: any) {
    console.error(`Failed to delete feature ${id}:`, error);
    throw error.response?.data || error;
  }
};

export const associateFeatures = async (payload: { package_id: number, feature_id: number, value: string, lable: string }): Promise<ApiResponse<any>> => {
  try {
    const response = await api.put<ApiResponse<any>>('/feature_packages', payload, {
      baseURL: SUPER_ADMIN_API_URL
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to associate feature:', error);
    throw error.response?.data || error;
  }
};
