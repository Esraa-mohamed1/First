import academyApi from '@/lib/academy-api';
import studentApi from '@/lib/student-api';

export const getLandingPageByCourseSlug = async (slug: string, courseId?: number | string): Promise<any> => {
  try {
    const response = await academyApi.get(`landing_pages/${slug}`);
    if (response.data.data) {
      return response.data.data;
    }
  } catch (error) {
    console.warn('Failed direct get by slug, trying fallback list query:', error);
  }

  try {
    const response = await academyApi.get(`landing_pages`);
    const list = response.data.data || response.data;
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
    console.error('Fallback query failed:', e);
  }
  return null;
};

export const getStudentLandingPageByCourseSlug = async (slug: string, courseId?: number | string): Promise<any> => {
  try {
    const response = await studentApi.get(`landing_pages/${slug}`);
    if (response.data.data) {
      return response.data.data;
    }
  } catch (error) {
    console.warn('Failed student direct get by slug, trying fallback list query:', error);
  }

  try {
    const response = await academyApi.get(`landing_pages`);
    const list = response.data.data || response.data;
    if (Array.isArray(list)) {
      if (courseId) {
        const found = list.find((item: any) => String(item.course_id) === String(courseId));
        if (found) return found;
      }
      const foundBySlug = list.find((item: any) => item.slug === slug || (item.course && item.course.slug === slug));
      if (foundBySlug) return foundBySlug;
    }
  } catch (e) {
    console.error('Fallback student query failed:', e);
  }
  return null;
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
