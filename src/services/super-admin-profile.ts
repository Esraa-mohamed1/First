import api from '@/lib/api';
import { getStoredAuthToken } from '@/lib/auth-storage';

const SUPER_ADMIN_API_URL =
    'https://api.darab.academy/api/superAdmin';

export interface SuperAdminProfile {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    profile_image: string | null;
    created_at: string;
    updated_at: string;
}

export interface UpdateSuperAdminProfilePayload {
    name: string;
    email: string;
}

export const getSuperAdminProfile = async (): Promise<SuperAdminProfile> => {
    const token = getStoredAuthToken();

    const response = await api.get<SuperAdminProfile>('/me', {
        baseURL: SUPER_ADMIN_API_URL,
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    return response.data;
};

export const updateSuperAdminProfile = async (
    payload: UpdateSuperAdminProfilePayload
): Promise<SuperAdminProfile> => {
    const token = getStoredAuthToken();

    const response = await api.post<{
        success: boolean;
        status: number;
        message: string;
        data: SuperAdminProfile;
    }>('/update-profile', payload, {
        baseURL: SUPER_ADMIN_API_URL,
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    return response.data.data;
};