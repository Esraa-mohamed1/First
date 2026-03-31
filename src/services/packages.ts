import api from '@/lib/api';
import academyApi from '@/lib/academy-api';
import { ApiResponse, Package, CreatePackagePayload, Feature } from '@/types/api';

const SUPER_ADMIN_API_URL = 'https://api.darab.academy/api/superAdmin';

export const getPackages = async (): Promise<Package[]> => {
  try {
    const response = await api.get<ApiResponse<Package[]>>('/packages');
    if (response.data.status) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch packages:', error);
    return [];
  }
};

export const subscribeToPackage = async (packageId: number, email?: string): Promise<string> => {
  try {
    const response = await api.post<ApiResponse<any>>('create-link-payment', { 
      package_id: packageId,
      email: email 
    });
    // Handle response formats for paymentLink
    const paymentLink = response.data.paymentLink || response.data.data?.paymentLink || (typeof response.data.data === 'string' ? response.data.data : null);
    
    if (paymentLink) {
      return paymentLink;
    }
    throw new Error('رابط الدفع غير موجود في الرد');
  } catch (error: any) {
    console.error('Failed to subscribe to package:', error);
    throw error.response?.data || error;
  }
};

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
    const response = await api.put<ApiResponse<Package>>(`/packages/${id}`, payload, {
      baseURL: SUPER_ADMIN_API_URL
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
export const updateFeature = async (id: number, title: string): Promise<ApiResponse<Feature>> => {
  try {
    const response = await api.put<ApiResponse<Feature>>(`/features/${id}`, { title }, {
      baseURL: SUPER_ADMIN_API_URL
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
    const response = await api.post<ApiResponse<any>>('/feature_packages', payload, {
      baseURL: SUPER_ADMIN_API_URL
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to associate feature:', error);
    throw error.response?.data || error;
  }
};
