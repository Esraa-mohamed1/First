import academyApi from '@/lib/academy-api';
import { ApiResponse } from '@/types/api';
import {
  BagApiItem,
  CreateBagPayload,
  BagCategory,
  BagPurchaseItem,
} from '@/types/bags';

/* ─────────────────────────────────────────────────────────
   Academy Dashboard Management API Endpoints (Base URL: /api/academy)
───────────────────────────────────────────────────────── */

/** Helper: Build FormData for bag creation / update for academy dashboard */
function buildBagFormData(payload: CreateBagPayload): FormData {
  const fd = new FormData();

  // Required field — backend will reject without this
  fd.append('title', payload.title);

  // Optional scalar fields
  if (payload.short_description != null)
    fd.append('short_description', payload.short_description);

  if (payload.description != null)
    fd.append('description', payload.description);

  if (payload.category_name != null)
    fd.append('category_name', payload.category_name);

  if (payload.category_bag_id != null)
    fd.append('category_bag_id', String(payload.category_bag_id));

  if (payload.type_price != null)
    fd.append('type_price', payload.type_price);

  if (payload.price != null)
    fd.append('price', String(payload.price));

  if (payload.discount_price != null)
    fd.append('discount_price', String(payload.discount_price));

  if (payload.is_active != null)
    fd.append('is_active', String(payload.is_active));

  if (payload.count_download !== undefined && payload.count_download !== null)
    fd.append('count_download', String(payload.count_download));

  if (payload.download_type != null)
    fd.append('download_type', payload.download_type);

  if (payload.download_limit !== undefined && payload.download_limit !== null)
    fd.append('download_limit', String(payload.download_limit));

  // Main Cover Image: File object = upload binary file; string = existing URL
  if (payload.image instanceof File) {
    fd.append('image', payload.image);
  } else if (typeof payload.image === 'string' && payload.image && !payload.image.startsWith('blob:') && !payload.image.startsWith('data:')) {
    fd.append('image', payload.image);
  }

  // Bag Gallery Images: array of File objects or URL strings
  if (Array.isArray(payload.gallery) && payload.gallery.length > 0) {
    payload.gallery.forEach((gItem, idx) => {
      if (gItem instanceof File) {
        fd.append(`gallery[${idx}]`, gItem);
      } else if (typeof gItem === 'string' && gItem && !gItem.startsWith('blob:') && !gItem.startsWith('data:')) {
        fd.append(`gallery[${idx}]`, gItem);
      }
    });
  }

  // payment_info_ids[] — only sent when non-empty to avoid backend validation errors
  if (Array.isArray(payload.payment_info_ids) && payload.payment_info_ids.length > 0) {
    payload.payment_info_ids.forEach((id, idx) => {
      fd.append(`payment_info_ids[${idx}]`, String(id));
    });
  }

  // items[] — array of objects containing type and file
  if (Array.isArray(payload.items) && payload.items.length > 0) {
    payload.items.forEach((item, idx) => {
      if (item.type != null) {
        fd.append(`items[${idx}][type]`, String(item.type));
      }
      if (item.file instanceof File) {
        fd.append(`items[${idx}][file]`, item.file);
      } else if (item.file != null) {
        fd.append(`items[${idx}][file]`, String(item.file));
      }
    });
  }

  return fd;
}

/** Helper to robustly extract arrays from direct arrays, { data: [...] } or Laravel paginated { data: { data: [...] } } */
function extractList<T>(resData: any): T[] {
  if (!resData) return [];
  if (Array.isArray(resData)) return resData;
  if (Array.isArray(resData.data)) return resData.data;
  if (resData.data && Array.isArray(resData.data.data)) return resData.data.data;
  return [];
}

/** Fetch all bags created for the academy from /api/academy/bags */
export const getAcademyBags = async (): Promise<BagApiItem[]> => {
  try {
    const response = await academyApi.get<any>('bags');
    return extractList<BagApiItem>(response.data);
  } catch (error: any) {
    console.error('Failed to fetch academy bags:', error);
    return [];
  }
};

/** Fetch a single bag by ID for academy dashboard from /api/academy/bags/:id */
export const getAcademyBag = async (id: number | string): Promise<BagApiItem | null> => {
  try {
    const response = await academyApi.get<any>(`bags/${id}`);
    return response.data?.data ?? response.data;
  } catch (error: any) {
    console.error(`Failed to fetch academy bag ${id}:`, error);
    return null;
  }
};

/** Create a new bag — submits multipart/form-data to /api/academy/bags */
export const createBag = async (payload: CreateBagPayload): Promise<BagApiItem> => {
  try {
    const fd = buildBagFormData(payload);

    const response = await academyApi.post<ApiResponse<BagApiItem>>('bags', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.data;
  } catch (error: any) {
    console.error('Failed to create bag in academy:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update an existing bag in academy.
 * Uses POST + _method=PUT for multipart compatibility.
 */
export const updateBag = async (
  id: number,
  payload: CreateBagPayload
): Promise<BagApiItem> => {
  try {
    const fd = buildBagFormData(payload);
    fd.append('_method', 'PUT');

    const response = await academyApi.post<ApiResponse<BagApiItem>>(`bags/${id}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.data;
  } catch (error: any) {
    console.error(`Failed to update academy bag ${id}:`, error);
    throw error.response?.data || error;
  }
};

/** Delete a bag by ID from /api/academy/bags/:id */
export const deleteBag = async (id: number): Promise<void> => {
  try {
    await academyApi.delete(`bags/${id}`);
  } catch (error: any) {
    console.error(`Failed to delete academy bag ${id}:`, error);
    throw error.response?.data || error;
  }
};

/** Fetch all bag categories from /api/academy/category_bags */
export const getBagCategories = async (): Promise<BagCategory[]> => {
  try {
    const response = await academyApi.get<any>('category_bags');
    return extractList<BagCategory>(response.data);
  } catch (error: any) {
    console.error('Failed to fetch bag categories:', error);
    return [];
  }
};

/** Create a new bag category via POST /api/academy/category_bags */
export const createBagCategory = async (name: string): Promise<BagCategory> => {
  try {
    const response = await academyApi.post<ApiResponse<BagCategory>>('category_bags', { name });
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to create bag category:', error);
    throw error.response?.data || error;
  }
};

/** Fetch academy bag purchases/subscriptions from /api/academy/bag_purchases */
export const getAcademyBagPurchases = async (): Promise<BagPurchaseItem[]> => {
  try {
    const response = await academyApi.get<any>('bag_purchases');
    return extractList<BagPurchaseItem>(response.data);
  } catch (error: any) {
    console.warn('Failed to fetch academy/bag_purchases, trying fallback endpoints:', error);
    try {
      const fb1 = await academyApi.get<any>('bag-purchases');
      return extractList<BagPurchaseItem>(fb1.data);
    } catch (e1) {
      return [];
    }
  }
};
