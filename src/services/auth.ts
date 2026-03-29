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

export const getProfileStatus = async (): Promise<any> => {
  try {
    const response = await api.get<any>('https://api.darab.academy/api/academy/me');
    return response.data;
  } catch (error: any) {
    console.error('Failed to get profile status:', error);
    throw error.response?.data || error;
  }
};

export const sendOtp = async (contact: string): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post<ApiResponse<any>>('https://api.darab.academy/api/academy/send-otp', { contact });
    return response.data;
  } catch (error: any) {
    console.error('Failed to send OTP:', error);
    throw error.response?.data || error;
  }
};

export const verifyOtp = async (contact: string, otp: string): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post<ApiResponse<any>>('https://api.darab.academy/api/academy/check-otp', { contact, otp });
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


