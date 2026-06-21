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
 * The API accepts one section per request as a flat JSON object:
 * POST /sections  →  { pages_id, type, order, props, items? }
 * We loop and POST each section individually.
 */
export const saveSections = async (
  pageId: string | number,
  sections: ApiSection[]
): Promise<any[]> => {
  const numericPageId = isNaN(Number(pageId)) ? pageId : Number(pageId);

  // 1. Fetch current sections from database to find deletions
  try {
    const existing = await getSections(numericPageId);
    if (Array.isArray(existing) && existing.length > 0) {
      // Find server-side IDs currently being saved
      const savedIds = new Set(
        sections
          .map((s) => s.id)
          .filter((id) => id !== undefined && !id.toString().includes('-') && !isNaN(Number(id)))
          .map((id) => Number(id))
      );

      // Delete sections that exist in DB but not in the saved list
      for (const ext of existing) {
        if (ext.id && !savedIds.has(Number(ext.id))) {
          try {
            await academyApi.delete(`/sections/${ext.id}`);
          } catch (delErr) {
            console.error(`Failed to delete section ${ext.id}:`, delErr);
          }
        }
      }
    }
  } catch (err) {
    console.error('Failed to sync deletions with server:', err);
  }

  // 2. Save remaining sections (creates or updates them)
  const results: any[] = [];
  for (const section of sections) {
    const { pages_id: _pid, ...rest } = section;
    const payload = {
      pages_id: numericPageId,
      ...rest,
    };

    const response = await academyApi.post<any>(
      '/sections',
      payload,
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

function keysToCamelForNewTypes(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(keysToCamelForNewTypes);
  
  const res: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('section_')) {
      res[toCamelCase(k)] = keysToCamelForNewTypes(v);
    } else {
      res[k] = keysToCamelForNewTypes(v);
    }
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
    
    // Parse sec.props safely if it is a JSON string or object
    let rawProps: Record<string, any> = {};
    if (sec.props) {
      if (typeof sec.props === 'string') {
        try {
          rawProps = JSON.parse(sec.props);
        } catch (e) {
          console.error('Failed to parse sec.props JSON string:', e);
        }
      } else if (typeof sec.props === 'object') {
        rawProps = sec.props;
      }
    }
    
    const props = isLegacy ? keysToCamel(rawProps) : keysToCamelForNewTypes(rawProps);

    let editorItems = undefined;
    if (sec.items) {
      const sortedItems = [...sec.items].sort((a, b) => (a.order || 0) - (b.order || 0));
      editorItems = sortedItems.map((item) => {
        let itemProps: Record<string, any> = {};
        if (item.props) {
          if (typeof item.props === 'string') {
            try {
              itemProps = JSON.parse(item.props);
            } catch (e) {
              console.error('Failed to parse item.props JSON string:', e);
            }
          } else if (typeof item.props === 'object') {
            itemProps = item.props;
          }
        } else {
          // If properties are flat on the item, extract non-metadata keys
          const { id, order, pages_id, sections_id, created_at, updated_at, props: _p, ...rest } = item as any;
          itemProps = rest;
        }
        
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

    // Convert camelCase props (style parameters etc.) to snake_case for the API
    const apiProps = keysToSnake(propsWithoutItems);

    // Build items array — only included when the section actually has items
    let apiItems: ApiSectionItem[] | undefined = undefined;
    if (Array.isArray(items) && items.length > 0) {
      apiItems = items.map((item, itemIdx) => {
        const rawProps = item.props || item;
        const itemProps = keysToSnake(rawProps);
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
