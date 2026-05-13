import studentApi from '@/lib/student-api';
import { ApiResponse } from '@/types/api';
import { Course } from '@/types/student';

export const getStudentCourses = async (): Promise<Course[]> => {
  try {
    const response = await studentApi.get<ApiResponse<Course[]>>('courses');
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to get student courses:', error);
    return [];
  }
};

export const getMyEnrolledCourses = async (): Promise<any[]> => {
  try {
    const response = await studentApi.get<ApiResponse<any[]>>('my-courses');
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to get enrolled courses:', error);
    return [];
  }
};

export const getMyCourseDetails = async (id: number | string): Promise<any> => {
  try {
    const response = await studentApi.get<ApiResponse<any>>(`my-courses/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to get my course details:', error);
    throw error.response?.data || error;
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


