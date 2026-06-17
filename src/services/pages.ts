import axios from 'axios';
import { BuilderNode } from '@/builder/interfaces';

// -----------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------

export interface CreatePagePayload {
  title: string;
  slug: string;
  status: string;
  template?: string;
}

export interface CreatedPageResponse {
  id: number | string;
  title: string;
  slug: string;
  status: string;
  [key: string]: any;
}

// -----------------------------------------------------------------------
// Axios instance (auth token + tenant key from localStorage)
// -----------------------------------------------------------------------

const academyApi = axios.create({
  baseURL: 'https://api.darab.academy/api/academy',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

academyApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    let tenantKey = localStorage.getItem('academy_link_name');
    if (!tenantKey) {
      let hostname = window.location.hostname;
      if (hostname.endsWith('.localhost')) {
        hostname = hostname.replace('.localhost', '');
      }
      if (hostname && hostname !== 'localhost') {
        tenantKey = hostname;
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (tenantKey) {
      config.headers['X-Tenant-Key'] = tenantKey;
    }
  }
  return config;
});

// -----------------------------------------------------------------------
// createPage — POST /pages
// -----------------------------------------------------------------------

/**
 * Creates a new academy page via the API.
 * The endpoint expects x-www-form-urlencoded body with: title, slug, status.
 * Returns the created page object which includes the server-assigned `id`.
 */
export const createPage = async (
  payload: CreatePagePayload
): Promise<CreatedPageResponse> => {
  const formData = new URLSearchParams();
  formData.append('title', payload.title);
  formData.append('slug', payload.slug);
  formData.append('status', payload.status);
  if (payload.template) {
    formData.append('template', payload.template);
    formData.append('template_id', payload.template);
  }

  const response = await academyApi.post<any>('/pages', formData);

  // Handle both { id, ... } and { data: { id, ... } } response shapes
  const data = response.data?.data ?? response.data;

  if (!data) {
    throw new Error('No data returned from pages API');
  }

  return data as CreatedPageResponse;
};

// -----------------------------------------------------------------------
// Dynamic Page Sections API Methods & Transformation Layer
// -----------------------------------------------------------------------

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

/**
 * Fetch dynamic sections for a specific page.
 */
export const getSections = async (
  pageId: string | number
): Promise<ApiSection[]> => {
  const response = await academyApi.get<any>(`/sections`, {
    params: { page_id: pageId, pages_id: pageId }
  });

  const data = response.data?.data ?? response.data;
  return (Array.isArray(data) ? data : []) as ApiSection[];
};

/**
 * Save dynamic sections for a specific page.
 * The API accepts one section at a time as a flat JSON object:
 * POST /sections  →  { pages_id, type, order, props, items }
 * So we iterate and POST each section individually.
 */
export const saveSections = async (
  pageId: string | number,
  sections: ApiSection[]
): Promise<any[]> => {
  const results: any[] = [];

  for (const section of sections) {
    const response = await academyApi.post<any>(
      '/sections',
      section,
      { headers: { 'Content-Type': 'application/json' } }
    );
    results.push(response.data?.data ?? response.data);
  }

  return results;
};

const LEGACY_TYPES = [
  'hero', 'hero-slider', 'kpi-cards', 'charts', 'tables', 
  'student-feed', 'course-cards', 'sidebar', 'navbar', 'tabs', 'metrics'
];

function toSnakeCase(str: string): string {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}

function toCamelCase(str: string): string {
  return str.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '');
  });
}

function keysToSnake(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(keysToSnake);
  
  const res: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    res[toSnakeCase(k)] = keysToSnake(v);
  }
  return res;
}

function keysToCamel(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(keysToCamel);
  
  const res: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    res[toCamelCase(k)] = keysToCamel(v);
  }
  return res;
}

/**
 * Transforms backend API sections into Editor-compatible BuilderNode list.
 */
export function apiToEditor(sections: ApiSection[]): BuilderNode[] {
  if (!Array.isArray(sections)) return [];

  // Sort sections by order
  const sorted = [...sections].sort((a, b) => (a.order || 0) - (b.order || 0));

  return sorted.map((sec) => {
    const isLegacy = LEGACY_TYPES.includes(sec.type);
    const rawProps = sec.props || {};
    const props = isLegacy ? keysToCamel(rawProps) : rawProps;

    let editorItems = undefined;
    if (sec.items) {
      const sortedItems = [...sec.items].sort((a, b) => (a.order || 0) - (b.order || 0));
      editorItems = sortedItems.map((item) => {
        const itemProps = item.props || {};
        return {
          id: item.id?.toString() || `${sec.type}-item-${Math.random().toString(36).substr(2, 9)}`,
          order: item.order,
          props: isLegacy ? keysToCamel(itemProps) : itemProps
        };
      });
    }

    return {
      id: sec.id?.toString() || `${sec.type}-${Math.random().toString(36).substr(2, 9)}`,
      type: sec.type,
      props: {
        ...props,
        items: editorItems
      }
    };
  });
}

/**
 * Transforms Editor BuilderNode list back into backend-compatible ApiSection list.
 * Output shape per section:
 * {
 *   pages_id: number,
 *   type: string,
 *   order: number,
 *   props: { ...content and style props (no items key) },
 *   items: [ { order, props }, ... ]   // only if section has items
 * }
 */
export function editorToApi(nodes: BuilderNode[], pageId: string | number): ApiSection[] {
  if (!Array.isArray(nodes)) return [];

  const numericPageId = isNaN(Number(pageId)) ? pageId : Number(pageId);

  return nodes.map((node, index) => {
    // Separate items from the rest of the props
    const { items, ...propsWithoutItems } = node.props || {};
    const isLegacy = LEGACY_TYPES.includes(node.type);

    // Legacy blocks store camelCase props — convert to snake_case for the API
    const apiProps = isLegacy ? keysToSnake(propsWithoutItems) : propsWithoutItems;

    // Build items array — only included when the section actually has items
    let apiItems: ApiSectionItem[] | undefined = undefined;
    if (Array.isArray(items) && items.length > 0) {
      apiItems = items.map((item, itemIdx) => {
        const rawProps = item.props || item;
        const itemProps = isLegacy ? keysToSnake(rawProps) : rawProps;
        // Only include a numeric id if the item came from the server (no dashes)
        const itemId = item.id && !item.id.toString().includes('-')
          ? Number(item.id)
          : undefined;
        return {
          ...(itemId !== undefined ? { id: itemId } : {}),
          order: item.order || (itemIdx + 1),
          props: itemProps
        };
      });
    }

    // Determine whether this section has a real server-side numeric id
    const sectionId = node.id && !node.id.includes('-') && !isNaN(Number(node.id))
      ? Number(node.id)
      : undefined;

    const section: ApiSection = {
      ...(sectionId !== undefined ? { id: sectionId } : {}),
      pages_id: numericPageId as number,
      type: node.type,
      order: index + 1,
      props: apiProps,
    };

    // Only attach items key when there are actual items
    if (apiItems !== undefined) {
      section.items = apiItems;
    }

    return section;
  });
}
