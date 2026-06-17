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
