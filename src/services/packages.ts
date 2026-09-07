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
export const subscribeToPackage = async (packageId: number, email?: string): Promise<string> => {
  try {
    const response = await api.post<ApiResponse<any>>('create-link-payment', {
      package_id: packageId,
      email: email
    });
    // Handle response formats for paymentLink
    const data = response.data as any;
    const paymentLink = data.paymentLink || data.data?.paymentLink || (typeof data.data === 'string' ? data.data : null);

    if (paymentLink) {
      return paymentLink;
    }
    throw new Error('رابط الدفع غير موجود في الرد');
  } catch (error: any) {
    console.error('Failed to subscribe to package:', error);
    throw error.response?.data || error;
  }
};
