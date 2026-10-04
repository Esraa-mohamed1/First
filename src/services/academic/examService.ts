import academyApi from '@/lib/academy-api';
import { ApiResponse } from '@/types/api';
import { ExamPayload, ExamQuestion, ExamSettings } from '@/types/academic/exam.types';

export const defaultExamSettings: ExamSettings = {
  basic: {
    timeLimit: 0,
    timeUnit: 'minutes',
    hideTimer: false,
    feedbackMode: 'retake',
    allowedAttempts: 10,
    passingScorePercentage: 80,
    maxQuestionsToAnswer: 80,
  },
  advanced: {
    autoStart: true,
    questionLayout: 'single',
    questionOrder: 'random',
    hideQuestionNumber: false,
    shortAnswerCharLimit: 200,
    essayCharLimit: 500,
  },
};

/**
 * Creates an Exam / Quiz lesson for a unit
 */
export const createExamLesson = async (payload: ExamPayload): Promise<any> => {
  try {
    // We send payload structured for lesson creation with quiz data
    const requestData = {
      chapter_id: payload.chapter_id || payload.unit_id,
      title: payload.title,
      description: payload.description || '',
      type: 'quiz',
      is_free: payload.is_free ? 1 : 0,
      metadata: {
        questions: payload.questions,
        settings: payload.settings,
      },
      // In case backend expects top-level fields:
      questions: payload.questions,
      settings: payload.settings,
    };

    const response = await academyApi.post<ApiResponse<any>>('lessons', requestData);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to create exam lesson:', error);
    throw error.response?.data || error;
  }
};

/**
 * Updates an existing Exam / Quiz lesson
 */
export const updateExamLesson = async (id: number, payload: Partial<ExamPayload>): Promise<any> => {
  try {
    const requestData = {
      ...payload,
      type: 'quiz',
      metadata: {
        questions: payload.questions,
        settings: payload.settings,
      },
    };

    const response = await academyApi.put<ApiResponse<any>>(`lessons/${id}`, requestData);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to update exam lesson:', error);
    throw error.response?.data || error;
  }
};

/**
 * Fetches Exam details by lesson ID
 */
export const getExamLessonById = async (id: number): Promise<ExamPayload> => {
  try {
    const response = await academyApi.get<ApiResponse<any>>(`lessons/${id}`);
    const data = response.data.data;
    
    // Parse metadata if needed
    const metadata = typeof data.metadata === 'string' ? JSON.parse(data.metadata) : (data.metadata || {});
    
    return {
      id: data.id,
      chapter_id: data.chapter_id,
      title: data.title || '',
      description: data.description || '',
      type: 'quiz',
      questions: metadata.questions || data.questions || [],
      settings: metadata.settings || data.settings || defaultExamSettings,
      is_free: data.is_free,
    };
  } catch (error: any) {
    console.error('Failed to fetch exam lesson:', error);
    throw error.response?.data || error;
  }
};
