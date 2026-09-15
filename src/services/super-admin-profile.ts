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
    name?: string;
    email?: string;
    profile_image?: File | string | null;
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
    payload: UpdateSuperAdminProfilePayload | FormData
): Promise<SuperAdminProfile> => {
    const token = getStoredAuthToken();

    let data: any = payload;
    const headers: Record<string, string> = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    if (!(payload instanceof FormData) && payload.profile_image instanceof File) {
        const formData = new FormData();
        if (payload.name) formData.append('name', payload.name);
        if (payload.email) formData.append('email', payload.email);
        formData.append('profile_image', payload.profile_image);
        data = formData;
        headers['Content-Type'] = 'multipart/form-data';
    } else if (payload instanceof FormData) {
        headers['Content-Type'] = 'multipart/form-data';
    }

    const response = await api.post<{
        success: boolean;
        status: number;
        message: string;
        data: SuperAdminProfile;
    }>('/update-profile', data, {
        baseURL: SUPER_ADMIN_API_URL,
        headers,
    });

    return response.data.data;
};