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
  message: string;
  user: any;
  token: string;
}

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}
