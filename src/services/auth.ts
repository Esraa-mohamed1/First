import api from '@/lib/api';
import { ApiResponse, CreateAccountPayload, LoginResponse } from '@/types/api';

export const createAccount = async (payload: CreateAccountPayload): Promise<ApiResponse<any> & { paymentLink?: any; token?: string }> => {
  try {
    const response = await api.post<ApiResponse<any>>('/create-account-academy', payload);

    if (response.data.status) {
      // If a package is selected, create a payment link
      if (payload.package_id) {
        try {
          const paymentResponse = await api.post<ApiResponse<any>>('/create-link-payment', {
            package_id: payload.package_id,
            email: payload.email,
            phone: payload.phone,
            name: payload.name,
          });

          if (paymentResponse.data.status && paymentResponse.data.data) {
             const linkData = paymentResponse.data.data;
             // Handle various potential structures of the payment link response
             const link = typeof linkData === 'string' ? linkData : (linkData.link || linkData.url || linkData.payment_url);

             console.log('Payment Link Created:', link);

            return {
              ...response.data,
              paymentLink: link 
            };
          }
        } catch (paymentError) {
          console.error('Failed to create payment link:', paymentError);
          // Return success for account creation but indicate payment failure?
          // For now, let's just return the account creation response
        }
      }
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
