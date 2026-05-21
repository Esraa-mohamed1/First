import academyApi from '@/lib/academy-api';
import { ApiResponse, ReceiverAccount } from '@/types/api';

export interface WithdrawalRequest {
  id: number;
  user_payment_info_id: number;
  amount: string;
  status: 'pending' | 'completed' | 'rejected' | string;
  created_at: string;
  updated_at: string;
}

export interface CreateWithdrawalPayload {
  user_payment_info_id: number;
  amount: string | number;
}

export interface UserPaymentInfo {
  id: number;
  name: string;
  accountValue: string;
  account_value?: string;
  currency: string;
}

export interface WalletData {
  id: number;
  user_id: number;
  balance: string | number;
  available_balance: string | number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export const getWithdrawalRequests = async (): Promise<WithdrawalRequest[]> => {
  try {
    const response = await academyApi.get<ApiResponse<WithdrawalRequest[]>>('withdraw');
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to get withdrawal requests:', error);
    throw error.response?.data || error;
  }
};

export const getWalletData = async (): Promise<WalletData> => {
  try {
    const response = await academyApi.get<ApiResponse<WalletData>>('wallet');
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to get wallet data:', error);
    throw error.response?.data || error;
  }
};

export const createWithdrawalRequest = async (payload: CreateWithdrawalPayload): Promise<WithdrawalRequest> => {
  try {
    const response = await academyApi.post<ApiResponse<WithdrawalRequest>>('withdraw', payload);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to create withdrawal request:', error);
    throw error.response?.data || error;
  }
};

export const getUserPaymentInfos = async (): Promise<UserPaymentInfo[]> => {
  try {
    const response = await academyApi.get<ApiResponse<UserPaymentInfo[]>>('receiver_accounts');
    // Normalize response objects to contain accountValue from account_value if needed
    const data = response.data.data || [];
    return data.map(item => ({
      ...item,
      accountValue: item.accountValue || item.account_value || '',
    }));
  } catch (error: any) {
    console.error('Failed to get receiver accounts:', error);
    throw error.response?.data || error;
  }
};

export const createUserPaymentInfo = async (payload: Omit<UserPaymentInfo, 'id'>): Promise<UserPaymentInfo> => {
  try {
    const requestPayload = {
      name: payload.name,
      account_value: payload.accountValue,
      accountValue: payload.accountValue,
      currency: payload.currency,
    };
    const response = await academyApi.post<ApiResponse<UserPaymentInfo>>('receiver_accounts', requestPayload);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to create receiver account:', error);
    throw error.response?.data || error;
  }
};

export const updateUserPaymentInfo = async (id: number, payload: Partial<UserPaymentInfo>): Promise<UserPaymentInfo> => {
  try {
    const requestPayload: any = {};
    if (payload.name !== undefined) requestPayload.name = payload.name;
    if (payload.accountValue !== undefined) {
      requestPayload.account_value = payload.accountValue;
      requestPayload.accountValue = payload.accountValue;
    }
    if (payload.currency !== undefined) requestPayload.currency = payload.currency;

    const response = await academyApi.put<ApiResponse<UserPaymentInfo>>(`receiver_accounts/${id}`, requestPayload);
    return response.data.data;
  } catch (error: any) {
    console.error(`Failed to update receiver account ${id}:`, error);
    throw error.response?.data || error;
  }
};

export const deleteUserPaymentInfo = async (id: number): Promise<void> => {
  try {
    await academyApi.delete(`receiver_accounts/${id}`);
  } catch (error: any) {
    console.error(`Failed to delete receiver account ${id}:`, error);
    throw error.response?.data || error;
  }
};

export const getReceiverAccounts = async (): Promise<ReceiverAccount[]> => {
  try {
    const response = await academyApi.get<ApiResponse<ReceiverAccount[]>>('receiver_accounts');
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to get receiver accounts:', error);
    throw error.response?.data || error;
  }
};

export interface ConfigureReceiverAccountPayload {
  receiver_account_id: number;
  type: 'email' | 'phone';
  value: string;
}

export const configureReceiverAccount = async (payload: ConfigureReceiverAccountPayload): Promise<any> => {
  try {
    // This is a placeholder. In a real application, you would have a specific endpoint
    // to configure a user's payment method for a given receiver_account_id.
    // For example: academyApi.post<ApiResponse<any>>('user_payment_methods', payload);
    console.log('Simulating API call to configure receiver account:', payload);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return { status: true, message: 'Receiver account configured successfully.' };
  } catch (error: any) {
    console.error('Failed to configure receiver account:', error);
    throw error.response?.data || error;
  }
};


