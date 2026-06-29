export interface TemplateTheme {
  primaryColor: string;
  primaryRgb: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  cardShape?: 'classic' | 'circle' | 'leaf' | 'square';
}

export const TEMPLATE_THEMES: Record<string, TemplateTheme> = {
  'academy-dashboard': {
    primaryColor: '#7c3aed', // Purple
    primaryRgb: '124, 58, 237',
    secondaryColor: '#a855f7',
    accentColor: '#6d28d9',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    fontFamily: 'Cairo',
    cardShape: 'classic',
  },
  'template_1': { // fallback / alias
    primaryColor: '#7c3aed', // Purple
    primaryRgb: '124, 58, 237',
    secondaryColor: '#a855f7',
    accentColor: '#6d28d9',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    fontFamily: 'Cairo',
    cardShape: 'classic',
  },
  'template_2': {
    primaryColor: '#a435f0', // Udemy Purple
    primaryRgb: '164, 53, 240',
    secondaryColor: '#1c1d1f', // Udemy Dark Slate
    accentColor: '#5624d0',
    backgroundColor: '#ffffff',
    textColor: '#1c1d1f',
    fontFamily: 'IBM Plex Sans Arabic',
    cardShape: 'classic',
  },
  'template_3': {
    primaryColor: '#8b5cf6', // Creative Purple
    primaryRgb: '139, 92, 246',
    secondaryColor: '#7c3aed',
    accentColor: '#581c87',
    backgroundColor: '#FAF5FF',
    textColor: '#1f2937',
    fontFamily: 'Tajawal',
    cardShape: 'leaf',
  },
  'template_4': {
    primaryColor: '#0d9488', // Corporate Teal
    primaryRgb: '13, 148, 136',
    secondaryColor: '#0f766e',
    accentColor: '#115e59',
    backgroundColor: '#f0fdfa',
    textColor: '#1e293b',
    fontFamily: 'Almarai',
    cardShape: 'square',
  },
};


export const getThemeBySlug = (slug: string): TemplateTheme => {
  return TEMPLATE_THEMES[slug] || TEMPLATE_THEMES['academy-dashboard'];
};
