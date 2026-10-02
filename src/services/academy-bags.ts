import academyApi from '@/lib/academy-api';
import { ApiResponse } from '@/types/api';
import {
  BagApiItem,
  CreateBagPayload,
  BagCategory,
  BagPurchaseItem,
  BagPurchasesStats,
  BagPurchasesQueryParams,
  BagPurchasesListResponse,
} from '@/types/bags';

/* ─────────────────────────────────────────────────────────
   Academy Dashboard Management API Endpoints (Base URL: /api/academy)
───────────────────────────────────────────────────────── */

/** Helper: Build FormData for bag creation / update for academy dashboard */
function buildBagFormData(payload: CreateBagPayload): FormData {
  const fd = new FormData();

  // Required field — backend will reject without this
  if (payload.title != null && payload.title !== '') {
    fd.append('title', payload.title);
  }

  // Optional scalar fields — append only if defined and not null
  if (payload.short_description !== undefined && payload.short_description !== null)
    fd.append('short_description', payload.short_description);

  if (payload.description !== undefined && payload.description !== null)
    fd.append('description', payload.description);

  if (payload.category_name !== undefined && payload.category_name !== null)
    fd.append('category_name', payload.category_name);

  if (payload.category_bag_id !== undefined && payload.category_bag_id !== null)
    fd.append('category_bag_id', String(payload.category_bag_id));

  if (payload.type_price !== undefined && payload.type_price !== null)
    fd.append('type_price', payload.type_price);

  if (payload.price !== undefined && payload.price !== null)
    fd.append('price', String(payload.price));

  if (payload.discount_price !== undefined && payload.discount_price !== null)
    fd.append('discount_price', String(payload.discount_price));

  if (payload.currency !== undefined && payload.currency !== null)
    fd.append('currency', payload.currency);

  if (payload.is_active !== undefined && payload.is_active !== null)
    fd.append('is_active', String(payload.is_active));

  if (payload.count_download !== undefined && payload.count_download !== null)
    fd.append('count_download', String(payload.count_download));

  if (payload.download_type !== undefined && payload.download_type !== null)
    fd.append('download_type', payload.download_type);

  if (payload.download_limit !== undefined && payload.download_limit !== null)
    fd.append('download_limit', String(payload.download_limit));

  const isFile = (v: any): v is File => typeof File !== 'undefined' && typeof File === 'function' && v instanceof File;

  // Main Cover Image: File object = upload binary file
  // Remote HTTP/HTTPS string URLs are omitted in edit mode so backend does not overwrite existing stored image
  if (isFile(payload.image)) {
    fd.append('image', payload.image);
  } else if (
    typeof payload.image === 'string' &&
    payload.image &&
    !payload.image.startsWith('blob:') &&
    !payload.image.startsWith('data:') &&
    !payload.image.startsWith('http://') &&
    !payload.image.startsWith('https://')
  ) {
    fd.append('image', payload.image);
  }

  // Bag Gallery Images: array of File objects or newly modified non-remote strings
  if (Array.isArray(payload.gallery) && payload.gallery.length > 0) {
    let gIdx = 0;
    payload.gallery.forEach((gItem) => {
      if (isFile(gItem)) {
        fd.append(`gallery[${gIdx}]`, gItem);
        gIdx++;
      } else if (
        typeof gItem === 'string' &&
        gItem &&
        !gItem.startsWith('blob:') &&
        !gItem.startsWith('data:') &&
        !gItem.startsWith('http://') &&
        !gItem.startsWith('https://')
      ) {
        fd.append(`gallery[${gIdx}]`, gItem);
        gIdx++;
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
      if (isFile(item.file)) {
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

/** Fetch bag purchase stats from /api/academy/bag_purchases/stats */
export const getBagPurchasesStats = async (
  bagId?: number | string
): Promise<BagPurchasesStats> => {
  try {
    const params: Record<string, any> = {};
    if (bagId !== undefined && bagId !== null && bagId !== '') {
      params.bag_id = bagId;
    }

    const response = await academyApi.get<any>('bag_purchases/stats', {
      params: Object.keys(params).length > 0 ? params : undefined,
    });

    const data = response.data?.data ?? response.data ?? {};
    return {
      pending_review: Number(data.pending_review) || 0,
      accepted_active: Number(data.accepted_active) || 0,
      total_requests: Number(data.total_requests) || 0,
      total_downloads: Number(data.total_downloads) || 0,
    };
  } catch (error: any) {
    console.error('Failed to fetch bag purchases stats:', error);
    throw error;
  }
};

/** Fetch academy bag purchases/subscriptions from /api/academy/bag_purchases */
export const getAcademyBagPurchases = async (
  params?: BagPurchasesQueryParams
): Promise<BagPurchasesListResponse> => {
  try {
    const queryParams: Record<string, any> = {};

    if (params?.bag_id !== undefined && params?.bag_id !== null && params?.bag_id !== '') {
      queryParams.bag_id = params.bag_id;
    }
    if (params?.page !== undefined && params?.page !== null) {
      queryParams.page = params.page;
    }
    if (params?.limit !== undefined && params?.limit !== null) {
      queryParams.limit = params.limit;
      queryParams.per_page = params.limit;
    }
    if (params?.status && params.status !== 'all') {
      queryParams.status = params.status;
    }
    if (params?.search && params.search.trim() !== '') {
      queryParams.search = params.search.trim();
    }

    const response = await academyApi.get<any>('bag_purchases', {
      params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
    });

    const resData = response.data;
    let rawList: any[] = [];

    if (Array.isArray(resData)) {
      rawList = resData;
    } else if (resData?.data && Array.isArray(resData.data)) {
      rawList = resData.data;
    } else if (resData?.data?.data && Array.isArray(resData.data.data)) {
      rawList = resData.data.data;
    } else if (Array.isArray(resData?.items)) {
      rawList = resData.items;
    }

    const meta =
      resData?.meta ||
      resData?.pagination ||
      (resData?.data && typeof resData.data === 'object' && !Array.isArray(resData.data) ? resData.data : null) ||
      resData;

    const requestedPage = params?.page || 1;
    const requestedLimit = params?.limit || 10;

    const total =
      meta?.total !== undefined && typeof meta.total === 'number'
        ? meta.total
        : (resData?.total !== undefined && typeof resData.total === 'number' ? resData.total : rawList.length);

    const currentPage =
      meta?.current_page !== undefined
        ? Number(meta.current_page)
        : (resData?.current_page !== undefined ? Number(resData.current_page) : requestedPage);

    const perPage =
      meta?.per_page !== undefined
        ? Number(meta.per_page)
        : (resData?.per_page !== undefined ? Number(resData.per_page) : requestedLimit);

    const lastPageFromMeta =
      meta?.last_page !== undefined
        ? Number(meta.last_page)
        : (resData?.last_page !== undefined ? Number(resData.last_page) : undefined);

    const totalPages =
      lastPageFromMeta !== undefined
        ? lastPageFromMeta
        : Math.max(1, Math.ceil(total / (perPage || 10)));

    return {
      items: rawList as BagPurchaseItem[],
      total,
      page: currentPage,
      totalPages,
      limit: perPage,
    };
  } catch (error: any) {
    console.warn('Failed to fetch academy/bag_purchases, trying fallback endpoints:', error);
    try {
      const queryParams: Record<string, any> = {};
      if (params?.bag_id) queryParams.bag_id = params.bag_id;
      if (params?.page) queryParams.page = params.page;
      if (params?.limit) queryParams.limit = params.limit;

      const fb1 = await academyApi.get<any>('bag-purchases', {
        params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
      });
      const rawList = extractList<BagPurchaseItem>(fb1.data);
      return {
        items: rawList,
        total: rawList.length,
        page: params?.page || 1,
        totalPages: 1,
        limit: params?.limit || 10,
      };
    } catch (e1) {
      return {
        items: [],
        total: 0,
        page: 1,
        totalPages: 1,
        limit: 10,
      };
    }
  }
};

/** Update status of a bag purchase in academy dashboard (approve/accept or reject) */
export const updateBagPurchaseStatus = async (
  id: number | string,
  status: 'accepted' | 'approved' | 'rejected' | string,
  rejection_reason?: string
): Promise<any> => {
  try {
    let response;
    try {
      response = await academyApi.post(`bag_purchases/${id}/status`, { status, rejection_reason });
    } catch (e1) {
      try {
        response = await academyApi.post(`bag_purchases/${id}`, { _method: 'PUT', status, rejection_reason });
      } catch (e2) {
        response = await academyApi.put(`bag_purchases/${id}`, { status, rejection_reason });
      }
    }
    return response.data?.data || response.data;
  } catch (error: any) {
    console.error(`Failed to update status for bag purchase ${id}:`, error);
    throw error.response?.data || error;
  }
};
