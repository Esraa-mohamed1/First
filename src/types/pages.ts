export interface CreatePagePayload {
  title: string;
  slug: string;
  status: string;
  template?: string;
  is_active?: string | number | boolean;
}

export interface CreatedPageResponse {
  id: number | string;
  title: string;
  slug: string;
  status: string;
  [key: string]: any;
}

export interface ApiSectionItem {
  id?: number | string;
  order: number;
  props: Record<string, any>;
}

export interface ApiSection {
  id?: number | string;
  pages_id: number | string;
  type: string;
  order: number;
  props: Record<string, any>;
  items?: ApiSectionItem[];
}
