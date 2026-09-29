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
    if (typeof File !== 'undefined' && typeof File === 'function' && payload.receipt instanceof File) {
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

/**
 * Download a bag via POST /api/user/bags/:id/download
 */
export const downloadBag = async (bagId: number | string): Promise<any> => {
  try {
    const response = await studentApi.post(`bags/${bagId}/download`);
    return response.data;
  } catch (error: any) {
    console.error(`Failed to download bag ${bagId}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Helper to trigger bag download and handle all response shapes (URL string, object with url/path/file, blob, or array)
 */
export const handleBagDownloadResponse = (data: any, fallbackBagId?: number | string) => {
  if (!data) return;

  // Case 1: Direct string URL
  if (typeof data === 'string' && (data.startsWith('http://') || data.startsWith('https://') || data.startsWith('/'))) {
    const link = document.createElement('a');
    link.href = data;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // Case 2: Object containing URL, file_url, download_url, link, file, or path
  const targetUrl =
    data.url ||
    data.download_url ||
    data.file_url ||
    data.link ||
    data.file ||
    data.path ||
    data.data?.url ||
    data.data?.download_url ||
    data.data?.file_url ||
    data.data?.link ||
    data.data?.file ||
    data.data?.path ||
    (typeof data.data === 'string' && (data.data.startsWith('http://') || data.data.startsWith('https://') || data.data.startsWith('/')) ? data.data : null);

  if (targetUrl) {
    const link = document.createElement('a');
    link.href = targetUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // Case 3: Blob response
  if (typeof Blob !== 'undefined' && data instanceof Blob) {
    const blobUrl = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', `bag_${fallbackBagId || 'download'}.zip`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
    return;
  }

  // Case 4: Array of items or paths
  const items = Array.isArray(data) ? data : (Array.isArray(data.items) ? data.items : (Array.isArray(data.data?.items) ? data.data.items : null));
  if (items && items.length > 0) {
    items.forEach((item: any) => {
      const itemUrl = item.path || item.url || item.file || item.download_url;
      if (itemUrl) {
        window.open(itemUrl, '_blank');
      }
    });
  }
};

