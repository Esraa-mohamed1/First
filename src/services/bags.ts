import academyApi from '@/lib/academy-api';
import { ApiResponse } from '@/types/api';

/* ─────────────────────────────────────────────────────────
   API Payload Types
   Maps exactly to the backend schema provided:
   Required:  title
   Optional:  short_description, description, image, category_name,
              type_price, price, discount_price, is_active,
              items[], payment_info_ids[]
───────────────────────────────────────────────────────── */
import { BagItemDetail, BagApiItem, BagItemInput, CreateBagPayload } from '@/types/bags';
export type { BagItemDetail, BagApiItem, BagItemInput, CreateBagPayload };

/* ─────────────────────────────────────────────────────────
   Helper: Build FormData for bag creation / update.
   Uses multipart/form-data so that image files upload correctly.
───────────────────────────────────────────────────────── */
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

  if (payload.type_price != null)
    fd.append('type_price', payload.type_price);

  if (payload.price != null)
    fd.append('price', String(payload.price));

  if (payload.discount_price != null)
    fd.append('discount_price', String(payload.discount_price));

  if (payload.is_active != null)
    fd.append('is_active', String(payload.is_active));

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

/* ─────────────────────────────────────────────────────────
   API Functions
───────────────────────────────────────────────────────── */

/** Fetch all bags for the current academy */
export const getBags = async (): Promise<BagApiItem[]> => {
  try {
    const response = await academyApi.get<ApiResponse<BagApiItem[]>>('bags');
    return response.data.data || [];
  } catch (error: any) {
    console.error('Failed to fetch bags:', error);
    return [];
  }
};

/** Fetch a single bag by ID */
export const getBag = async (id: number | string): Promise<BagApiItem | null> => {
  try {
    const response = await academyApi.get<ApiResponse<BagApiItem>>(`bags/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.error(`Failed to fetch bag ${id}:`, error);
    return null;
  }
};

/** Create a new bag — submits multipart/form-data */
export const createBag = async (payload: CreateBagPayload): Promise<BagApiItem> => {
  try {
    const fd = buildBagFormData(payload);

    const response = await academyApi.post<ApiResponse<BagApiItem>>('bags', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.data;
  } catch (error: any) {
    console.error('Failed to create bag:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update an existing bag.
 * Uses POST + _method=PUT for multipart compatibility (Laravel convention).
 */
export const updateBag = async (
  id: number,
  payload: CreateBagPayload
): Promise<BagApiItem> => {
  try {
    const fd = buildBagFormData(payload);
    fd.append('_method', 'PUT'); // Laravel method override for multipart PUT

    const response = await academyApi.post<ApiResponse<BagApiItem>>(`bags/${id}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.data;
  } catch (error: any) {
    console.error(`Failed to update bag ${id}:`, error);
    throw error.response?.data || error;
  }
};

/** Delete a bag by ID */
export const deleteBag = async (id: number): Promise<void> => {
  try {
    await academyApi.delete(`bags/${id}`);
  } catch (error: any) {
    console.error(`Failed to delete bag ${id}:`, error);
    throw error.response?.data || error;
  }
};
