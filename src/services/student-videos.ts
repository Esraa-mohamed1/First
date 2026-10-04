import studentApi from '@/lib/student-api';
import { ApiResponse } from '@/types/api';

export interface StudentVideo {
  id: number | string;
  title: string;
  description?: string;
  video_url?: string;
  url?: string;
  link?: string;
  embed_url?: string;
  thumbnail_url?: string;
  thumbnail?: string;
  image?: string;
  img?: string;
  cover?: string;
  duration?: string;
  time?: string;
  is_free?: boolean | number;
  enabled?: boolean;
  [key: string]: any;
}

/**
 * Fetch videos list under the user base API (studentApi: /api/user/videos)
 * Dedicated for public template/landing views without altering dashboard services.
 */
export const getStudentVideos = async (): Promise<StudentVideo[]> => {
  try {
    const response = await studentApi.get<any>('videos');
    let items: any[] = [];

    if (response.data) {
      if (Array.isArray(response.data)) {
        items = response.data;
      } else if (Array.isArray(response.data.data)) {
        items = response.data.data;
      } else if (response.data.data && Array.isArray(response.data.data.data)) {
        items = response.data.data.data;
      } else if (Array.isArray(response.data.videos)) {
        items = response.data.videos;
      }
    }

    return items;
  } catch (error: any) {
    console.warn('Failed to fetch videos from user endpoint:', error);
    return [];
  }
};
