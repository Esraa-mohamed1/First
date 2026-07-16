import { create } from 'zustand';
import { LandingPageContent } from '../types/landing';
import { getTemplateDefaultContent } from '../constants/defaultContent';

export interface LandingState {
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
    set({
      templateName: data.template_name || get().templateName,
      isActive: typeof data.is_active === 'boolean' ? data.is_active : get().isActive,
      courseId: data.course_id ? Number(data.course_id) : get().courseId,
      userId: data.user_id ? Number(data.user_id) : get().userId,
      content: typeof data.content === 'object' && data.content ? { ...getTemplateDefaultContent(get().courseData, data.template_name || get().templateName), ...data.content } : get().content
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
    set({ 
      templateName: name,
      // Regenerate default structure colors/layouts when template changes
      content: getTemplateDefaultContent(courseData, name)
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
