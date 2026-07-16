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
        } else if ((key === 'receiverAccounts' || key === 'receiver_accounts') && Array.isArray(value)) {
          value.forEach((item, index) => {
            let id = item;
            if (typeof item === 'object' && item !== null) {
              id = item.receiver_account_id || item.methodId || item.method_id || item.id;
            }
            if (id !== undefined && id !== null) {
              formData.append(`receiver_accounts[${index}]`, String(Number(id)));
            }
          });
        } else if (key === 'payment_methods') {
          // Skip — backend uses receiver_accounts
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

export const createPhysicalLesson = async (payload: {
  course_id?: number;
  chapter_id?: number;
  address: string;
  start_date: string;
  end_date: string;
  map_url?: string;
  attachment?: File | null;
  [key: string]: any;
}): Promise<any> => {
  try {
    const formData = new FormData();
    Object.keys(payload).forEach((key) => {
      const value = payload[key];
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'attachment' && value instanceof File) {
          formData.append('attachment', value);
        } else if (!(value instanceof File)) {
          formData.append(key, String(value));
        }
      }
    });

    const response = await academyApi.post<ApiResponse<any>>('physical_course_details', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to create physical lesson:', error);
    throw error.response?.data || error;
  }
};

export const createOnlineSession = async (payload: {
  course_id?: number;
  chapter_id?: number;
  title?: string;
  session_url: string;
  date: string;
  time: string;
  description?: string;
  notes?: string;
  [key: string]: any;
}): Promise<any> => {
  try {
    const response = await academyApi.post<ApiResponse<any>>('online_sessions', payload);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to create online session:', error);
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
    console.error('Failed to get stats from API, using default/mock dashboard data:', error);
    return {
      active_students: "2,689",
      published_courses: "211",
      instructors_count: "18",
      total_revenue: "40,689"
    };
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
    if (payload.image instanceof File) {
      const formData = new FormData();
      Object.keys(payload).forEach(key => {
        if (payload[key] !== undefined && payload[key] !== null) {
          if (key === 'image') {
            formData.append('image', payload.image);
          } else if ((key === 'receiverAccounts' || key === 'receiver_accounts') && Array.isArray(payload[key])) {
            payload[key].forEach((item: any, index: number) => {
              let id = item;
              if (typeof item === 'object' && item !== null) {
                id = item.receiver_account_id || item.methodId || item.method_id || item.id;
              }
              if (id !== undefined && id !== null) {
                formData.append(`receiver_accounts[${index}]`, String(Number(id)));
              }
            });
          } else if (key === 'payment_methods') {
            // Skip payment_methods — backend uses receiver_accounts
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

    // Otherwise, standard JSON PUT.
    const jsonPayload = { ...payload };
    if (payload.receiverAccounts && Array.isArray(payload.receiverAccounts)) {
      jsonPayload.receiver_accounts = payload.receiverAccounts.map((item: any) => {
        let id = item;
        if (typeof item === 'object' && item !== null) {
          id = item.receiver_account_id || item.methodId || item.method_id || item.id;
        }
        return Number(id);
      });
      delete jsonPayload.receiverAccounts;
    }
    if (jsonPayload.receiver_accounts && Array.isArray(jsonPayload.receiver_accounts)) {
      jsonPayload.receiver_accounts = jsonPayload.receiver_accounts.map((item: any) => {
        let id = item;
        if (typeof item === 'object' && item !== null) {
          id = item.receiver_account_id || item.methodId || item.method_id || item.id;
        }
        return Number(id);
      });
    }
    delete jsonPayload.payment_methods;

    const response = await academyApi.put<ApiResponse<Course>>(`courses/${id}`, jsonPayload);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to update course:', error);
    throw error.response?.data || error;
  }
};
