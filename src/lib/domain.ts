export const getTenantSlug = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const hostname = window.location.hostname;
  // This regex will capture the subdomain if it exists and is not 'www'
  // For example, 'tenant1.example.com' will return 'tenant1'
  // 'www.example.com' or 'example.com' will return null
  const match = hostname.match(/^(?!www\.)([a-zA-Z0-9-]+)\./);
  return match ? match[1] : null;
};
