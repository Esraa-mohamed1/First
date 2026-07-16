import studentApi from '@/lib/student-api';
import { ApiResponse, Course } from '@/types/api';
import { Course as StudentCourse } from '@/types/student';

/** Backend may put the course under `data` or `data.course`. */
function normalizeMyCourseDetailsPayload(data: unknown): unknown {
  if (!data || typeof data !== 'object') return data;
  const o = data as Record<string, unknown>;
  if (o.course && typeof o.course === 'object') return o.course;
  if (Array.isArray(o.chapters) || typeof o.title === 'string') return o;
  return data;
}

export const getStudentCourses = async (): Promise<StudentCourse[]> => {
  try {
    const response = await studentApi.get<ApiResponse<StudentCourse[]>>('courses');
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

export const getMySubscriptions = async (): Promise<any[]> => {
  try {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        return [];
      }
    }
    const response = await studentApi.get<ApiResponse<any[]>>('user-subscribe');
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to get subscriptions:', error);
    return [];
  }
};

export const getMyCourseDetails = async (id: number | string): Promise<any> => {
  try {
    const response = await studentApi.get<ApiResponse<any>>(`my-courses/${id}`);
    return normalizeMyCourseDetailsPayload(response.data.data);
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

export const enrollInCourse = async (courseId: number | string, methodId: number | string, receipt: File): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('course_id', String(courseId));
    formData.append('courseId', String(courseId));
    formData.append('method_id', String(methodId));
    formData.append('methodId', String(methodId));
    formData.append('receipt_file', receipt);
    formData.append('receipt', receipt);

    const response = await studentApi.post<any>('user-subscribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to enroll in course:', error);
    throw error.response?.data || error;
  }
};

export const trackLessonProgress = async (
  courseId: string | number,
  lessonId: number,
  seconds: number,
  events: string[] = ['play', 'pause', 'seek', 'end'],
  durationSeconds?: number,
  percentage?: number
): Promise<any> => {
  try {
    const payload: Record<string, unknown> = {
      lesson_id: lessonId,
      watched_seconds: seconds,
      events,
    };
    // Optional enrichment — sent when available so the backend can persist them.
    // Ignored gracefully if the backend doesn't recognise these fields yet.
    if (durationSeconds !== undefined && durationSeconds > 0) {
      payload.duration_seconds = durationSeconds;
    }
    if (percentage !== undefined) {
      payload.percentage = percentage;
      payload.completed = percentage >= 90;
    }
    const response = await studentApi.post(`my-courses/${courseId}/track`, payload);
    return response.data;
  } catch (error: any) {
    console.error('Failed to track progress:', error);
    throw error.response?.data || error;
  }
};

export const addLessonNote = async (lessonId: number | string, body: string, videoTime: number): Promise<any> => {
  try {
    const response = await studentApi.post(`lessons/${lessonId}/notes`, {
      body,
      video_time: videoTime
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to add note:', error);
    throw error.response?.data || error;
  }
};

export const addLessonComment = async (lessonId: number | string, body: string, parentId?: string | number): Promise<any> => {
  try {
    const response = await studentApi.post(`lessons/${lessonId}/comments`, {
      body,
      parent_id: parentId
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to add comment:', error);
    throw error.response?.data || error;
  }
};

export const likeComment = async (lessonId: number | string, commentId: string | number): Promise<any> => {
  try {
    const response = await studentApi.post(`lessons/${lessonId}/comments/${commentId}/like`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to like comment:', error);
    throw error.response?.data || error;
  }
};

export const updateLessonNote = async (lessonId: number | string, noteId: string | number, body: string, videoTime: number): Promise<any> => {
  try {
    const response = await studentApi.put(`lessons/${lessonId}/notes/${noteId}`, {
      body,
      video_time: videoTime
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to update note:', error);
    throw error.response?.data || error;
  }
};

export const deleteLessonNote = async (lessonId: number | string, noteId: string | number): Promise<any> => {
  try {
    const response = await studentApi.delete(`lessons/${lessonId}/notes/${noteId}`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to delete note:', error);
    throw error.response?.data || error;
  }
};

export const updateLessonComment = async (lessonId: number | string, commentId: string | number, body: string): Promise<any> => {
  try {
    const response = await studentApi.put(`lessons/${lessonId}/comments/${commentId}`, {
      body
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to update comment:', error);
    throw error.response?.data || error;
  }
};

export const deleteLessonComment = async (lessonId: number | string, commentId: string | number): Promise<any> => {
  try {
    const response = await studentApi.delete(`lessons/${lessonId}/comments/${commentId}`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to delete comment:', error);
    throw error.response?.data || error;
  }
};

export const getLessonNotes = async (lessonId: number | string): Promise<any> => {
  try {
    const response = await studentApi.get(`lessons/${lessonId}/notes`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to get notes:', error);
    throw error.response?.data || error;
  }
};

export const getLessonComments = async (lessonId: number | string): Promise<any> => {
  try {
    const response = await studentApi.get(`lessons/${lessonId}/comments`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to get comments:', error);
    throw error.response?.data || error;
  }
};


