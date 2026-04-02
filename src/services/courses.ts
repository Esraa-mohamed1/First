import academyApi from '@/lib/academy-api';
import { ApiResponse, Course, CreateCoursePayload, CreateUnitPayload, CreateLessonPayload, Unit, Lesson } from '@/types/api';

export const createCourse = async (payload: CreateCoursePayload): Promise<Course> => {
  try {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('user_id', String(payload.user_id));
    formData.append('type', payload.type);
    formData.append('price_type', payload.price_type);
    formData.append('price', String(payload.price));
    formData.append('final_price', String(payload.final_price));
    formData.append('status', payload.status);
    if (payload.category_id !== undefined && payload.category_id !== null) {
      formData.append('category_id', String(payload.category_id));
    }
    formData.append('description', payload.description);

    if (payload.image) {
      formData.append('image', payload.image);
    }

      const response = await academyApi.post<ApiResponse<Course>>('courses', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to create course:', error);
    throw error.response?.data || error;
  }
};

export const getCourses = async (): Promise<Course[]> => {
  try {
    const response = await academyApi.get<ApiResponse<Course[]>>('courses');
  
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to get courses:', error);
    return [];
  }
};

export const getCourse = async (id: number | string): Promise<Course> => {
  try {
    const response = await academyApi.get<ApiResponse<Course>>(`courses/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to get course:', error);
    throw error.response?.data || error;
  }
};

export const createUnit = async (payload: CreateUnitPayload): Promise<Unit> => {
  try {
    const response = await academyApi.post<ApiResponse<Unit>>('chapters', payload);
    // Handle the case where data is directly in response.data.data
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to create unit:', error);
    throw error.response?.data || error;
  }
};

export const updateUnit = async (id: number, payload: any): Promise<Unit> => {
  try {
    const response = await academyApi.put<ApiResponse<Unit>>(`chapters/${id}`, payload);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to update unit:', error);
    throw error.response?.data || error;
  }
};

export const createLesson = async (payload: CreateLessonPayload): Promise<Lesson> => {
  try {
    const response = await academyApi.post<ApiResponse<Lesson>>('lessons', payload);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to create lesson:', error);
    throw error.response?.data || error;
  }
};

export const updateLesson = async (id: number, payload: any): Promise<Lesson> => {
  try {
    const response = await academyApi.put<ApiResponse<Lesson>>(`lessons/${id}`, payload);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to update lesson:', error);
    throw error.response?.data || error;
  }
};

export const deleteUnit = async (id: number): Promise<void> => {
  try {
    await academyApi.delete(`units/${id}`);
  } catch (error: any) {
    console.error('Failed to delete unit:', error);
    throw error.response?.data || error;
  }
};

export const deleteLesson = async (id: number): Promise<void> => {
  try {
    await academyApi.delete(`lessons/${id}`);
  } catch (error: any) {
    console.error('Failed to delete lesson:', error);
    throw error.response?.data || error;
  }
};

export const getCategories = async (): Promise<any[]> => {
  try {
    const response = await academyApi.get<ApiResponse<any[]>>('categories');
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to get categories:', error);
    return [];
  }
};

export const getStats = async (): Promise<any> => {
  try {
    const response = await academyApi.get<ApiResponse<any>>('stats');
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to get stats:', error);
    throw error.response?.data || error;
  }
};

export const updateCategory = async (id: number, name: string, is_active: number = 1): Promise<any> => {
  try {
    const response = await academyApi.put<ApiResponse<any>>(`categories/${id}`, { name, is_active });
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to update category:', error);
    throw error.response?.data || error;
  }
};

export const createCategory = async (name: string, is_active: number = 1): Promise<any> => {
  try {
    const response = await academyApi.post<ApiResponse<any>>('categories', { name, is_active });
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to create category:', error);
    throw error.response?.data || error;
  }
};

export const deleteCategory = async (id: number): Promise<void> => {
  try {
    await academyApi.delete(`categories/${id}`);
  } catch (error: any) {
    console.error('Failed to delete category:', error);
    throw error.response?.data || error;
  }
};

export const deleteCourse = async (id: number): Promise<void> => {
  try {
    await academyApi.delete(`courses/${id}`);
  } catch (error: any) {
    console.error('Failed to delete course:', error);
    throw error.response?.data || error;
  }
};

export const updateCourse = async (id: number, payload: any): Promise<Course> => {
  try {
    const response = await academyApi.put<ApiResponse<Course>>(`courses/${id}`, payload);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to update course:', error);
    throw error.response?.data || error;
  }
};
