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
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  avatar: string;
  points: number;
  level: string;
  progress: number;
}
