import academyApi from '@/lib/academy-api';
import { ApiResponse, Course, CreateCoursePayload, CreateUnitPayload, CreateLessonPayload, Unit, Lesson } from '@/types/api';

export const createCourse = async (payload: CreateCoursePayload): Promise<Course> => {
  try {
    const formData = new FormData();
    Object.keys(payload).forEach(key => {
      const value = (payload as any)[key];
      if (value !== undefined && value !== null) {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else if (key === 'receiverAccounts' && Array.isArray(value)) {
          value.forEach((item, index) => {
            formData.append(`receiverAccounts[${index}][methodId]`, String(item.methodId));
            formData.append(`receiverAccounts[${index}][currency]`, String(item.currency));
            formData.append(`receiver_accounts[${index}][method_id]`, String(item.methodId));
            formData.append(`receiver_accounts[${index}][currency]`, String(item.currency));
          });
        } else if (key === 'receiver_accounts' && Array.isArray(value)) {
          value.forEach((item, index) => {
            formData.append(`receiver_accounts[${index}][method_id]`, String(item.method_id));
            formData.append(`receiver_accounts[${index}][currency]`, String(item.currency));
          });
        } else {
          formData.append(key, String(value));
        }
      }
    });

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

export const getCourses = async (userId?: number, userRole?: string, type?: string): Promise<Course[]> => {
  try {
    let url = 'courses';
    const params = new URLSearchParams();
    
    if (userRole === 'academy' && userId) {
      params.append('user_id', String(userId));
    }
    
    if (type) {
      params.append('type', type);
    }
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    const response = await academyApi.get<ApiResponse<Course[]>>(url);
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
    // If payload contains a file (image), we must use FormData
    // and often backends (like Laravel) require POST with _method=PUT for multipart/form-data
    if (payload.image instanceof File) {
      const formData = new FormData();
      Object.keys(payload).forEach(key => {
        if (payload[key] !== undefined && payload[key] !== null) {
          if (key === 'image') {
            formData.append('image', payload.image);
          } else if (key === 'receiverAccounts' && Array.isArray(payload[key])) {
            payload[key].forEach((item: any, index: number) => {
              formData.append(`receiverAccounts[${index}][methodId]`, String(item.methodId));
              formData.append(`receiverAccounts[${index}][currency]`, String(item.currency));
              formData.append(`receiver_accounts[${index}][method_id]`, String(item.methodId));
              formData.append(`receiver_accounts[${index}][currency]`, String(item.currency));
            });
          } else if (key === 'receiver_accounts' && Array.isArray(payload[key])) {
            payload[key].forEach((item: any, index: number) => {
              formData.append(`receiver_accounts[${index}][method_id]`, String(item.method_id));
              formData.append(`receiver_accounts[${index}][currency]`, String(item.currency));
            });
          } else {
            formData.append(key, String(payload[key]));
          }
        }
      });
      formData.append('_method', 'PUT');
      
      const response = await academyApi.post<ApiResponse<Course>>(`courses/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    }

    // Otherwise, standard JSON PUT. Map both formats of receiver accounts.
    const jsonPayload = { ...payload };
    if (payload.receiverAccounts && !payload.receiver_accounts) {
      jsonPayload.receiver_accounts = payload.receiverAccounts.map((item: any) => ({
        method_id: item.methodId,
        currency: item.currency,
      }));
    } else if (payload.receiver_accounts && !payload.receiverAccounts) {
      jsonPayload.receiverAccounts = payload.receiver_accounts.map((item: any) => ({
        methodId: item.method_id,
        currency: item.currency,
      }));
    }

    const response = await academyApi.put<ApiResponse<Course>>(`courses/${id}`, jsonPayload);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to update course:', error);
    throw error.response?.data || error;
  }
};
