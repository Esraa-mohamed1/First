export type AcademySubscriptionStatus = 'active' | 'expired' | 'pending' | 'canceled' | 'trial' | string;

/**
 * Raw structure from backend response (accommodates various potential backend formats)
 */
export interface RawAcademySubscription {
  id: number | string;
  academy_id?: number | string;
  academy_name?: string;
  academy?: {
    id?: number | string;
    name?: string;
    academy_name?: string;
    logo?: string;
    logo_url?: string;
    link_academy?: string;
    subdomain?: string;
    domain?: string;
  };
  user_id?: number | string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  user?: {
    id?: number | string;
    name?: string;
    full_name?: string;
    email?: string;
    phone?: string;
    avatar?: string;
  };
  course_id?: number | string;
  course_title?: string;
  course?: {
    id?: number | string;
    title?: string;
    slug?: string;
  };
  package_id?: number | string;
  package_name?: string;
  package?: {
    id?: number | string;
    titile?: string;
    title?: string;
  };
  status?: AcademySubscriptionStatus;
  is_active?: boolean | number;
  start_date?: string;
  starts_at?: string;
  end_date?: string;
  ends_at?: string;
  expires_at?: string;
  price?: number | string;
  amount?: number | string;
  currency?: string;
  payment_method?: string;
  payment_type?: string;
  receipt?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

/**
 * Clean Frontend Display Model for Super Admin UI
 */
export interface AcademySubscription {
  id: number | string;
  academyId: number | string;
  academyName: string;
  academyLogo?: string;
  academyDomain?: string;
  userId: number | string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  courseId?: number | string | null;
  courseTitle?: string | null;
  packageName?: string | null;
  status: 'active' | 'expired' | 'pending' | 'canceled' | 'trial';
  statusLabel: string;
  startDate: string;
  endDate: string;
  price?: number | string | null;
  currency: string;
  paymentMethod?: string | null;
  receipt?: string | null;
  createdAt?: string;
}

export interface SubscriptionStats {
  totalCount: number;
  activeCount: number;
  expiredCount: number;
  pendingCount: number;
  trialCount: number;
}

export interface AcademySubscriptionQueryParams {
  search?: string;
  status?: 'all' | 'active' | 'expired' | 'pending' | 'canceled' | 'trial';
  page?: number;
  limit?: number;
}

export interface AcademySubscriptionListResponse {
  items: AcademySubscription[];
  stats: SubscriptionStats;
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}
