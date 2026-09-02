export interface HeroSectionData {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor: string;
  textColor: string;
  overlayColor?: string;
  typography?: {
    titleSize: number;
    bodySize: number;
  };
}

export interface LearningCard {
  id: string;
  info_key: string;
  info_value: string;
  icon?: string;
  color?: string;
}

export interface LearningSectionData {
  title: string;
  subtitle?: string;
  cards: LearningCard[];
  backgroundColor?: string;
  textColor?: string;
}

export interface ChapterSectionData {
  title: string;
  subtitle?: string;
  showLessons: boolean;
  backgroundColor?: string;
  textColor?: string;
}

export interface PaymentSectionData {
  title: string;
  description?: string;
  subtitle?: string;
  background?: string;
  textColor?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSectionData {
  title: string;
  items: FAQItem[];
  backgroundColor?: string;
  textColor?: string;
}

export interface ReviewItem {
  id: string;
  name?: string;
  role?: string;
  comment?: string;
  rating?: number;
  avatar?: string;
  type?: 'manual' | 'whatsapp' | 'image';
  waSenderName?: string;
  waBubble1In?: string;
  waBubble1Time?: string;
  waBubble2Out?: string;
  waBubble2Time?: string;
  waBubble3In?: string;
  waBubble3Time?: string;
  image?: string;
}

export interface ReviewsSectionData {
  title: string;
  items: ReviewItem[];
  showSection: boolean;
  backgroundColor?: string;
  textColor?: string;
  reviewType?: 'manual' | 'screenshots' | 'carousel';
  screenshots?: string[];
}

export interface WhatsAppSectionData {
  phoneNumber: string;
  message: string;
  showFloatingButton: boolean;
  showInlineSection?: boolean;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface FooterLink {
  label: string;
  url: string;
}

export interface FooterSectionData {
  text: string;
  links: FooterLink[];
  backgroundColor?: string;
  textColor?: string;
}

export interface ModernAboutSectionData {
  title?: string;
  description?: string;
  investmentTitle?: string;
  discountBadge?: string;
  guaranteeText?: string;
}

export interface ModernFeatureItem {
  id?: string;
  title: string;
  subtitle: string;
  icon?: string;
}

export interface ModernFeaturesSectionData {
  title?: string;
  items?: ModernFeatureItem[];
}

export interface ModernInstructorSectionData {
  title?: string;
  name?: string;
  jobTitle?: string;
  bio?: string;
  image?: string;
  badges?: string[];
}

export interface ModernBenefitsSectionData {
  title?: string;
  items?: string[];
}

export interface ModernCtaSectionData {
  title?: string;
  description?: string;
  buttonText?: string;
}

export interface Template3InstructorSectionData {
  title?: string;
  name?: string;
  jobTitle?: string;
  bio?: string;
  avatar?: string;
  studentsCount?: string;
  coursesCount?: string;
}

export interface Template3PricingSectionData {
  title?: string;
  buttonText?: string;
  guaranteeText?: string;
  items?: string[];
}

export interface LandingPageContent {
  hero: HeroSectionData;
  learning: LearningSectionData;
  chapters: ChapterSectionData;
  payment: PaymentSectionData;
  faq: FAQSectionData;
  reviews: ReviewsSectionData;
  whatsapp: WhatsAppSectionData;
  footer: FooterSectionData;
  // Modern (template_2) isolated sections
  about?: ModernAboutSectionData;
  features?: ModernFeaturesSectionData;
  instructor?: ModernInstructorSectionData;
  benefits?: ModernBenefitsSectionData;
  cta?: ModernCtaSectionData;
  // UI/UX (template_3) isolated sections
  template3_instructor?: Template3InstructorSectionData;
  template3_pricing?: Template3PricingSectionData;
}


