import api from '@/lib/api';
import { ApiResponse, CreateAccountPayload, LoginResponse } from '@/types/api';

export const createAccount = async (payload: CreateAccountPayload): Promise<ApiResponse<any> & { paymentLink?: any; token?: string }> => {
  try {
    const response = await api.post<ApiResponse<any>>('/create-account-academy', payload);

    if (response.data.status) {
      return response.data;
    }

    return response.data;
  } catch (error: any) {
    console.error('Failed to create account:', error);
    throw error.response?.data || error;
  }
};

export const createAccountInfoAcademy = async (payload: any) => {
  try {
    const response = await api.post<ApiResponse<any>>('/create-account-info-academy', payload);
    return response.data;
  } catch (error: any) {
    console.error('Failed to create academy info:', error);
    const responseData = error?.response?.data;
    if (responseData && typeof responseData === 'object' && Object.keys(responseData).length > 0) {
      throw responseData;
    }
    if (error && typeof error === 'object') {
      const safeError: any = {};
      if (error.message) safeError.message = error.message;
      if (error.name) safeError.name = error.name;
      if (error.code) safeError.code = error.code;
      if (error.status) safeError.status = error.status;
      if (error.statusText) safeError.statusText = error.statusText;
      if (Object.keys(safeError).length > 0) {
        throw safeError;
      }
    }
    throw typeof error === 'string' ? error : { message: 'حدث خطأ غير متوقع أثناء حفظ معلومات الأكاديمية' };
  }
};

export const login = async (payload: any): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('https://api.darab.academy/api/auth/login', payload);
    return response.data;
  } catch (error: any) {
    console.error('Failed to login:', error);
    throw error.response?.data || error;
  }
};

export const superAdminLogin = async (payload: any): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('https://api.darab.academy/api/superAdmin/login', payload);
    return response.data;
  } catch (error: any) {
    console.error('Failed to login as superadmin:', error);
    throw error.response?.data || error;
  }
};

export const getProfileStatus = async (): Promise<any> => {
  try {
    const response = await api.get<any>('https://api.darab.academy/api/academy/me');
    return response.data;
  } catch (error: any) {
    console.error('Failed to get profile status:', error);
    throw error.response?.data || error;
  }
};

export const sendOtp = async (contact: string, countryCode?: string): Promise<ApiResponse<any>> => {
  try {
    const payload: any = { contact };
    if (countryCode) {
      payload.country_code = countryCode;
    }
    const response = await api.post<ApiResponse<any>>('https://api.darab.academy/api/academy/send-otp', payload);
    return response.data;
  } catch (error: any) {
    console.error('Failed to send OTP:', error);
    throw error.response?.data || error;
  }
};

export const verifyOtp = async (contact: string, otp: string, countryCode?: string): Promise<ApiResponse<any>> => {
  try {
    const payload: any = { contact, otp };
    if (countryCode) {
      payload.country_code = countryCode;
    }
    const response = await api.post<ApiResponse<any>>('https://api.darab.academy/api/academy/check-otp', payload);
    return response.data;
  } catch (error: any) {
    console.error('Failed to verify OTP:', error);
    throw error.response?.data || error;
  }
};

export const getMyUsageLimit = async (): Promise<any> => {
  try {
    const response = await api.get<any>('https://api.darab.academy/api/academy/my-usage-limit');
    return response.data;
  } catch (error: any) {
    console.error('Failed to get my usage limit:', error);
    throw error.response?.data || error;
  }
};

export const getMyPackage = async (): Promise<any> => {
  try {
    const response = await api.get<any>('https://api.darab.academy/api/academy/my-package');
    return response.data;
  } catch (error: any) {
    console.error('Failed to get my package:', error);
    throw error.response?.data || error;
  }
};

export const updateDetailedProfile = async (payload: any): Promise<any> => {
  try {
    const response = await api.post<any>('https://api.darab.academy/api/academy/organization_profiles', payload);
    return response.data;
  } catch (error: any) {
    console.error('Failed to update detailed profile:', error);
    throw error.response?.data || error;
  }
};

export const forgetPassword = async (payload: { email: string }): Promise<any> => {
  try {
    const response = await api.post<any>('https://api.darab.academy/api/auth/forget-password', payload);
    return response.data;
  } catch (error: any) {
    console.error('Failed to request forget password:', error);
    throw error.response?.data || error;
  }
};

export const resetPassword = async (payload: any): Promise<any> => {
  try {
    const response = await api.post<any>('https://api.darab.academy/api/auth/reset-password', payload);
    return response.data;
  } catch (error: any) {
    console.error('Failed to reset password:', error);
    throw error.response?.data || error;
  }
};

