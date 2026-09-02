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
  isEditable: false,
  activeSectionId: null,
  courseData: null,

  setCourseData: (course) => {
    const currentContent = get().content;
    const templateName = get().templateName;
    set({
      courseData: course,
      courseId: course?.id ? Number(course.id) : null,
      content: currentContent || getTemplateDefaultContent(course, templateName)
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
      } as any;
    }
    set({
      landingPageId: data.id !== undefined ? data.id : get().landingPageId,
      templateName,
      isActive: typeof data.is_active === 'boolean' ? data.is_active : get().isActive,
      courseId: data.course_id ? Number(data.course_id) : get().courseId,
      userId: data.user_id ? Number(data.user_id) : get().userId,
      content: mergedContent,
    });
  },

  updateSectionContent: (section, data) => {
    const content = get().content;
    if (!content) return;
    set({
      content: {
        ...content,
        [section]: {
          ...content[section],
          ...data
        }
      }
    });
  },

  setActiveSectionId: (id) => {
    set({ activeSectionId: id });
  },

  setTemplateName: (name) => {
    const courseData = get().courseData;
    const defaultForNewTemplate = getTemplateDefaultContent(courseData, name);

    set({
      templateName: name,
      content: defaultForNewTemplate
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
    set({
      content: getTemplateDefaultContent(courseData, templateName)
    });
  }
}));
