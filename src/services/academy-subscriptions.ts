import api from '@/lib/api';
import { getStoredAuthToken } from '@/lib/auth-storage';
import { ApiResponse } from '@/types/api';
import {
  AcademySubscription,
  RawAcademySubscription
} from '@/types/academy-subscription';

export interface AcademySubscriptionQueryParams {
  page?: number;
  limit?: number;
  package_id?: number | string;
  status?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
  period?: string;
}

export interface SubscriptionStats {
  totalCount: number;
  activeCount: number;
  expiredCount: number;
  trialCount: number;
  pendingCount: number;
  cancelledCount: number;
}

export interface AcademySubscriptionListResponse {
  items: AcademySubscription[];
  stats?: SubscriptionStats; // Optional since we get it from a separate endpoint now
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

const SUPER_ADMIN_API_URL = 'https://api.darab.academy/api/superAdmin';

/**
 * Adapter: Maps raw API response fields into the clean frontend display model.
 */
export function mapRawSubscriptionToDisplayModel(raw: RawAcademySubscription): AcademySubscription {
  // Normalize Status
  let status: 'active' | 'expired' | 'pending' | 'cancelled' | 'trial' = 'active';
  const rawStatus = (raw.status || '').toLowerCase().trim();

  if (rawStatus === 'active' || raw.is_active === 1 || raw.is_active === true) {
    status = 'active';
  } else if (rawStatus === 'expired' || rawStatus === 'ended') {
    status = 'expired';
  } else if (rawStatus === 'trial' || rawStatus === 'free_trial') {
    status = 'trial';
  } else if (rawStatus === 'pending' || rawStatus === 'waiting') {
    status = 'pending';
  } else if (rawStatus === 'cancelled' || rawStatus === 'canceled' || raw.is_active === 0) {
    status = 'cancelled';
  }

  // Localized Status Label
  const statusLabels: Record<string, string> = {
    active: 'نشط',
    expired: 'منتهي',
    pending: 'معلق',
    cancelled: 'ملغي'
  };

  const academyName =
    raw.academy?.academy_name ||
    raw.academy?.name ||
    raw.academy_name ||
    'أكاديمية تعليمية';

  const academyDomain =
    raw.academy?.link_academy ||
    raw.academy?.subdomain ||
    raw.academy?.domain ||
    raw.academy_domain ||
    undefined;

  const userName =
    raw.user?.name ||
    raw.user?.full_name ||
    raw.user_name ||
    'مستخدم';

  const userEmail =
    raw.user?.email ||
    raw.user_email ||
    '—';

  const userPhone =
    raw.user?.phone ||
    raw.user_phone ||
    undefined;

  const courseTitle =
    raw.course?.title ||
    raw.course_title ||
    null;

  const packageName =
    raw.package?.titile ||
    raw.package?.title ||
    raw.package_name ||
    (raw.package_id ? `باقة #${raw.package_id}` : null);

  const startDate =
    raw.start_date ||
    raw.starts_at ||
    raw.created_at ||
    '—';

  const endDate =
    raw.end_date ||
    raw.ends_at ||
    raw.expires_at ||
    '—';

  return {
    id: raw.id,
    academyId: raw.academy_id || raw.academy?.id || raw.id,
    academyName,
    academyLogo: raw.academy?.logo || raw.academy?.logo_url,
    academyDomain,
    userId: raw.user_id || raw.user?.id || 0,
    userName,
    userEmail,
    userPhone,
    courseId: raw.course_id || raw.course?.id || null,
    courseTitle,
    packageName,
    status,
    statusLabel: statusLabels[status] || status,
    startDate,
    endDate,
    price: raw.price !== undefined ? raw.price : (raw.amount !== undefined ? raw.amount : null),
    currency: raw.currency || 'SAR',
    paymentMethod: raw.payment_method || raw.payment_type || null,
    paymentProof: raw.payment_proof || null,
    receipt: raw.receipt || null,
    createdAt: raw.created_at
  };
}

export const getAcademySubscriptionStats = async (params?: Omit<AcademySubscriptionQueryParams, 'page' | 'limit'>): Promise<SubscriptionStats> => {
  try {
    const token = getStoredAuthToken();
    const queryParams: Record<string, any> = {};

    if (params?.search) queryParams.search = params.search;
    if (params?.status && params.status !== 'all') queryParams.status = params.status;
    if (params?.package_id && params.package_id !== 'all') queryParams.package_id = params.package_id;
    if (params?.date_from) queryParams.date_from = params.date_from;
    if (params?.date_to) queryParams.date_to = params.date_to;
    if (params?.period && params.period !== 'all') queryParams.period = params.period;

    const response = await api.get<{
      success?: boolean;
      status?: number;
      message?: string;
      data?: {
        total?: number;
        active?: number;
        expired?: number;
        pending?: number;
        trial?: number;
        cancelled?: number;
      };
    }>('/academy-packages/stats', {
      baseURL: SUPER_ADMIN_API_URL,
      params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });

    const data = response.data?.data;
    return {
      totalCount: Number(data?.total) || 0,
      activeCount: Number(data?.active) || 0,
      expiredCount: Number(data?.expired) || 0,
      pendingCount: Number(data?.pending) || 0,
      trialCount: Number(data?.trial) || 0,
      cancelledCount: Number(data?.cancelled) || 0
    };
  } catch (error) {
    console.error('Failed to fetch academy subscription stats:', error);
    return { totalCount: 0, activeCount: 0, expiredCount: 0, pendingCount: 0, trialCount: 0, cancelledCount: 0 };
  }
};

/**
 * Fetch Academy Subscriptions from Real Super Admin Backend API (/superAdmin/academy-packages)
 */
export async function getAcademySubscriptions(
  params?: AcademySubscriptionQueryParams
): Promise<AcademySubscriptionListResponse> {
  try {
    const token = getStoredAuthToken();
    const response = await api.get<ApiResponse<RawAcademySubscription[]>>('/academy-packages', {
      baseURL: SUPER_ADMIN_API_URL,
      params: {
        ...(params?.search ? { search: params.search } : {}),
        ...(params?.status && params.status !== 'all' ? { status: params.status } : {}),
        ...(params?.package_id && params.package_id !== 'all' ? { package_id: params.package_id } : {}),
        ...(params?.date_from ? { date_from: params.date_from } : {}),
        ...(params?.date_to ? { date_to: params.date_to } : {}),
        ...(params?.period && params.period !== 'all' ? { period: params.period } : {}),
        ...(params?.page ? { page: params.page } : {}),
        ...(params?.limit ? { limit: params.limit } : {})
      },
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });

    let rawData: RawAcademySubscription[] = [];
    if (response.data && (response.data.status || response.data.success)) {
      rawData = Array.isArray(response.data.data) ? response.data.data : [];
    } else if (Array.isArray(response.data)) {
      rawData = response.data;
    } else if (Array.isArray((response.data as any)?.data)) {
      rawData = (response.data as any).data;
    }

    const allMapped = (rawData || []).map(mapRawSubscriptionToDisplayModel);

    const meta = response.data?.meta || (response.data as any)?.pagination;
    const total = meta?.total !== undefined ? meta.total : allMapped.length;
    const page = meta?.current_page !== undefined ? meta.current_page : (params?.page || 1);
    const limit = meta?.per_page !== undefined ? meta.per_page : (params?.limit || 10);
    const totalPages = meta?.last_page !== undefined ? meta.last_page : Math.max(1, Math.ceil(total / limit));

    return {
      items: allMapped,
      total,
      page,
      totalPages,
      limit
    };
  } catch (error: any) {
    console.error('Failed to fetch academy subscriptions from API:', error);
    throw error?.response?.data || error;
  }
}

/**
 * Approve a pending academy subscription (POST /superAdmin/academy-packages/{id}/approve)
 */
export const approveAcademySubscription = async (id: number | string): Promise<ApiResponse<any>> => {
  try {
    const token = getStoredAuthToken();
    const response = await api.post<ApiResponse<any>>(`/academy-packages/${id}/approve`, {}, {
      baseURL: SUPER_ADMIN_API_URL,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  } catch (error: any) {
    console.error(`Failed to approve academy subscription ${id}:`, error);
    throw error?.response?.data || error;
  }
};

