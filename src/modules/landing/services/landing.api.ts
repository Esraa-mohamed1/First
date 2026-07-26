import academyApi from '@/lib/academy-api';
import studentApi from '@/lib/student-api';

export const getLandingPageByCourseSlug = async (slug: string, courseId?: number | string): Promise<any> => {
  try {
    const response = await academyApi.get(`landing_pages`);
    const list = response.data?.data || response.data;
    if (Array.isArray(list)) {
      if (courseId) {
        const found = list.find((item: any) => String(item.course_id) === String(courseId));
        if (found) return found;
      }
      const foundBySlug = list.find((item: any) => item.slug === slug || (item.course && item.course.slug === slug));
      if (foundBySlug) return foundBySlug;
      if (list.length > 0) return list[0];
    }
  } catch (e) {
    console.error('Failed to get landing page by slug:', e);
  }
  return null;
};

export const getStudentLandingPageByCourseSlug = async (slug: string, courseId?: number | string): Promise<any> => {
  try {
    const response = await studentApi.get(`landing_pages`);
    const list = response.data?.data || response.data;
    if (Array.isArray(list)) {
      if (courseId) {
        const found = list.find((item: any) => String(item.course_id) === String(courseId));
        if (found) return found;
      }
      const foundBySlug = list.find((item: any) => item.slug === slug || (item.course && item.course.slug === slug));
      if (foundBySlug) return foundBySlug;
    }
  } catch (e) {
    console.error('Failed to get student landing page by slug:', e);
  }
  return null;
};

export const createLandingPage = async (payload: {
  template_name: string;
  content: any;
  is_active: boolean;
  course_id: number;
  user_id: number;
}): Promise<any> => {
  try {
    const response = await academyApi.post('landing_pages', payload);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('Failed to create landing page:', error);
    throw error.response?.data || error;
  }
};

export const updateLandingPage = async (payload: {
  id?: number | string;
  template_name: string;
  content: any;
  is_active: boolean;
  course_id: number;
  user_id: number;
}): Promise<any> => {
  const { id, ...body } = payload;
  if (!id) throw new Error('Landing page ID is required for update');
  try {
    const response = await academyApi.put(`landing_pages/${id}`, body);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('Failed to update landing page:', error);
    throw error.response?.data || error;
  }
};

export const saveLandingPage = updateLandingPage;

export const getLandingPagesList = async (): Promise<any[]> => {
  try {
    const response = await academyApi.get('landing_pages');
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error('Failed to fetch landing pages list:', error);
    return [];
  }
};

export const deleteLandingPage = async (id: string | number): Promise<any> => {
  try {
    const response = await academyApi.delete(`landing_pages/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to delete landing page via API:', error);
    throw error.response?.data || error;
  }
};

