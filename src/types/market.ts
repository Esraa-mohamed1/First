/**
 * Market (متجر الحقائب) Type Definitions
 * Clean, well-typed schema for digital product bags and wizard form state.
 */

// Visibility Status Options for a Bag
export type BagVisibility = 'published' | 'draft' | 'hidden';

// Download Policy Options
export type DownloadPolicyType = 'unlimited' | 'limited';

// Individual Digital Bag / Package Item
export interface BagItem {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  category: string;
  instructorName: string;
  courseCount: number; // e.g. 20 فيديو وملف or 20 دورة
  rating: number; // e.g. 4.9
  price: number; // Regular price in SAR
  discountPrice?: number; // Optional discounted price
  isFree: boolean; // Is it a free product
  paymentMethods: string[]; // Selected payment methods e.g. ['instapay', 'vodafone_cash']
  downloadPolicy: DownloadPolicyType;
  downloadLimit?: number; // Maximum downloads if limited
  downloadExpiry?: string; // Expiry date if limited
  visibility: BagVisibility;
  createdAt: string;
}

// Form State used in the 3-step creation modal
export interface BagFormState {
  title: string;
  description: string;
  coverImage: string;
  category: string;
  instructorName: string;
  isFree: boolean;
  price: number;
  discountPrice: number;
  paymentMethods: string[];
  downloadPolicy: DownloadPolicyType;
  downloadLimit: number;
  downloadExpiry: string;
  visibility: BagVisibility;
  selectedCourseIds: number[];
}
