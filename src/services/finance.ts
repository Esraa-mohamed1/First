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
    const responseBody = response.data as any;
    let items: any[] = [];
    let lastPage = 1;
    let currentPage = 1;

    if (responseBody) {
      if (Array.isArray(responseBody.data)) {
        items = [...responseBody.data];
        if (responseBody.meta) {
          lastPage = responseBody.meta.last_page || 1;
          currentPage = responseBody.meta.current_page || 1;
        } else if (responseBody.last_page) {
          lastPage = responseBody.last_page;
          currentPage = responseBody.current_page || 1;
        }
      } else if (responseBody.data && Array.isArray(responseBody.data.data)) {
        items = [...responseBody.data.data];
        lastPage = responseBody.data.last_page || 1;
        currentPage = responseBody.data.current_page || 1;
      }
    }

    if (lastPage && lastPage > currentPage) {
      const fetchPromises = [];
      for (let page = currentPage + 1; page <= lastPage; page++) {
        fetchPromises.push(academyApi.get<ApiResponse<any>>(`instructor_receiver_accounts?page=${page}`));
      }
      const pagesResponses = await Promise.all(fetchPromises);
      pagesResponses.forEach(pageRes => {
        const pageBody = pageRes.data;
        if (pageBody) {
          const pageData = pageBody.data?.data || pageBody.data;
          if (Array.isArray(pageData)) {
            items = items.concat(pageData);
          }
        }
      });
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

export const getReceiverAccounts = async (countryCode?: string): Promise<ReceiverAccount[]> => {
  try {
    const params: Record<string, any> = {};
    if (countryCode) {
      params.country_code = countryCode;
    }

    const response = await academyApi.get<ApiResponse<any>>('receiver_accounts', { params });
    const responseBody = response.data as any;
    let allItems: any[] = [];
    let lastPage = 1;
    let currentPage = 1;

    if (responseBody) {
      if (Array.isArray(responseBody.data)) {
        allItems = [...responseBody.data];
        if (responseBody.meta) {
          lastPage = responseBody.meta.last_page || 1;
          currentPage = responseBody.meta.current_page || 1;
        } else if (responseBody.last_page) {
          lastPage = responseBody.last_page;
          currentPage = responseBody.current_page || 1;
        }
      } else if (responseBody.data && Array.isArray(responseBody.data.data)) {
        allItems = [...responseBody.data.data];
        lastPage = responseBody.data.last_page || 1;
        currentPage = responseBody.data.current_page || 1;
      }
    }

    // Fetch subsequent pages if any
    if (lastPage && lastPage > currentPage) {
      const fetchPromises = [];
      for (let page = currentPage + 1; page <= lastPage; page++) {
        fetchPromises.push(
          academyApi.get<ApiResponse<any>>('receiver_accounts', {
            params: { ...params, page }
          })
        );
      }
      const pagesResponses = await Promise.all(fetchPromises);
      pagesResponses.forEach(pageRes => {
        const pageBody = pageRes.data;
        if (pageBody) {
          const pageData = pageBody.data?.data || pageBody.data;
          if (Array.isArray(pageData)) {
            allItems = allItems.concat(pageData);
          }
        }
      });
    }

    // Safeguard: filter locally if countryCode is provided
    if (countryCode) {
      allItems = allItems.filter(item => item.country_code === countryCode);
    }

    return allItems;
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

export interface StudentPurchaseRequest {
  id: number;
  user_id: number;
  course_id: number;
  starts_at: string;
  transaction_id: string;
  receipt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'penidng' | string;
  created_by: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  course?: {
    id: number;
    title: string;
    user_id: number;
    price: string;
    final_price: string;
    currency: string;
    image: string;
  };
}

export const getStudentPurchaseRequests = async (): Promise<StudentPurchaseRequest[]> => {
  try {
    const response = await academyApi.get<ApiResponse<StudentPurchaseRequest[]>>('user_subscribes');
    return response.data.data || [];
  } catch (error: any) {
    console.error('Failed to get student purchase requests:', error);
    return [];
  }
};

export const updateStudentPurchaseRequestStatus = async (
  id: number | string,
  status: 'accepted' | 'rejected' | 'active' | 'cancelled',
  rejectionReason?: string
): Promise<any> => {
  try {
    let backendStatus = status;
    if (status === 'accepted') backendStatus = 'active';
    else if (status === 'rejected') backendStatus = 'cancelled';

    const payload: any = { status: backendStatus };
    if (rejectionReason) {
      payload.message = rejectionReason;
    }
    const response = await academyApi.put<ApiResponse<any>>(`user_subscribes/${id}`, payload);
    return response.data.data;
  } catch (error: any) {
    console.error(`Failed to update student purchase request status for ${id}:`, error);
    throw error.response?.data || error;
  }
};


