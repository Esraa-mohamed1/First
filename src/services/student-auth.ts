import studentApi from '@/lib/student-api';
import { ApiResponse } from '@/types/api';

export const registerStudent = async (payload: any): Promise<ApiResponse<any>> => {
  try {
    const response = await studentApi.post<ApiResponse<any>>('/auth/register', payload);
    return response.data;
  } catch (error: any) {
    console.error('Failed to register student:', error);
    throw error.response?.data || error;
  }
};

export const getStudentProfileStatus = async (): Promise<any> => {
  try {
    const response = await studentApi.get<any>('/me');
    return response.data;
  } catch (error: any) {
    console.error('Failed to get student profile status:', error);
    throw error.response?.data || error;
  }
};

export const getStudentProfile = async (): Promise<any> => {
  try {
    const response = await studentApi.get<ApiResponse<any>>('profile');
    return response.data;
  } catch (error: any) {
    console.error('Failed to get student profile:', error);
    throw error.response?.data || error;
  }
};

export const updateStudentProfile = async (payload: any): Promise<any> => {
  try {
    const response = await studentApi.post<ApiResponse<any>>('profile', payload);
    return response.data;
  } catch (error: any) {
    console.error('Failed to update student profile:', error);
    throw error.response?.data || error;
  }
};

export function parsePipelineData(dataRaw: any): any {
  if (!dataRaw) return null;
  let mapObj: Record<string, any> = {};
  if (Array.isArray(dataRaw)) {
    dataRaw.forEach((item: any) => {
      if (item && item.key) {
        mapObj[item.key] = item.value;
      }
    });
  } else if (typeof dataRaw === 'object') {
    mapObj = { ...dataRaw };
  }

  const siteName = mapObj.site_name || mapObj.academy_name || mapObj.name || mapObj.site_title || '';
  const siteEmail = mapObj.site_email || mapObj.email || mapObj.academy_email || '';
  const sitePhone = mapObj.site_phone || mapObj.academy_phone || mapObj.phone || '';
  const academyType = mapObj.academy_type || mapObj.role || mapObj.type || mapObj.account_type || '';
  const logo = mapObj.site_logo || mapObj.logo || mapObj.logo_url || '';

  return {
    ...mapObj,
    site_name: siteName,
    academy_name: siteName,
    name: siteName,
    site_email: siteEmail,
    email: siteEmail,
    site_phone: sitePhone,
    phone: sitePhone,
    academy_type: academyType,
    role: academyType,
    type: academyType,
    logo: logo
  };
}

let myAcademyInFlightPromise: Promise<any> | null = null;

export const getMyAcademyProfile = async (): Promise<any> => {
  if (myAcademyInFlightPromise) {
    return myAcademyInFlightPromise;
  }

  myAcademyInFlightPromise = (async () => {
    try {
      const response = await studentApi.get<any>('my-academy');
      const rawData = response.data?.data ?? response.data;
      const data = parsePipelineData(rawData);
      if (data && typeof window !== 'undefined') {
        const info = {
          name: data.site_name || data.academy_name || data.name || '',
          logo: data.logo || data.logo_url || '',
          email: data.site_email || data.email || '',
          phone: data.site_phone || data.academy_phone || data.phone || '',
          role: data.academy_type || data.role || data.type || data.account_type || ''
        };
        localStorage.setItem('darab_academy_profile', JSON.stringify(info));
        localStorage.setItem('darab_academy_profile_full', JSON.stringify(data));
        if (info.role) {
          localStorage.setItem('darab_academy_role', info.role);
        }
        window.dispatchEvent(new CustomEvent('academy-profile-updated', { detail: info }));
      }
      return data;
    } catch (error: any) {
      try {
        const altResponse = await studentApi.get<any>('my_academy');
        const rawData = altResponse.data?.data ?? altResponse.data;
        const data = parsePipelineData(rawData);
        if (data && typeof window !== 'undefined') {
          const info = {
            name: data.site_name || data.academy_name || data.name || '',
            logo: data.logo || data.logo_url || '',
            email: data.site_email || data.email || '',
            phone: data.site_phone || data.academy_phone || data.phone || '',
            role: data.academy_type || data.role || data.type || data.account_type || ''
          };
          localStorage.setItem('darab_academy_profile', JSON.stringify(info));
          localStorage.setItem('darab_academy_profile_full', JSON.stringify(data));
          if (info.role) {
            localStorage.setItem('darab_academy_role', info.role);
          }
          window.dispatchEvent(new CustomEvent('academy-profile-updated', { detail: info }));
        }
        return data;
      } catch (e) {
        console.error('Failed to get my academy profile under user base URL:', error);
        return null;
      }
    } finally {
      myAcademyInFlightPromise = null;
    }
  })();

  return myAcademyInFlightPromise;
};

