export const getStoredAuthToken = (overrideToken?: string | null): string | null => {
  if (overrideToken) return overrideToken;
  if (typeof window === 'undefined') return null;
  try {
    const token = localStorage.getItem('token');
    if (token) return token;
    
    // Cookie fallback
    const match = document.cookie.match(/(?:^|; )\s*token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch (e) {
    return null;
  }
};

export const persistAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('token', token);
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
  } catch (e) {
    console.error('Failed to persist auth token:', e);
  }
};

export const canAccessStudentLearning = (role?: string | null): boolean => {
  if (role) {
    const r = role.toLowerCase();
    return r === 'student' || r === 'user' || r === 'admin' || r === 'academy' || r === 'schoolteacher';
  }
  const token = getStoredAuthToken();
  return Boolean(token);
};

export const clearUserSessionAndCache = () => {
  if (typeof window === 'undefined') return;

  try {
    // 1. Purge localStorage completely
    localStorage.clear();

    // 2. Purge sessionStorage completely
    sessionStorage.clear();

    // 3. Purge all auth and backup cookies
    const cookiesToClear = [
      'token',
      'backup_email',
      'backup_phone',
      'backup_password',
      'academy_link_name',
      'subdomain'
    ];

    cookiesToClear.forEach(cookieName => {
      document.cookie = `${cookieName}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
    });
  } catch (e) {
    console.error('Error clearing user session and cache:', e);
  }
};

export const purgeAllCourseDraftCache = () => {
  if (typeof window === 'undefined') return;

  try {
    const keysToRemove: string[] = [
      'createCourseId',
      'createCourseSlug',
      'darab_last_created_course_id',
      'darab_last_created_course_slug',
    ];

    const types = ['recorded', 'online', 'physical', 'live-online', 'in-person'];
    types.forEach(t => {
      keysToRemove.push(`darb_create_course_draft_cache_${t}`);
      keysToRemove.push(`darb_create_course_image_${t}`);
    });

    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && (
        key.startsWith('darb_create_course_') || 
        key.startsWith('darab_course_cache_') ||
        key.startsWith('darab_course_edit_')
      )) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch (e) {
    console.error('Error purging course draft cache:', e);
  }
};

export const getStoredUserRole = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const directRole =
      localStorage.getItem('user_role') ||
      localStorage.getItem('user_account_type') ||
      localStorage.getItem('registration_role');
    if (directRole) return directRole;

    const userInfoStr = localStorage.getItem('user_info');
    if (userInfoStr) {
      const parsed = JSON.parse(userInfoStr);
      return parsed?.role || parsed?.account_type || parsed?.user_type || null;
    }
  } catch (e) {
    return null;
  }
  return null;
};

export const isSchoolTeacherRole = (role?: string | null): boolean => {
  if (!role) return false;
  const normalized = role.toLowerCase().trim();
  return (
    normalized === 'schoolteacher' ||
    normalized === 'school_teacher' ||
    normalized === 'schoolcoach' ||
    normalized === 'school'
  );
};

