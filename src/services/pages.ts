import axios from 'axios';
import { BuilderNode } from '@/builder/interfaces';
import academyApi from '@/lib/academy-api';
import api from '@/lib/api';

// -----------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------

import { CreatePagePayload, CreatedPageResponse, ApiSectionItem, ApiSection } from '@/types/pages';
export type { CreatePagePayload, CreatedPageResponse, ApiSectionItem, ApiSection };
const SECTION_DEFAULT_PROPS: Record<string, Record<string, any>> = {
  'hero': {
    title: '',
    subtitle: '',
    button_text: '',
    button_link: '#',
    background_color: '#ffffff',
    text_color: '#1f2937',
    padding_top: 80,
    padding_bottom: 80,
  },
  'pricing_section': {
    title: '',
    subtitle: '',
    background_color: '#ffffff',
    text_color: '#1f2937',
    padding_top: 60,
    padding_bottom: 60,
  },
  'course-cards': {
    title: '',
    subtitle: '',
    background_color: '#ffffff',
    text_color: '#1f2937',
    padding_top: 60,
    padding_bottom: 60,
  },
  'student-feed': {
    title: '',
    subtitle: '',
    background_color: '#ffffff',
    text_color: '#1f2937',
    padding_top: 60,
    padding_bottom: 60,
  },
  'features_section': {
    title: '',
    subtitle: '',
    background_color: '#ffffff',
    text_color: '#1f2937',
    padding_top: 60,
    padding_bottom: 60,
  },
  'faq_section': {
    title: '',
    subtitle: '',
    background_color: '#ffffff',
    text_color: '#1f2937',
    padding_top: 60,
    padding_bottom: 60,
  },
  'kpi-cards': {
    title: '',
    background_color: '#ffffff',
    text_color: '#1f2937',
    padding_top: 60,
    padding_bottom: 60,
  },
};
// -----------------------------------------------------------------------
// Axios instance
// -----------------------------------------------------------------------

// academyApi is imported from '@/lib/academy-api' above

// -----------------------------------------------------------------------
// getPages
// -----------------------------------------------------------------------

let pagesCache: { data: any[]; timestamp: number } | null = null;
let pagesPromise: Promise<any[]> | null = null;
const CACHE_TTL_MS = 10000; // 10s cache to prevent redundant simultaneous calls

export const clearPagesCache = () => {
  pagesCache = null;
  pagesPromise = null;
};

export const getPages = async (forceRefresh = false): Promise<any[]> => {
  const now = Date.now();
  if (!forceRefresh && pagesCache && now - pagesCache.timestamp < CACHE_TTL_MS) {
    return pagesCache.data;
  }
  if (!forceRefresh && pagesPromise) {
    return pagesPromise;
  }

  pagesPromise = (async () => {
    try {
      const response = await academyApi.get<any>('/pages');
      const data = response.data?.data ?? response.data;
      const result = (Array.isArray(data) ? data : []) as any[];
      pagesCache = { data: result, timestamp: Date.now() };
      return result;
    } finally {
      pagesPromise = null;
    }
  })();

  return pagesPromise;
};

function getTenantKeyForCache(): string | null {
  if (typeof window === 'undefined') return null;
  let tenantKey = localStorage.getItem('academy_link_name');
  if (!tenantKey) {
    let hostname = window.location.hostname;
    if (hostname.endsWith('.localhost')) {
      hostname = hostname.replace('.localhost', '');
    }
    if (hostname && hostname !== 'localhost' && !hostname.startsWith('127.0.0.')) {
      tenantKey = hostname;
    }
  }
  return tenantKey ? tenantKey.toLowerCase() : null;
}

export const getPublicPages = async (): Promise<any[]> => {
  try {
    const response = await academyApi.get<any>('/pages');
    const data = response.data?.data ?? response.data;
    return (Array.isArray(data) ? data : []) as any[];
  } catch (error: any) {
    const status = error?.response?.status || error?.status;
    if (status === 404) {
      console.info(`[getPublicPages] Endpoint returned 404; falling back to static cache or empty list.`);
    } else {
      console.warn(`[getPublicPages] Failed via academyApi (status=${status || 'unknown'}). Trying static cache fallback.`);
    }

    const tenantKey = getTenantKeyForCache();
    if (tenantKey) {
      try {
        const cacheRes = await fetch(`/tenant-cache/${encodeURIComponent(tenantKey)}.json`, { cache: 'no-store' });
        if (cacheRes.ok) {
          const cached = await cacheRes.json();
          if (cached && cached.templateId) {
            return [{
              id: 'cached-home',
              slug: 'home',
              title: 'Home',
              template_name: cached.templateId,
              template: cached.templateId,
              is_active: true,
              _fromCache: true,
              _cachedSections: cached.sections || []
            }];
          }
        }
      } catch (_cacheErr) {
        /* ignore cache miss */
      }
    }
    return [];
  }
};

// -----------------------------------------------------------------------
// createPage
// -----------------------------------------------------------------------

export const createPage = async (
  payload: CreatePagePayload
): Promise<CreatedPageResponse> => {
  clearPagesCache();
  const body: Record<string, any> = {
    title: payload.title,
    slug: payload.slug,
    status: payload.status,
  };
  if (payload.template) {
    body.template = payload.template;
    body.template_id = payload.template;
  }
  if (payload.is_active !== undefined) {
    body.is_active = payload.is_active;
  }

  const response = await academyApi.post<any>('/pages', body);
  const data = response.data?.data ?? response.data;
  if (!data) throw new Error('No data returned from pages API');
  return data as CreatedPageResponse;
};

// -----------------------------------------------------------------------
// updatePage
// -----------------------------------------------------------------------

export const updatePage = async (
  pageId: string | number,
  payload: Partial<CreatePagePayload>
): Promise<CreatedPageResponse> => {
  clearPagesCache();
  const body: Record<string, any> = {};
  if (payload.title !== undefined) body.title = payload.title;
  if (payload.slug !== undefined) body.slug = payload.slug;
  if (payload.status !== undefined) body.status = payload.status;
  if (payload.template !== undefined) {
    body.template = payload.template;
    body.template_id = payload.template;
  }
  if (payload.is_active !== undefined) {
    body.is_active = payload.is_active;
  }

  const response = await academyApi.put<any>(`/pages/${pageId}`, body);
  const data = response.data?.data ?? response.data;
  if (!data) throw new Error('No data returned from pages API');
  return data as CreatedPageResponse;
};

// -----------------------------------------------------------------------
// Section Types re-exported from @/types/pages above

// -----------------------------------------------------------------------
// getSections
// -----------------------------------------------------------------------

export const getSections = async (
  pageId: string | number
): Promise<ApiSection[]> => {
  const response = await academyApi.get<any>(`/sections`, {
    params: { page_id: pageId },
  });
  const data = response.data?.data ?? response.data;
  return (Array.isArray(data) ? data : []) as ApiSection[];
};

let cachedSectionsByPageKey: Record<string, { sections: ApiSection[]; timestamp: number }> = {};
const CACHED_SECTIONS_TTL = 30000;

export function setCachedSectionsForPage(pageKey: string, sections: ApiSection[]) {
  cachedSectionsByPageKey[String(pageKey)] = {
    sections: (sections || []) as ApiSection[],
    timestamp: Date.now()
  };
}

export const getPublicSections = async (
  pageId: string | number
): Promise<ApiSection[]> => {
  const pageKey = String(pageId);
  const cachedNow = cachedSectionsByPageKey[pageKey];
  if (cachedNow && Date.now() - cachedNow.timestamp < CACHED_SECTIONS_TTL) {
    return cachedNow.sections;
  }

  try {
    const response = await academyApi.get<any>(`/sections`, {
      params: { page_id: pageId },
    });
    const data = response.data?.data ?? response.data;
    const result = (Array.isArray(data) ? data : []) as ApiSection[];
    setCachedSectionsForPage(pageKey, result);
    return result;
  } catch (error: any) {
    const status = error?.response?.status || error?.status;
    if (status === 404) {
      console.info(`[getPublicSections] page_id=${pageKey} returned 404; trying cache/static fallback.`);
    } else {
      console.warn(`[getPublicSections] page_id=${pageKey} failed (status=${status || 'unknown'}). Trying cache/static fallback.`);
    }

    if (cachedNow) {
      return cachedNow.sections;
    }

    const tenantKey = getTenantKeyForCache();
    if (tenantKey) {
      try {
        const cacheRes = await fetch(`/tenant-cache/${encodeURIComponent(tenantKey)}.json`, { cache: 'no-store' });
        if (cacheRes.ok) {
          const cached = await cacheRes.json();
          if (cached && Array.isArray(cached.sections)) {
            setCachedSectionsForPage(pageKey, cached.sections);
            return cached.sections as ApiSection[];
          }
        }
      } catch (_cacheErr) {
        /* ignore cache miss */
      }
    }
    return [];
  }
};

// -----------------------------------------------------------------------
// saveSections — single bulk POST
// -----------------------------------------------------------------------

export const saveSections = async (
  pageId: string | number,
  sections: ApiSection[]
): Promise<any> => {
  const numericPageId = isNaN(Number(pageId)) ? pageId : Number(pageId);

  const payload = {
    pages_id: numericPageId,
    sections: sections.map((section, index) => {
      const { pages_id: _pid, id: _id, ...rest } = section;

      // ✅ لو props فاضية نحط placeholder عشان الـ API ميرفضش
      const safeProps =
        rest.props && Object.keys(rest.props).length > 0
          ? rest.props
          : { _initialized: true };

      return {
        ...(!section.id || section.id.toString().includes('-')
          ? {}
          : { id: Number(section.id) }),
        type: rest.type,
        order: rest.order ?? index + 1,
        props: safeProps,
        items: (rest.items ?? []).map((item, itemIdx) => ({
          ...(!item.id || item.id.toString().includes('-')
            ? {}
            : { id: Number(item.id) }),
          order: item.order ?? itemIdx + 1,
          props: item.props,
        })),
      };
    }),
  };

  const response = await academyApi.post<any>('/sections', payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  return response.data?.data ?? response.data;
};

// -----------------------------------------------------------------------
// Utilities
// -----------------------------------------------------------------------

const LEGACY_TYPES = [
  'hero', 'hero-slider', 'kpi-cards', 'charts', 'tables',
  'student-feed', 'course-cards', 'sidebar', 'navbar', 'tabs', 'metrics',
];

function toSnakeCase(str: string): string {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

function toCamelCase(str: string): string {
  return str.replace(/([-_][a-z])/gi, ($1) =>
    $1.toUpperCase().replace('-', '').replace('_', '')
  );
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

// -----------------------------------------------------------------------
// safeParseProps
// -----------------------------------------------------------------------

function safeParseProps(raw: any): Record<string, any> {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const keys = Object.keys(raw);

    // افصل الـ numeric keys عن الـ non-numeric keys
    const numericKeys = keys.filter((k) => !isNaN(Number(k)));
    const normalKeys = keys.filter((k) => isNaN(Number(k)));

    let parsedFromChars: Record<string, any> = {};

    if (numericKeys.length > 0) {
      // ارجع الـ string من الـ char-indexed keys
      const str = numericKeys
        .sort((a, b) => Number(a) - Number(b))
        .map((k) => raw[k] ?? '')
        .join('');
      try {
        parsedFromChars = JSON.parse(str);
      } catch (e) {
        console.error('Failed to parse char-indexed props:', str, e);
      }
    }

    // الـ normal keys (section_bg, background_color, etc.)
    const normalProps: Record<string, any> = {};
    for (const k of normalKeys) {
      normalProps[k] = raw[k];
    }

    // الـ normal keys تـ override الـ parsed chars لو في تعارض
    return { ...parsedFromChars, ...normalProps };
  }

  if (typeof raw === 'string') {
    let parsed: any = raw;
    let attempts = 0;
    while (typeof parsed === 'string' && attempts < 5) {
      try {
        parsed = JSON.parse(parsed);
      } catch (e) {
        console.error('Failed to parse props string:', e);
        break;
      }
      attempts++;
    }
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed;
    }
  }

  return {};
}

// -----------------------------------------------------------------------
// apiToEditor
// -----------------------------------------------------------------------

export function apiToEditor(sections: ApiSection[]): BuilderNode[] {
  if (!Array.isArray(sections)) return [];

  const sorted = [...sections].sort((a, b) => (a.order || 0) - (b.order || 0));

  return sorted.map((sec) => {
    const isLegacy = LEGACY_TYPES.includes(sec.type);

    const rawProps = safeParseProps(sec.props);

    console.log(`=== apiToEditor: section ${sec.type} rawProps ===`, JSON.stringify(rawProps, null, 2));

    const props = isLegacy ? keysToCamel(rawProps) : keysToCamelForNewTypes(rawProps);

    let editorItems = undefined;
    if (sec.items) {
      const sortedItems = [...sec.items].sort((a, b) => (a.order || 0) - (b.order || 0));
      editorItems = sortedItems.map((item) => {
        let itemProps: Record<string, any> = {};
        if (item.props) {
          itemProps = safeParseProps(item.props);
        } else {
          const { id, order, pages_id, sections_id, created_at, updated_at, props: _p, ...rest } = item as any;
          itemProps = rest;
        }

        return {
          id: item.id?.toString() || `${sec.type}-item-${Math.random().toString(36).substr(2, 9)}`,
          order: item.order,
          props: isLegacy ? keysToCamel(itemProps) : itemProps,
        };
      });
    }

    const rawHide = rawProps.hide_on_mobile !== undefined ? rawProps.hide_on_mobile : rawProps.hideOnMobile;

    return {
      id: sec.id?.toString() || `${sec.type}-${Math.random().toString(36).substr(2, 9)}`,
      type: sec.type,
      props: {
        ...props,
        ...(rawHide !== undefined ? { hide_on_mobile: !!rawHide, hideOnMobile: !!rawHide } : {}),
        items: editorItems,
      },
    };
  });
}

// -----------------------------------------------------------------------
// editorToApi
// -----------------------------------------------------------------------

export function editorToApi(nodes: BuilderNode[], pageId: string | number): ApiSection[] {
  if (!Array.isArray(nodes)) return [];

  const numericPageId = isNaN(Number(pageId)) ? pageId : Number(pageId);

  return nodes.map((node, index) => {
    const rawNodeProps = safeParseProps(node.props);
    const { items, ...propsWithoutItems } = rawNodeProps;

    // ✅ لو props فاضية أو مفيش غير items، نجيب الـ defaults
    const hasRealProps = Object.keys(propsWithoutItems).length > 0;
    const defaults = SECTION_DEFAULT_PROPS[node.type] ?? {};
    const mergedProps = hasRealProps
      ? { ...defaults, ...propsWithoutItems }
      : defaults;

    const apiProps = keysToSnake(mergedProps);

    const rawHide = propsWithoutItems.hide_on_mobile !== undefined ? propsWithoutItems.hide_on_mobile : propsWithoutItems.hideOnMobile;
    if (rawHide !== undefined) {
      apiProps.hide_on_mobile = !!rawHide;
    }

    // ✅ لو apiProps لسه فاضي نحط placeholder عشان الـ API ميرفضش
    const finalProps =
      Object.keys(apiProps).length > 0 ? apiProps : { initialized: true };

    let apiItems: ApiSectionItem[] | undefined = undefined;
    if (Array.isArray(items) && items.length > 0) {
      apiItems = items.map((item, itemIdx) => {
        const rawItemProps = safeParseProps(item.props || item);
        const itemProps = keysToSnake(rawItemProps);
        const itemId =
          item.id && !item.id.toString().includes('-')
            ? Number(item.id)
            : undefined;
        return {
          ...(itemId !== undefined ? { id: itemId } : {}),
          order: item.order || itemIdx + 1,
          props: itemProps,
        };
      });
    }

    const sectionId =
      node.id && !node.id.includes('-') && !isNaN(Number(node.id))
        ? Number(node.id)
        : undefined;

    const section: ApiSection = {
      ...(sectionId !== undefined ? { id: sectionId } : {}),
      pages_id: numericPageId as number,
      type: node.type,
      order: index + 1,
      props: finalProps,
    };

    if (apiItems !== undefined) {
      section.items = apiItems;
    }

    return section;
  });
}