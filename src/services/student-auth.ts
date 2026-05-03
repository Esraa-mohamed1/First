import studentApi from '@/lib/student-api';

export const getStudentProfileStatus = async (): Promise<any> => {
  try {
    const response = await studentApi.get<any>('/me');
    return response.data;
  } catch (error: any) {
    console.error('Failed to get student profile status:', error);
    throw error.response?.data || error;
  }
};
