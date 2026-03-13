export type PackageStatus = 'active' | 'inactive';

export interface Feature {
  id: number;
  title: string;
  value?: string; // Value/limit for this feature in a specific package
}

export interface PackageFeatureAssociation {
  package_id: number;
  feature_id: number;
  value: string;
}

export interface Package {
  id: number;
  titile: string; // Intentional typo to match backend
  price: string;
  description: string;

  desc?: string | null; // Added to match backend JSON
  duration_months: number;
  is_active: number; // 1 for active, 0 for inactive
  max_students: number;
  max_instructors: number;
  max_courses: number;
  custom_domains: number;
  video_hours: number;
  features: any[];
  trial_days?: number;
  order?: number;
  recomnd?: number; // 1 for recommended/popular
  is_popular?: boolean;
}

export interface CreatePackagePayload extends Omit<Package, 'id'> { }

export interface CreateAccountPayload {
  name: string;
  email: string;
  phone: string;
  academy_name: string;
  password?: string;
  package_id?: number;
}

export interface LoginResponse {
  data: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  meta: {
    access_token: string;
    token_type: string;
  };
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  type: 'video' | 'pdf' | 'powerpoint';
  video_id?: string;
  file_url?: string;
  duration?: number;
  is_free: boolean;
  order: number;
}

export interface Unit {
  id: number;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: number;
  title: string;
  description: string;
  category?: string; // Derived from category_id or backend logic
  category_id?: number | null;
  instructor?: string; // Not in API response, maybe derived or missing
  user_id: number;
  price: string | number; // API returns string "0.26"
  final_price: string | number;
  price_type: 'free' | 'paid';
  image?: string; // API returns "image" URL string
  cover_image?: string; // Old field, maybe deprecated?
  status: 'published' | 'draft';
  type: string;
  units?: Unit[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateCoursePayload {
  title: string;
  user_id: string | number;
  type: string;
  price_type: 'free' | 'paid';
  price: string | number;
  final_price: string | number;
  status: 'published' | 'draft';
  image?: File;
  category_id?: string | number;
  description: string;
}

export interface CreateUnitPayload {
  course_id: number;
  title: string;
  description?: string;
  order?: number;
}

export interface CreateLessonPayload {
  unit_id: number;
  title: string;
  description: string;
  type: 'video' | 'pdf' | 'powerpoint';
  video_id?: string;
  file_url?: string;
  is_free: boolean;
}

export interface ApiResponse<T> {
  status: boolean | number;
  success?: boolean;
  message: string;
  data: T;
}
