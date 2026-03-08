import api from '@/lib/api';
import { ApiResponse, Course, CreateCoursePayload, CreateUnitPayload, CreateLessonPayload, Unit, Lesson } from '@/types/api';

export const createCourse = async (payload: CreateCoursePayload): Promise<Course> => {
  try {
    const response = await api.post<ApiResponse<Course>>('/courses', payload);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to create course:', error);
    throw error.response?.data || error;
  }
};

export const getCourse = async (id: number | string): Promise<Course> => {
  try {
    const response = await api.get<ApiResponse<Course>>(`/courses/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to get course:', error);
    throw error.response?.data || error;
  }
};

export const createUnit = async (payload: CreateUnitPayload): Promise<Unit> => {
  try {
    const response = await api.post<ApiResponse<Unit>>('/units', payload);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to create unit:', error);
    throw error.response?.data || error;
  }
};

export const createLesson = async (payload: CreateLessonPayload): Promise<Lesson> => {
  try {
    const response = await api.post<ApiResponse<Lesson>>('/lessons', payload);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to create lesson:', error);
    throw error.response?.data || error;
  }
};

export const deleteUnit = async (id: number): Promise<void> => {
  try {
    await api.delete(`/units/${id}`);
  } catch (error: any) {
    console.error('Failed to delete unit:', error);
    throw error.response?.data || error;
  }
};

export const deleteLesson = async (id: number): Promise<void> => {
  try {
    await api.delete(`/lessons/${id}`);
  } catch (error: any) {
    console.error('Failed to delete lesson:', error);
    throw error.response?.data || error;
  }
};
