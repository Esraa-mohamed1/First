export interface Lesson {
  id: string | number;
  title: string;
  description: string;
  videoUrl?: string;
  video_url?: string;
  embed_url?: string;
  duration: string;
  isCompleted?: boolean;
  is_completed?: boolean;
  isLocked?: boolean;
  is_locked?: boolean;
  updated_at?: string;
  created_at?: string;
  resources?: Resource[];
  notes?: string;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: 'pdf' | 'zip' | 'link';
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  lessons: Lesson[];
  progress: number;
}
