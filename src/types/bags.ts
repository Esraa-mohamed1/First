export interface BagItemDetail {
  id: number;
  bag_id?: number;
  path: string;
  type: string;
  created_at?: string;
  updated_at?: string;
}

export interface BagApiItem {
  id: number;
  user_id?: number;
  title: string;
  short_description?: string;
  description?: string;
  image?: string;
  category_name?: string;
  /** "free" | "paid" */
  type_price?: string;
  price?: number | string;
  discount_price?: number | string | null;
  count_download?: number | null;
  count_view?: number | null;
  /** 1/true = active (published), 0/false = inactive (draft) */
  is_active?: number | boolean;
  /** Array of item objects or course IDs included in this bag */
  items?: BagItemDetail[] | any[];
  /** Array of gallery images */
  gallery?: string[] | any[];
  /** Array of instructor_receiver_account IDs for accepted payment methods */
  payment_info_ids?: number[];
  payment_infos?: any[];
  created_at?: string;
  updated_at?: string;
}

export interface BagItemInput {
  type: string;
  file: File | string | number;
}

export interface CreateBagPayload {
  title: string;
  short_description?: string;
  description?: string;
  /** File object for main image upload, or URL string for existing image */
  image?: File | string | null;
  /** Array of File objects or URL strings for the bag gallery */
  gallery?: (File | string)[];
  category_name?: string;
  type_price?: 'free' | 'paid' | string;
  price?: number | string;
  discount_price?: number | string;
  is_active?: number | boolean;
  items?: BagItemInput[];
  payment_info_ids?: number[];
}
