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

export const getPages = async (forceRefresh = false, template: string = 'academic'): Promise<any[]> => {
  const now = Date.now();
  if (!forceRefresh && pagesCache && now - pagesCache.timestamp < CACHE_TTL_MS) {
    return pagesCache.data;
  }
  if (!forceRefresh && pagesPromise) {
    return pagesPromise;
  }

  pagesPromise = (async () => {
    try {
      const response = await academyApi.get<any>('/pages', {
        params: template ? { template } : undefined,
      });
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

export const getPublicPages = async (template?: string): Promise<any[]> => {
  try {
    let response;
    try {
      response = await api.get<any>('/pages', {
        params: template ? { template } : undefined,
      });
    } catch (e: any) {
      if (e?.response?.status === 404 || e?.status === 404) {
        response = await api.get<any>('/pages');
      } else {
        throw e;
      }
    }
    const data = response.data?.data ?? response.data;
    return (Array.isArray(data) ? data : []) as any[];
  } catch (error) {
    console.error('Failed to get public pages:', error);
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

export const getPublicSections = async (
  pageId: string | number
): Promise<ApiSection[]> => {
  try {
    const response = await api.get<any>(`/sections`, {
      params: { page_id: pageId },
    });
    const data = response.data?.data ?? response.data;
    return (Array.isArray(data) ? data : []) as ApiSection[];
  } catch (error) {
    console.error('Failed to get public sections:', error);
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

export function normalizeSectionProps(type: string, rawProps: any): Record<string, any> {
  if (!rawProps || typeof rawProps !== 'object') return {};
  const camel = keysToCamel(rawProps);
  const snake = keysToSnake(rawProps);
  const merged = { ...snake, ...camel };

  // Explicit dual-key normalization
  if (merged.bg_color || merged.bgColor) {
    const val = merged.bgColor || merged.bg_color;
    merged.bgColor = val;
    merged.bg_color = val;
  }
  if (merged.text_color || merged.textColor) {
    const val = merged.textColor || merged.text_color;
    merged.textColor = val;
    merged.text_color = val;
  }
  if (merged.background_color || merged.backgroundColor) {
    const val = merged.backgroundColor || merged.background_color || merged.bg_color || merged.bgColor;
    merged.backgroundColor = val;
    merged.background_color = val;
  }
  if (merged.button_text || merged.buttonText) {
    const val = merged.buttonText || merged.button_text;
    merged.buttonText = val;
    merged.button_text = val;
  }
  if (merged.button_link || merged.buttonLink) {
    const val = merged.buttonLink || merged.button_link;
    merged.buttonLink = val;
    merged.button_link = val;
  }
  if (merged.phone_number || merged.phoneNumber) {
    const val = merged.phoneNumber || merged.phone_number;
    merged.phoneNumber = val;
    merged.phone_number = val;
  }
  if (merged.secondary_button_text || merged.secondaryButtonText || merged.demo_button_text || merged.demoButtonText) {
    const val = merged.secondaryButtonText || merged.secondary_button_text || merged.demoButtonText || merged.demo_button_text;
    merged.secondaryButtonText = val;
    merged.secondary_button_text = val;
  }
  if (merged.secondary_button_link || merged.secondaryButtonLink || merged.demo_button_link || merged.demoButtonLink) {
    const val = merged.secondaryButtonLink || merged.secondary_button_link || merged.demoButtonLink || merged.demo_button_link;
    merged.secondaryButtonLink = val;
    merged.secondary_button_link = val;
  }
  // About Analytics / Vision Title
  if (merged.analytics_title || merged.analyticsTitle || merged.vision_title || merged.visionTitle) {
    const val = merged.analyticsTitle || merged.analytics_title || merged.visionTitle || merged.vision_title;
    merged.analyticsTitle = val;
    merged.analytics_title = val;
  }
  // Video Intro
  if (merged.video_tag || merged.videoTag) {
    const val = merged.videoTag || merged.video_tag;
    merged.videoTag = val;
    merged.video_tag = val;
  }
  if (merged.video_title || merged.videoTitle) {
    const val = merged.videoTitle || merged.video_title;
    merged.videoTitle = val;
    merged.video_title = val;
  }
  if (merged.video_desc || merged.videoDesc) {
    const val = merged.videoDesc || merged.video_desc;
    merged.videoDesc = val;
    merged.video_desc = val;
  }
  if (merged.video_link || merged.videoLink) {
    const val = merged.videoLink || merged.video_link;
    merged.videoLink = val;
    merged.video_link = val;
  }
  if (merged.video_bg || merged.videoBg || merged.video_background_color || merged.videoBackgroundColor) {
    const val = merged.videoBg || merged.video_bg || merged.videoBackgroundColor || merged.video_background_color;
    merged.videoBg = val;
    merged.video_bg = val;
  }
  if (merged.video_text_color || merged.videoTextColor) {
    const val = merged.videoTextColor || merged.video_text_color;
    merged.videoTextColor = val;
    merged.video_text_color = val;
  }
  // Newsletter
  if (merged.newsletter_title || merged.newsletterTitle) {
    const val = merged.newsletterTitle || merged.newsletter_title;
    merged.newsletterTitle = val;
    merged.newsletter_title = val;
  }
  if (merged.newsletter_desc || merged.newsletterDesc) {
    const val = merged.newsletterDesc || merged.newsletter_desc;
    merged.newsletterDesc = val;
    merged.newsletter_desc = val;
  }
  if (merged.newsletter_btn_text || merged.newsletterBtnText) {
    const val = merged.newsletterBtnText || merged.newsletter_btn_text;
    merged.newsletterBtnText = val;
    merged.newsletter_btn_text = val;
  }
  // Login / Register styles & links
  if (merged.login_text || merged.loginText) {
    const val = merged.loginText || merged.login_text;
    merged.loginText = val;
    merged.login_text = val;
  }
  if (merged.login_link || merged.loginLink) {
    const val = merged.loginLink || merged.login_link;
    merged.loginLink = val;
    merged.login_link = val;
  }
  if (merged.login_bg_color || merged.loginBgColor || merged.login_bg || merged.loginBg) {
    const val = merged.loginBgColor || merged.login_bg_color || merged.loginBg || merged.login_bg;
    merged.loginBgColor = val;
    merged.login_bg_color = val;
  }
  if (merged.login_text_color || merged.loginTextColor || merged.login_color || merged.loginColor) {
    const val = merged.loginTextColor || merged.login_text_color || merged.loginColor || merged.login_color;
    merged.loginTextColor = val;
    merged.login_text_color = val;
  }
  if (merged.register_text || merged.registerText) {
    const val = merged.registerText || merged.register_text;
    merged.registerText = val;
    merged.register_text = val;
  }
  if (merged.register_link || merged.registerLink) {
    const val = merged.registerLink || merged.register_link;
    merged.registerLink = val;
    merged.register_link = val;
  }
  if (merged.register_bg_color || merged.registerBgColor || merged.register_bg || merged.registerBg) {
    const val = merged.registerBgColor || merged.register_bg_color || merged.registerBg || merged.register_bg;
    merged.registerBgColor = val;
    merged.register_bg_color = val;
  }
  if (merged.register_text_color || merged.registerTextColor || merged.register_color || merged.registerColor) {
    const val = merged.registerTextColor || merged.register_text_color || merged.registerColor || merged.register_color;
    merged.registerTextColor = val;
    merged.register_text_color = val;
  }
  // Course / Card / Button styles
  if (merged.button_bg || merged.buttonBg) {
    const val = merged.buttonBg || merged.button_bg;
    merged.buttonBg = val;
    merged.button_bg = val;
  }
  if (merged.card_bg || merged.cardBg) {
    const val = merged.cardBg || merged.card_bg;
    merged.cardBg = val;
    merged.card_bg = val;
  }
  if (merged.title_color || merged.titleColor) {
    const val = merged.titleColor || merged.title_color;
    merged.titleColor = val;
    merged.title_color = val;
  }
  if (merged.grid_cols || merged.gridCols) {
    const val = merged.gridCols || merged.grid_cols;
    merged.gridCols = val;
    merged.grid_cols = val;
  }
  if (merged.analytics_bars || merged.analyticsBars) {
    const val = merged.analyticsBars || merged.analytics_bars;
    merged.analyticsBars = val;
    merged.analytics_bars = val;
  }
  if (merged.analytics_color || merged.analyticsColor) {
    const val = merged.analyticsColor || merged.analytics_color;
    merged.analyticsColor = val;
    merged.analytics_color = val;
  }
  if (merged.testimonials_bg || merged.testimonialsBg) {
    const val = merged.testimonialsBg || merged.testimonials_bg;
    merged.testimonialsBg = val;
    merged.testimonials_bg = val;
  }
  if (merged.testimonials_text_color || merged.testimonialsTextColor) {
    const val = merged.testimonialsTextColor || merged.testimonials_text_color;
    merged.testimonialsTextColor = val;
    merged.testimonials_text_color = val;
  }
  if (merged.template_id || merged.templateId) {
    const val = merged.templateId || merged.template_id;
    merged.templateId = val;
    merged.template_id = val;
  }
  return merged;
}

// -----------------------------------------------------------------------
// apiToEditor
// -----------------------------------------------------------------------

export function apiToEditor(sections: ApiSection[]): BuilderNode[] {
  if (!Array.isArray(sections)) return [];

  const validSections = sections.filter((sec) => sec && typeof sec === 'object' && sec.type);
  const sorted = [...validSections].sort((a, b) => (a.order || 0) - (b.order || 0));

  return sorted.map((sec) => {
    const rawProps = safeParseProps(sec.props);
    const props = normalizeSectionProps(sec.type, rawProps);

    let editorItems: any[] | undefined = undefined;
    let rawItems = sec.items;
    if (typeof rawItems === 'string') {
      try { rawItems = JSON.parse(rawItems); } catch (e) {}
    }

    if (Array.isArray(rawItems) && rawItems.length > 0) {
      const sortedItems = [...rawItems].filter(it => it && typeof it === 'object').sort((a, b) => (a.order || 0) - (b.order || 0));
      editorItems = sortedItems.map((item) => {
        let itemProps: Record<string, any> = {};
        if (item.props) {
          itemProps = safeParseProps(item.props);
        } else {
          const { id, order, pages_id, sections_id, created_at, updated_at, props: _p, ...rest } = item as any;
          itemProps = rest;
        }

        const normalizedItemProps = normalizeSectionProps('', itemProps);

        return {
          id: item.id?.toString() || `${sec.type}-item-${Math.random().toString(36).substr(2, 9)}`,
          order: item.order,
          ...itemProps,
          ...normalizedItemProps,
          props: { ...itemProps, ...normalizedItemProps },
        };
      });
    }

    const rawHide = rawProps.hide_on_mobile !== undefined ? rawProps.hide_on_mobile : rawProps.hideOnMobile;
    const finalItems = (editorItems && editorItems.length > 0) ? editorItems : (rawProps.items || props.items);

    return {
      id: sec.id?.toString() || `${sec.type}-${Math.random().toString(36).substr(2, 9)}`,
      type: sec.type,
      props: {
        ...rawProps,
        ...props,
        ...(rawHide !== undefined ? { hide_on_mobile: !!rawHide, hideOnMobile: !!rawHide } : {}),
        ...(finalItems !== undefined ? { items: finalItems } : {}),
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

    const normalizedProps = normalizeSectionProps(node.type, propsWithoutItems);
    const apiProps = { ...propsWithoutItems, ...normalizedProps };

    const rawHide = propsWithoutItems.hide_on_mobile !== undefined ? propsWithoutItems.hide_on_mobile : propsWithoutItems.hideOnMobile;
    if (rawHide !== undefined) {
      apiProps.hide_on_mobile = !!rawHide;
      apiProps.hideOnMobile = !!rawHide;
    }

    const finalProps =
      Object.keys(apiProps).length > 0 ? apiProps : { initialized: true };

    if (Array.isArray(items) && items.length > 0) {
      finalProps.items = items;
    }

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