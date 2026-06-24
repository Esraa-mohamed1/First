import { CreatePagePayload } from '@/services/pages';

export interface AcademyPage {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  status: 'published' | 'draft';
  coverImage?: string;
  templateId?: string;
}

export interface PageEditorProps {
  page: AcademyPage | null;
  isCreating: boolean;
  onBack: () => void;
  onSave: (page: AcademyPage, pagePayload?: CreatePagePayload) => void;
}
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