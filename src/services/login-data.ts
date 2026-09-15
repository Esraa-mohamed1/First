import academyApi from '@/lib/academy-api';
import { getMeProfile, forgetPassword, resetPassword } from '@/services/auth';
import {
  AcademyProfile,
  ForgetPasswordPayload,
  ResetPasswordPayload,
  UpdateProfileEmailPayload,
} from '@/types/login-data';

// ─── Profile ──────────────────────────────────────────────────────────────────

/**
 * Fetches the academy profile from the /me endpoint.
 * Falls back to localStorage user_info on failure.
 */
export const fetchAcademyProfile = async (): Promise<AcademyProfile> => {
  try {
    const response = await getMeProfile();
    const data: AcademyProfile = response?.data ?? response;
    return data;
  } catch {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('user_info');
        if (stored) return JSON.parse(stored) as AcademyProfile;
      } catch {
        // ignore parse errors
      }
    }
    return {};
  }
};

// ─── Email ────────────────────────────────────────────────────────────────────

/**
 * Updates the academy's email via POST /academy/profile.
 * Also syncs the new email into localStorage user_info.
 */
export const updateProfileEmail = async (payload: UpdateProfileEmailPayload): Promise<void> => {
  const formData = new FormData();
  formData.append('key[]', 'email');
  formData.append('value[]', payload.email);

  await academyApi.put('profile-academic', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  // Sync to localStorage
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('user_info');
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem('user_info', JSON.stringify({ ...parsed, email: payload.email }));
      }
    } catch {
      // ignore
    }
  }
};

// ─── Password Reset ───────────────────────────────────────────────────────────

/**
 * Sends an OTP to the given email via POST /auth/forget-password.
 */
export const sendPasswordResetOtp = async (payload: ForgetPasswordPayload): Promise<void> => {
  await forgetPassword({ email: payload.email });
};

/**
 * Submits the OTP + new password via POST /auth/reset-password.
 */
export const confirmPasswordReset = async (payload: ResetPasswordPayload): Promise<void> => {
  await resetPassword(payload);
};
