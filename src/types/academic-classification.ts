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
