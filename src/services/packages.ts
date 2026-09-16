import api from '@/lib/api';
import academyApi from '@/lib/academy-api';
import { ApiResponse, Package, CreatePackagePayload, Feature } from '@/types/api';
import { getStoredAuthToken } from '@/lib/auth-storage';
import { log } from 'node:console';

export const getPackages = async (): Promise<Package[]> => {
  try {
    const response = await api.get<ApiResponse<Package[]>>('/packages',);

    if (response.data.status) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch packages:', error);
    return [];
  }
};
export const subscribeToPackage = async (
  packageId: number,
  email: string | undefined,
  paymentProof: File
): Promise<ApiResponse<any>> => {
  try {
    const formData = new FormData();

    formData.append('package_id', String(packageId));

    if (email) {
      formData.append('email', email);
    }

    formData.append('payment_proof', paymentProof, paymentProof.name);

    const response = await api.post<ApiResponse<any>>(
      '/academy/upgrade-packages',
      formData,
      {
        baseURL: 'https://api.darab.academy/api',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Failed to subscribe to package:', error);
    throw error.response?.data || error;
  }
};