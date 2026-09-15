// ─── Login-Data Settings Types ────────────────────────────────────────────────

export type ResetPasswordStep = 'send-otp' | 'reset-form';

/** Shape of the academy profile returned by the /me endpoint (relevant fields). */
export interface AcademyProfile {
  email?: string;
  name?: string;
  logo?: string;
  avatar?: string;
  image?: string;
  academy_name?: string;
  title?: string;
  [key: string]: any;
}

/** Payload sent to /auth/forget-password */
export interface ForgetPasswordPayload {
  email: string;
}

/** Payload sent to /auth/reset-password */
export interface ResetPasswordPayload {
  email: string;
  code: string;
  token: string;
  otp: string;
  password: string;
  password_confirmation: string;
}

/** Payload sent to PATCH /academy/profile to update email */
export interface UpdateProfileEmailPayload {
  email: string;
}

/** Password strength criteria state */
export interface PasswordCriteria {
  length: boolean;
  number: boolean;
  special: boolean;
}

/** Per-field validation errors for the reset-password form */
export interface ResetPasswordFormErrors {
  code: string;
  password: string;
  confirmPassword: string;
}

/** Props for the ResetPasswordModal component */
export interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillEmail?: string;
}
