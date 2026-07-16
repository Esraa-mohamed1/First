import academyApi from '@/lib/academy-api';
import studentApi from '@/lib/student-api';

export const getLandingPageByCourseSlug = async (slug: string): Promise<any> => {
  try {
    const response = await academyApi.get(`landing_pages/${slug}`);
    return response.data.data;
  } catch (error) {
    console.warn('Failed to fetch landing page by course slug:', error);
    return null;
  }
};

export const getStudentLandingPageByCourseSlug = async (slug: string): Promise<any> => {
  try {
    const response = await academyApi.get(`landing_pages`);
    return response.data.data;
  } catch (error) {
    console.warn('Failed to fetch student landing page by course slug:', error);
    return null;
  }
};

export const saveLandingPage = async (payload: {
  template_name: string;
  content: any;
  is_active: boolean;
  course_id: number;
  user_id: number;
}): Promise<any> => {
  try {
    const response = await academyApi.put('landing_pages', payload);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('Failed to save landing page:', error);
    throw error.response?.data || error;
  }
};
