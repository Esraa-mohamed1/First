export interface AcademyVideo {
  id: number | string;
  title: string;
  description?: string;
  video_id: string;
  video_url: string;
  library_id?: string;
  order?: number | string;
  file_size_mb?: string | number;
  duration?: number | string;
  thumbnail_url?: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
}

export interface CreateVideoPayload {
  title: string;
  description?: string;
  video_id: string;
  video_url: string;
  library_id: string;
  order?: number | string;
  file_size_mb?: string | number;
}

export interface UpdateVideoPayload {
  title?: string;
  description?: string;
  order?: number | string;
}

export interface VideoStats {
  totalVideos: number;
  totalSizeMb: number;
  storageLimitGb?: number;
  usedStorageMb?: number;
  latestVideo?: AcademyVideo | null;
}
