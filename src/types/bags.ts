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
  category_bag_id?: number | string;
  /** "free" | "paid" */
  type_price?: string;
  price?: number | string;
  discount_price?: number | string | null;
  count_download?: number | null;
  count_view?: number | null;
  /** "published" | "active" | "draft" */
  status?: string;
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
  category_bag_id?: number | string;
  type_price?: 'free' | 'paid' | string;
  price?: number | string;
  discount_price?: number | string;
  is_active?: number | boolean;
  count_download?: number | string | null;
  download_type?: 'unlimited' | 'limited' | string;
  download_limit?: number | string | null;
  items?: BagItemInput[];
  payment_info_ids?: number[];
}

export interface BagCategory {
  id: number;
  name: string;
  is_active?: number | boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PurchaseBagPayload {
  bag_id: number | string;
  payment_info_id?: number | string;
  receipt?: File | string | null;
  notes?: string;
}

export interface BagPurchaseItem {
  id: number;
  user_id?: number;
  user_name?: string;
  user_email?: string;
  student_name?: string;
  student_email?: string;
  bag_id?: number;
  bag_title?: string;
  bag?: BagApiItem;
  payment_info_id?: number;
  payment_info?: any;
  payment_method?: any;
  receipt?: string;
  receipt_file?: string;
  status?: string; // 'pending' | 'accepted' | 'approved' | 'rejected'
  created_at?: string;
  updated_at?: string;
  price?: number | string;
  amount?: number | string;
  notes?: string;
}
