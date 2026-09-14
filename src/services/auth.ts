import api from '@/lib/api';
import academyApi from '@/lib/academy-api';
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
    throw error.response?.data || error;
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

export const getMeProfile = async (): Promise<any> => {
  try {
    const meResponse = await academyApi.get('me');
    return meResponse.data;
  } catch (e) {
    try {
      const settingsResponse = await academyApi.get('settings');
      return settingsResponse.data;
    } catch (err: any) {
      console.error('Failed to get user me profile:', err);
      throw err.response?.data || err;
    }
  }
};

export const getProfileStatus = async (): Promise<any> => {
  return getMeProfile();
};

export const getAcademySettings = async (): Promise<any> => {
  try {
    const response = await academyApi.get('settings');
    return response.data;
  } catch (e) {
    try {
      const meResponse = await academyApi.get('me');
      return meResponse.data;
    } catch (err: any) {
      console.error('Failed to get academy settings:', err);
      throw err.response?.data || err;
    }
  }
};

export const sendOtp = async (contact: string, countryCode?: string): Promise<ApiResponse<any>> => {
  try {
    const payload: any = { contact };
    if (countryCode) {
      payload.country_code = countryCode;
    }
    try {
      const response = await academyApi.post<ApiResponse<any>>('send-otp', payload);
      return response.data;
    } catch (err) {
      const response = await api.post<ApiResponse<any>>('https://api.darab.academy/api/academy/send-otp', payload);
      return response.data;
    }
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
    try {
      const response = await academyApi.post<ApiResponse<any>>('check-otp', payload);
      return response.data;
    } catch (err) {
      const response = await api.post<ApiResponse<any>>('https://api.darab.academy/api/academy/check-otp', payload);
      return response.data;
    }
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
  return updateAcademySettings(payload);
};


// * Sends all academy settings in a single multipart/form-data request.

export const updateAcademySettings = async (
  payload: Record<string, any>,
  imageFile?: File | null
): Promise<any> => {
  const formData = new FormData();

  // Append each setting as key[] and value[] array pairs matching Laravel/PHP array input validation
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append('key[]', key);
      formData.append('value[]', String(value));
    }
  });

  // Append the image binary as key[]='logo' & value[]=imageFile, plus 'logo' direct file
  if (imageFile) {
    formData.append('key[]', 'logo');
    formData.append('value[]', imageFile);
    formData.append('logo', imageFile);
  }

  try {
    const response = await academyApi.post('settings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to update academy settings:', error);
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

