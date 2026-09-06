export const getClientTenantKey = (): string => {
  if (typeof window === 'undefined') return '';
  const hostname = window.location.hostname.toLowerCase();

  // Root Darab platform domains — no tenant context
  if (
    hostname === 'darab.academy' ||
    hostname === 'www.darab.academy' ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.startsWith('127.0.0.')
  ) {
    return '';
  }

  // Subdomain of .localhost → extract as tenant key
  if (hostname.endsWith('.localhost')) {
    return hostname.replace('.localhost', '');
  }

  // Any other hostname (e.g. esraa.darab.academy) is a tenant
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
