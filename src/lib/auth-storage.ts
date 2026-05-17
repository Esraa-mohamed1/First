const LEARNER_ROLES = new Set(['student', 'طالب', 'admin', 'الادمن', 'academy']);

export function getCookieToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export function getStoredAuthToken(urlToken?: string | null): string | null {
  const fromUrl = urlToken?.trim() || null;
  const fromCookie = getCookieToken();
  const fromStorage =
    typeof window !== 'undefined' ? localStorage.getItem('token')?.trim() || null : null;
  return fromUrl || fromCookie || fromStorage;
}

export function persistAuthToken(token: string): void {
  localStorage.setItem('token', token);
  document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
}

export function canAccessStudentLearning(role: unknown): boolean {
  if (role == null || role === '') return true;
  return LEARNER_ROLES.has(String(role));
}
