export const getClientTenantKey = (): string => {
  if (typeof window === 'undefined') return '';
  const hostname = window.location.hostname.toLowerCase();
  
  if (
    hostname === 'localhost' ||
    hostname === 'darab.academy' ||
    hostname === 'www.darab.academy' ||
    hostname.startsWith('127.0.0.')
  ) {
    return 'esraa.darab.academy';
  }
  
  if (hostname.endsWith('.localhost')) {
    return hostname.replace('.localhost', '');
  }
  
  return hostname;
};

export const syncHomepageCache = async (templateId: string, sections: any[]) => {
  try {
    const tenantKey = getClientTenantKey();
    if (!tenantKey) return;
    
    await fetch('/api/cache-homepage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tenantKey,
        templateId,
        sections,
      }),
    });
  } catch (error) {
    console.error('Failed to sync homepage cache:', error);
  }
};
