export interface Course {
  id: string;
  title: string;
  slug?: string;
  description: string;
  progress: number;
  image: string;
  instructor: string;
  category: string;
  status: 'in-progress' | 'completed' | 'not-started';
  price_type?: 'free' | 'paid';
  is_enrolled?: boolean;
  subscription_status?: string | null;
  enrollment_status?: string | null;
  rejection_reason?: string | null;
  access_duration_type?: 'lifetime' | 'days' | 'until_date' | 'date' | string | null;
  access_days?: number | string | null;
  access_until_date?: string | null;
  access_type?: string | null;
  accessDurationType?: string | null;
  accessDays?: number | string | null;
  accessUntilDate?: string | null;
  access_period?: string | null;
  [key: string]: any;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}
