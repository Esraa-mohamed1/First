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
  logo?: string;
  receiver_account_id?: number;
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
    const response = await academyApi.get<ApiResponse<any>>('instructor_receiver_accounts');
    let rawData = response.data.data;
    let items: any[] = [];

    if (Array.isArray(rawData)) {
      items = rawData;
    } else if (rawData && Array.isArray(rawData.data)) {
      items = [...rawData.data];
      const lastPage = rawData.last_page;
      const currentPage = rawData.current_page || 1;

      if (lastPage && lastPage > currentPage) {
        const fetchPromises = [];
        for (let page = currentPage + 1; page <= lastPage; page++) {
          fetchPromises.push(academyApi.get<ApiResponse<any>>(`instructor_receiver_accounts?page=${page}`));
        }
        const pagesResponses = await Promise.all(fetchPromises);
        pagesResponses.forEach(pageRes => {
          const pageData = pageRes.data?.data?.data || pageRes.data?.data;
          if (Array.isArray(pageData)) {
            items = items.concat(pageData);
          }
        });
      }
    }

    return items.map(item => ({
      ...item,
      id: item.id,
      name: item.receiver_account?.name || item.name || '',
      logo: item.receiver_account?.logo || '',
      accountValue: item.accountValue || item.account_value || '',
      receiver_account_id: item.receiver_account_id,
      currency: item.currency || 'SAR',
    }));
  } catch (error: any) {
    console.error('Failed to get instructor receiver accounts:', error);
    throw error.response?.data || error;
  }
};

export const createUserPaymentInfo = async (payload: Omit<UserPaymentInfo, 'id'> & { receiver_account_id?: number; logo?: File | null }): Promise<UserPaymentInfo> => {
  try {
    const formData = new FormData();
    if (payload.receiver_account_id) formData.append('receiver_account_id', String(payload.receiver_account_id));
    if (payload.accountValue) formData.append('account_value', payload.accountValue);
    if (payload.logo) formData.append('logo', payload.logo);
    formData.append('is_active', '1');

    const response = await academyApi.post<ApiResponse<UserPaymentInfo>>('instructor_receiver_accounts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to create instructor receiver account:', error);
    throw error.response?.data || error;
  }
};

export const updateUserPaymentInfo = async (id: number, payload: Partial<UserPaymentInfo> & { receiver_account_id?: number; logo?: File | null }): Promise<UserPaymentInfo> => {
  try {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('is_active', '1');
    if (payload.receiver_account_id !== undefined) formData.append('receiver_account_id', String(payload.receiver_account_id));
    if (payload.accountValue !== undefined) formData.append('account_value', payload.accountValue);
    if (payload.logo) formData.append('logo', payload.logo);

    const response = await academyApi.post<ApiResponse<UserPaymentInfo>>(`instructor_receiver_accounts/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  } catch (error: any) {
    console.error(`Failed to update instructor receiver account ${id}:`, error);
    throw error.response?.data || error;
  }
};

export const deleteUserPaymentInfo = async (id: number): Promise<void> => {
  try {
    await academyApi.delete(`instructor_receiver_accounts/${id}`);
  } catch (error: any) {
    console.error(`Failed to delete instructor receiver account ${id}:`, error);
    throw error.response?.data || error;
  }
};

export const createAcademyReceiverAccount = async (payload: { name: string; key: string; country_code?: string; logo?: File | null }): Promise<ReceiverAccount> => {
  try {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('key', payload.key);
    formData.append('is_active', '1');
    if (payload.country_code) formData.append('country_code', payload.country_code);
    if (payload.logo) formData.append('logo', payload.logo);

    const response = await academyApi.post<ApiResponse<ReceiverAccount>>('receiver_accounts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to create academy receiver account:', error);
    throw error.response?.data || error;
  }
};

export const updateAcademyReceiverAccount = async (id: number, payload: { name: string; key: string; country_code?: string; logo?: File | null }): Promise<ReceiverAccount> => {
  try {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('key', payload.key);
    formData.append('is_active', '1');
    if (payload.country_code) formData.append('country_code', payload.country_code);
    if (payload.logo) formData.append('logo', payload.logo);
    formData.append('_method', 'PUT');

    const response = await academyApi.post<ApiResponse<ReceiverAccount>>(`receiver_accounts/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  } catch (error: any) {
    console.error(`Failed to update academy receiver account ${id}:`, error);
    throw error.response?.data || error;
  }
};

export const deleteAcademyReceiverAccount = async (id: number): Promise<void> => {
  try {
    await academyApi.delete(`receiver_accounts/${id}`);
  } catch (error: any) {
    console.error(`Failed to delete academy receiver account ${id}:`, error);
    throw error.response?.data || error;
  }
};

export const getReceiverAccounts = async (): Promise<ReceiverAccount[]> => {
  try {
    const response = await academyApi.get<ApiResponse<any>>('receiver_accounts');
    const resData = response.data.data;

    // Check if it's a flat array
    if (Array.isArray(resData)) {
      return resData;
    }

    // Check if it's paginated (i.e. has nested data array)
    if (resData && Array.isArray(resData.data)) {
      let allItems = [...resData.data];
      const lastPage = resData.last_page;
      const currentPage = resData.current_page || 1;

      // Fetch subsequent pages if any
      if (lastPage && lastPage > currentPage) {
        const fetchPromises = [];
        for (let page = currentPage + 1; page <= lastPage; page++) {
          fetchPromises.push(academyApi.get<ApiResponse<any>>(`receiver_accounts?page=${page}`));
        }
        const pagesResponses = await Promise.all(fetchPromises);
        pagesResponses.forEach(pageRes => {
          const pageData = pageRes.data?.data?.data || pageRes.data?.data;
          if (Array.isArray(pageData)) {
            allItems = allItems.concat(pageData);
          }
        });
      }
      return allItems;
    }

    return [];
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


