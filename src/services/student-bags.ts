import studentApi from '@/lib/student-api';
import { ApiResponse } from '@/types/api';
import {
  BagApiItem,
  PurchaseBagPayload,
  BagPurchaseItem,
} from '@/types/bags';

/* ─────────────────────────────────────────────────────────
   Public / User / Student Bag API Endpoints (Base URL: /api/user)
───────────────────────────────────────────────────────── */

/** Helper to robustly extract arrays from direct arrays, { data: [...] } or Laravel paginated { data: { data: [...] } } */
function extractList<T>(resData: any): T[] {
  if (!resData) return [];
  if (Array.isArray(resData)) return resData;
  if (Array.isArray(resData.data)) return resData.data;
  if (resData.data && Array.isArray(resData.data.data)) return resData.data.data;
  return [];
}

/** Fetch all active bags for public/user browsing from /api/user/bags */
export const getBags = async (): Promise<BagApiItem[]> => {
  try {
    const response = await studentApi.get<any>('bags');
    return extractList<BagApiItem>(response.data);
  } catch (error: any) {
    console.error('Failed to fetch user bags:', error);
    return [];
  }
};

/** Fetch a single bag by ID for public/user viewing from /api/user/bags/:id */
export const getBag = async (id: number | string): Promise<BagApiItem | null> => {
  try {
    const response = await studentApi.get<ApiResponse<BagApiItem>>(`bags/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.error(`Failed to fetch user bag ${id}:`, error);
    return null;
  }
};

/** Purchase a bag by submitting payment info & receipt to /api/user/bag-purchases */
export const purchaseBag = async (payload: PurchaseBagPayload): Promise<any> => {
  try {
    const fd = new FormData();
    fd.append('bag_id', String(payload.bag_id));

    if (payload.payment_info_id != null) {
      fd.append('payment_info_id', String(payload.payment_info_id));
      fd.append('payment_method_id', String(payload.payment_info_id));
    }
    if (payload.notes) {
      fd.append('notes', payload.notes);
    }
    if (payload.receipt instanceof File) {
      fd.append('receipt', payload.receipt);
      fd.append('receipt_file', payload.receipt);
    } else if (typeof payload.receipt === 'string' && payload.receipt) {
      fd.append('receipt', payload.receipt);
    }

    const response = await studentApi.post<ApiResponse<any>>('bag-purchases', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('Failed to purchase bag via /api/user/bag-purchases:', error);
    throw error.response?.data || error;
  }
};

/** Fetch user bag purchases/subscriptions from /api/user/my-bag-purchases */
export const getUserBagPurchases = async (): Promise<BagPurchaseItem[]> => {
  try {
    const response = await studentApi.get<any>('my-bag-purchases');
    return extractList<BagPurchaseItem>(response.data);
  } catch (error: any) {
    console.warn('Failed to fetch /api/user/my-bag-purchases, trying bag-purchases:', error);
    try {
      const fallbackResp = await studentApi.get<any>('bag-purchases');
      return extractList<BagPurchaseItem>(fallbackResp.data);
    } catch (e) {
      console.error('Failed to fetch student bag purchases:', e);
      return [];
    }
  }
};
