import studentApi from '@/lib/student-api';
import { ApiResponse, Course } from '@/types/api';

export const getStudentCourses = async (): Promise<Course[]> => {
  try {
    const response = await studentApi.get<ApiResponse<Course[]>>('courses');
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to get student courses:', error);
    return [];
  }
};

export const getStudentCourse = async (slug: string): Promise<Course> => {
  try {
    const response = await studentApi.get<ApiResponse<Course>>(`courses/${slug}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to get student course:', error);
    throw error.response?.data || error;
  }
};

export const subscribeToCourse = async (courseId: number, price: number): Promise<any> => {
  try {
    const response = await studentApi.post<any>('user-subscribe', {
      course_id: courseId,
      amount: price,
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to subscribe to course:', error);
    throw error.response?.data || error;
  }
};


