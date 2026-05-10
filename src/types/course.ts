export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
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
