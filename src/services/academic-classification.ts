import academyApi from '@/lib/academy-api';

// Types Definition
export interface ClassificationItem {
  id: string | number;
  name: string;
  desc?: string;
  description?: string;
  stage?: string;
  academic_year?: string;
  active?: boolean;
  is_active?: boolean;
  start_date?: string;
  end_date?: string;
  academic_year_id?: string | number;
  grade_id?: string | number;
  term_id?: string | number;
  grade_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateClassificationPayload {
  name: string;
  description?: string;
  stage?: string;
  academic_year?: string;
  is_active?: boolean;
  start_date?: string;
  end_date?: string;
  academic_year_id?: string | number;
  grade_id?: string | number;
  term_id?: string | number;
}

// Helper to extract response data
const unwrapData = <T>(res: any): T => {
  if (res?.data?.data !== undefined) return res.data.data;
  if (res?.data !== undefined && Array.isArray(res.data)) return res.data as unknown as T;
  if (res?.data !== undefined) return res.data;
  return res as T;
};

// ─── 1. GRADES (academy/grades or grades) ───
export const getGrades = async (): Promise<ClassificationItem[]> => {
  try {
    const res = await academyApi.get('grades');
    return unwrapData<ClassificationItem[]>(res) || [];
  } catch (error) {
    try {
      const fallbackRes = await academyApi.get('academy/grades');
      return unwrapData<ClassificationItem[]>(fallbackRes) || [];
    } catch (e) {
      console.warn('Failed to fetch grades from API:', e);
      throw e;
    }
  }
};

export const createGrade = async (payload: CreateClassificationPayload): Promise<ClassificationItem> => {
  try {
    const res = await academyApi.post('grades', payload);
    return unwrapData<ClassificationItem>(res);
  } catch (error) {
    const fallbackRes = await academyApi.post('academy/grades', payload);
    return unwrapData<ClassificationItem>(fallbackRes);
  }
};

export const updateGrade = async (id: string | number, payload: Partial<CreateClassificationPayload>): Promise<ClassificationItem> => {
  try {
    const res = await academyApi.put(`grades/${id}`, payload);
    return unwrapData<ClassificationItem>(res);
  } catch (error) {
    const res = await academyApi.post(`grades/${id}`, { ...payload, _method: 'PUT' });
    return unwrapData<ClassificationItem>(res);
  }
};

export const deleteGrade = async (id: string | number): Promise<void> => {
  await academyApi.delete(`grades/${id}`);
};

// ─── 2. ACADEMIC YEARS (academic_years) ───
export const getAcademicYears = async (): Promise<ClassificationItem[]> => {
  try {
    const res = await academyApi.get('academic_years');
    return unwrapData<ClassificationItem[]>(res) || [];
  } catch (error) {
    console.warn('Failed to fetch academic_years:', error);
    throw error;
  }
};

export const createAcademicYear = async (payload: CreateClassificationPayload): Promise<ClassificationItem> => {
  const res = await academyApi.post('academic_years', payload);
  return unwrapData<ClassificationItem>(res);
};

export const updateAcademicYear = async (id: string | number, payload: Partial<CreateClassificationPayload>): Promise<ClassificationItem> => {
  try {
    const res = await academyApi.put(`academic_years/${id}`, payload);
    return unwrapData<ClassificationItem>(res);
  } catch (error) {
    const res = await academyApi.post(`academic_years/${id}`, { ...payload, _method: 'PUT' });
    return unwrapData<ClassificationItem>(res);
  }
};

export const deleteAcademicYear = async (id: string | number): Promise<void> => {
  await academyApi.delete(`academic_years/${id}`);
};

// ─── 3. TERMS (terms) ───
export const getTerms = async (): Promise<ClassificationItem[]> => {
  try {
    const res = await academyApi.get('terms');
    return unwrapData<ClassificationItem[]>(res) || [];
  } catch (error) {
    console.warn('Failed to fetch terms:', error);
    throw error;
  }
};

export const createTerm = async (payload: CreateClassificationPayload): Promise<ClassificationItem> => {
  const res = await academyApi.post('terms', payload);
  return unwrapData<ClassificationItem>(res);
};

export const updateTerm = async (id: string | number, payload: Partial<CreateClassificationPayload>): Promise<ClassificationItem> => {
  try {
    const res = await academyApi.put(`terms/${id}`, payload);
    return unwrapData<ClassificationItem>(res);
  } catch (error) {
    const res = await academyApi.post(`terms/${id}`, { ...payload, _method: 'PUT' });
    return unwrapData<ClassificationItem>(res);
  }
};

export const deleteTerm = async (id: string | number): Promise<void> => {
  await academyApi.delete(`terms/${id}`);
};

// ─── 4. SUBJECTS (subjects) ───
export const getSubjects = async (): Promise<ClassificationItem[]> => {
  try {
    const res = await academyApi.get('subjects');
    return unwrapData<ClassificationItem[]>(res) || [];
  } catch (error) {
    console.warn('Failed to fetch subjects:', error);
    throw error;
  }
};

export const createSubject = async (payload: CreateClassificationPayload): Promise<ClassificationItem> => {
  const res = await academyApi.post('subjects', payload);
  return unwrapData<ClassificationItem>(res);
};

export const updateSubject = async (id: string | number, payload: Partial<CreateClassificationPayload>): Promise<ClassificationItem> => {
  try {
    const res = await academyApi.put(`subjects/${id}`, payload);
    return unwrapData<ClassificationItem>(res);
  } catch (error) {
    const res = await academyApi.post(`subjects/${id}`, { ...payload, _method: 'PUT' });
    return unwrapData<ClassificationItem>(res);
  }
};

export const deleteSubject = async (id: string | number): Promise<void> => {
  await academyApi.delete(`subjects/${id}`);
};

// ─── 5. TEMPLATES (templates) ───
export const getTemplates = async (): Promise<any[]> => {
  try {
    const res = await academyApi.get('templates');
    return unwrapData<any[]>(res) || [];
  } catch (error) {
    console.warn('Failed to fetch templates:', error);
    throw error;
  }
};

export const createTemplate = async (payload: any): Promise<any> => {
  const res = await academyApi.post('templates', payload);
  return unwrapData<any>(res);
};
