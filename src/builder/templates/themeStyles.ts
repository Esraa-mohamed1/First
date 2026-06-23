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
    primaryColor: '#2563eb', // Indigo Blue
    primaryRgb: '37, 99, 235',
    secondaryColor: '#10b981',
    accentColor: '#005c86',
    backgroundColor: '#eff6ff',
    textColor: '#1f2937',
    fontFamily: 'IBM Plex Sans Arabic',
    cardShape: 'classic',
  },
  'template_1': { // fallback / alias
    primaryColor: '#2563eb',
    primaryRgb: '37, 99, 235',
    secondaryColor: '#10b981',
    accentColor: '#005c86',
    backgroundColor: '#eff6ff',
    textColor: '#1f2937',
    fontFamily: 'IBM Plex Sans Arabic',
    cardShape: 'classic',
  },
  'template_2': {
    primaryColor: '#00a896', // Modern Turquoise
    primaryRgb: '0, 168, 150',
    secondaryColor: '#00bfad',
    accentColor: '#0f766e',
    backgroundColor: '#f0fdfa',
    textColor: '#1f2937',
    fontFamily: 'Cairo',
    cardShape: 'circle',
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
