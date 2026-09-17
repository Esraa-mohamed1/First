/* ─────────────────────────────────────────────────────────
   Bags Services - Central Module Export
   Cleanly re-exports:
   - student-bags: User/Public/Student Bag Services (Base URL: /api/user)
   - academy-bags: Academy Dashboard Bag Management (Base URL: /api/academy)
   - types/bags: Shared TypeScript Interfaces
───────────────────────────────────────────────────────── */

export * from './student-bags';
export * from './academy-bags';
export type * from '@/types/bags';
export { getCurrencySymbol } from '@/types/bags';
