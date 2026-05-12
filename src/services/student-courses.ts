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

export const getMyEnrolledCourses = async (): Promise<Course[]> => {
  try {
    const response = await studentApi.get<ApiResponse<any[]>>('my-courses');
    return response.data.data.map((enrollment: any) => ({
      id: String(enrollment.course.id),
      title: enrollment.course.title,
      slug: enrollment.course.slug,
      description: enrollment.course.description,
      progress: 0, // Assuming progress is not directly in this endpoint, or needs to be calculated
      image: enrollment.course.image,
      instructor: enrollment.course.instructor_name || 'Unknown',
      category: enrollment.course.category?.name || 'Uncategorized',
      status: 'in-progress', // Assuming enrolled courses are in-progress
      price_type: enrollment.course.price_type,
      is_enrolled: true,
    }));
  } catch (error: any) {
    console.error('Failed to get enrolled courses:', error);
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


