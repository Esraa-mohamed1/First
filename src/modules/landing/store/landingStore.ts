import { create } from 'zustand';
import { LandingPageContent } from '../types/landing';
import { getTemplateDefaultContent } from '../constants/defaultContent';

export interface LandingState {
  landingPageId: number | string | null;
  courseId: number | null;
  templateName: string;
  isActive: boolean;
  userId: number | null;
  content: LandingPageContent | null;
  templateContents: Record<string, LandingPageContent>;
  isEditable: boolean;
  activeSectionId: string | null;
  courseData: any | null;

  setCourseData: (course: any) => void;
  setLandingPageData: (data: any) => void;
  updateSectionContent: <K extends keyof LandingPageContent>(section: K, data: Partial<LandingPageContent[K]>) => void;
  setActiveSectionId: (id: string | null) => void;
  setTemplateName: (name: string) => void;
  setIsActive: (active: boolean) => void;
  setUserId: (userId: number) => void;
  resetToDefaults: () => void;
}

export const useLandingStore = create<LandingState>((set, get) => ({
  landingPageId: null,
  courseId: null,
  templateName: 'template_1',
  isActive: true,
  userId: null,
  content: null,
  templateContents: {},
  isEditable: false,
  activeSectionId: null,
  courseData: null,

  setCourseData: (course) => {
    const currentContent = get().content;
    const templateName = get().templateName;
    const existingCache = get().templateContents;
    const defaultContent = currentContent || existingCache[templateName] || getTemplateDefaultContent(course, templateName);
    set({
      courseData: course,
      courseId: course?.id ? Number(course.id) : null,
      content: defaultContent,
      templateContents: {
        ...existingCache,
        [templateName]: defaultContent
      }
    });
  },

  setLandingPageData: (data) => {
    if (!data) return;
    const templateName = data.template_name || get().templateName;
    const courseData = get().courseData;
    const defaults = getTemplateDefaultContent(courseData, templateName);
    // Safely merge incoming content with defaults — avoids crashes when sections are missing
    let mergedContent = defaults;
    if (typeof data.content === 'object' && data.content !== null) {
      const c = data.content as any;
      mergedContent = {
        hero: { ...defaults.hero, ...(c.hero || {}) },
        learning: { ...defaults.learning, ...(c.learning || {}) },
        chapters: { ...defaults.chapters, ...(c.chapters || {}) },
        payment: { ...defaults.payment, ...(c.payment || {}) },
        faq: { ...defaults.faq, ...(c.faq || {}) },
        reviews: { ...defaults.reviews, ...(c.reviews || {}) },
        whatsapp: { ...defaults.whatsapp, ...(c.whatsapp || {}) },
        footer: { ...defaults.footer, ...(c.footer || {}) },
        // Modern (template_2) sections
        about: { ...(defaults.about || {}), ...(c.about || {}) },
        features: { ...(defaults.features || {}), ...(c.features || {}) },
        instructor: { ...(defaults.instructor || {}), ...(c.instructor || {}) },
        benefits: { ...(defaults.benefits || {}), ...(c.benefits || {}) },
        cta: { ...(defaults.cta || {}), ...(c.cta || {}) },
        // UI/UX (template_3) sections
        template3_instructor: { ...(defaults.template3_instructor || {}), ...(c.template3_instructor || {}) },
        template3_pricing: { ...(defaults.template3_pricing || {}), ...(c.template3_pricing || {}) },
      } as any;
    }
    const existingCache = get().templateContents;
    set({
      landingPageId: data.id !== undefined ? data.id : get().landingPageId,
      templateName,
      isActive: typeof data.is_active === 'boolean' ? data.is_active : get().isActive,
      courseId: data.course_id ? Number(data.course_id) : get().courseId,
      userId: data.user_id ? Number(data.user_id) : get().userId,
      content: mergedContent,
      templateContents: {
        ...existingCache,
        [templateName]: mergedContent
      }
    });
  },

  updateSectionContent: (section, data) => {
    const content = get().content;
    const currentTemplate = get().templateName;
    if (!content) return;
    const updatedContent = {
      ...content,
      [section]: {
        ...(content[section] || {}),
        ...data
      }
    };
    const existingCache = get().templateContents;
    set({
      content: updatedContent,
      templateContents: {
        ...existingCache,
        [currentTemplate]: updatedContent
      }
    });
  },

  setActiveSectionId: (id) => {
    set({ activeSectionId: id });
  },

  setTemplateName: (name) => {
    const courseData = get().courseData;
    const currentTemplate = get().templateName;
    const currentContent = get().content;
    const existingCache = { ...get().templateContents };

    // Cache current template content before switching
    if (currentContent) {
      existingCache[currentTemplate] = currentContent;
    }

    // Retrieve cached content for target template or create fresh defaults
    const targetContent = existingCache[name] || getTemplateDefaultContent(courseData, name);
    existingCache[name] = targetContent;

    set({
      templateName: name,
      content: targetContent,
      templateContents: existingCache,
      activeSectionId: 'hero'
    });
  },

  setIsActive: (active) => {
    set({ isActive: active });
  },

  setUserId: (userId) => {
    set({ userId });
  },

  resetToDefaults: () => {
    const courseData = get().courseData;
    const templateName = get().templateName;
    const defaults = getTemplateDefaultContent(courseData, templateName);
    const existingCache = get().templateContents;
    set({
      content: defaults,
      templateContents: {
        ...existingCache,
        [templateName]: defaults
      }
    });
  }
}));

