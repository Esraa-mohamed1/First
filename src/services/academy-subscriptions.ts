import api from '@/lib/api';
import { getStoredAuthToken } from '@/lib/auth-storage';
import { ApiResponse } from '@/types/api';
import {
  AcademySubscription,
  RawAcademySubscription,
  AcademySubscriptionQueryParams,
  AcademySubscriptionListResponse,
  SubscriptionStats
} from '@/types/academy-subscription';

const SUPER_ADMIN_API_URL = 'https://api.darab.academy/api/superAdmin';

/**
 * Adapter: Maps raw API response fields into the clean frontend display model.
 */
export function mapRawSubscriptionToDisplayModel(raw: RawAcademySubscription): AcademySubscription {
  // Normalize Status
  let status: 'active' | 'expired' | 'pending' | 'canceled' | 'trial' = 'active';
  const rawStatus = (raw.status || '').toLowerCase().trim();

  if (rawStatus === 'active' || raw.is_active === 1 || raw.is_active === true) {
    status = 'active';
  } else if (rawStatus === 'expired' || rawStatus === 'ended') {
    status = 'expired';
  } else if (rawStatus === 'trial' || rawStatus === 'free_trial') {
    status = 'trial';
  } else if (rawStatus === 'pending' || rawStatus === 'waiting') {
    status = 'pending';
  } else if (rawStatus === 'canceled' || rawStatus === 'cancelled' || raw.is_active === 0) {
    status = 'canceled';
  }

  // Localized Status Label
  const statusLabels: Record<string, string> = {
    active: 'نشط',
    expired: 'منتهي',
    trial: 'فترة تجريبية',
    pending: 'معلق',
    canceled: 'ملغي'
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
    receipt: raw.receipt || null,
    createdAt: raw.created_at
  };
}

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

    // Compute stats from returned data
    const stats: SubscriptionStats = {
      totalCount: allMapped.length,
      activeCount: allMapped.filter((i) => i.status === 'active').length,
      expiredCount: allMapped.filter((i) => i.status === 'expired').length,
      trialCount: allMapped.filter((i) => i.status === 'trial').length,
      pendingCount: allMapped.filter((i) => i.status === 'pending').length
    };

    const meta = response.data?.meta || (response.data as any)?.pagination;
    const total = meta?.total !== undefined ? meta.total : allMapped.length;
    const page = meta?.current_page !== undefined ? meta.current_page : (params?.page || 1);
    const limit = meta?.per_page !== undefined ? meta.per_page : (params?.limit || 10);
    const totalPages = meta?.last_page !== undefined ? meta.last_page : Math.max(1, Math.ceil(total / limit));

    return {
      items: allMapped,
      stats,
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
