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
    set({
      landingPageId: data.id !== undefined ? data.id : get().landingPageId,
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
    const oldContent = get().content;
    const defaultForNewTemplate = getTemplateDefaultContent(courseData, name);

    if (oldContent) {
      const mergedContent = {
        hero: {
          ...defaultForNewTemplate.hero,
          title: oldContent.hero.title || defaultForNewTemplate.hero.title,
          subtitle: oldContent.hero.subtitle || defaultForNewTemplate.hero.subtitle,
          description: oldContent.hero.description || defaultForNewTemplate.hero.description,
          image: oldContent.hero.image || defaultForNewTemplate.hero.image,
          buttonText: oldContent.hero.buttonText || defaultForNewTemplate.hero.buttonText,
          buttonLink: oldContent.hero.buttonLink || defaultForNewTemplate.hero.buttonLink,
          backgroundColor: oldContent.hero.backgroundColor !== '#082A24' && oldContent.hero.backgroundColor !== '#ffffff'
            ? oldContent.hero.backgroundColor
            : defaultForNewTemplate.hero.backgroundColor,
          textColor: oldContent.hero.textColor !== '#FBF7EE' && oldContent.hero.textColor !== '#1f2937'
            ? oldContent.hero.textColor
            : defaultForNewTemplate.hero.textColor,
          typography: oldContent.hero.typography || defaultForNewTemplate.hero.typography,
        },
        learning: {
          ...defaultForNewTemplate.learning,
          title: oldContent.learning.title || defaultForNewTemplate.learning.title,
          subtitle: oldContent.learning.subtitle || defaultForNewTemplate.learning.subtitle,
          cards: oldContent.learning.cards && oldContent.learning.cards.length > 0 ? oldContent.learning.cards : defaultForNewTemplate.learning.cards,
        },
        chapters: {
          ...defaultForNewTemplate.chapters,
          title: oldContent.chapters.title || defaultForNewTemplate.chapters.title,
          showLessons: typeof oldContent.chapters.showLessons === 'boolean' ? oldContent.chapters.showLessons : defaultForNewTemplate.chapters.showLessons,
        },
        payment: {
          ...defaultForNewTemplate.payment,
          title: oldContent.payment.title || defaultForNewTemplate.payment.title,
        },
        faq: {
          ...defaultForNewTemplate.faq,
          title: oldContent.faq.title || defaultForNewTemplate.faq.title,
          items: oldContent.faq.items && oldContent.faq.items.length > 0 ? oldContent.faq.items : defaultForNewTemplate.faq.items,
        },
        reviews: {
          ...defaultForNewTemplate.reviews,
          title: oldContent.reviews.title || defaultForNewTemplate.reviews.title,
          items: oldContent.reviews.items && oldContent.reviews.items.length > 0 ? oldContent.reviews.items : defaultForNewTemplate.reviews.items,
          showSection: typeof oldContent.reviews.showSection === 'boolean' ? oldContent.reviews.showSection : defaultForNewTemplate.reviews.showSection,
          reviewType: oldContent.reviews.reviewType || defaultForNewTemplate.reviews.reviewType || 'manual',
          screenshots: oldContent.reviews.screenshots || defaultForNewTemplate.reviews.screenshots || [],
        },
        whatsapp: {
          ...defaultForNewTemplate.whatsapp,
          phoneNumber: oldContent.whatsapp.phoneNumber || defaultForNewTemplate.whatsapp.phoneNumber,
          message: oldContent.whatsapp.message || defaultForNewTemplate.whatsapp.message,
          showFloatingButton: typeof oldContent.whatsapp.showFloatingButton === 'boolean' ? oldContent.whatsapp.showFloatingButton : defaultForNewTemplate.whatsapp.showFloatingButton,
          showInlineSection: typeof oldContent.whatsapp.showInlineSection === 'boolean' ? oldContent.whatsapp.showInlineSection : defaultForNewTemplate.whatsapp.showInlineSection,
          title: oldContent.whatsapp.title || defaultForNewTemplate.whatsapp.title,
          subtitle: oldContent.whatsapp.subtitle || defaultForNewTemplate.whatsapp.subtitle,
          buttonText: oldContent.whatsapp.buttonText || defaultForNewTemplate.whatsapp.buttonText,
        },
        footer: {
          ...defaultForNewTemplate.footer,
          text: oldContent.footer.text || defaultForNewTemplate.footer.text,
          links: oldContent.footer.links && oldContent.footer.links.length > 0 ? oldContent.footer.links : defaultForNewTemplate.footer.links,
        }
      };

      set({
        templateName: name,
        content: mergedContent as LandingPageContent
      });
    } else {
      set({
        templateName: name,
        content: defaultForNewTemplate
      });
    }
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
