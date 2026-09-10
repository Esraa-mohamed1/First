/**
 * Helper to reliably extract and map payment methods / receiver accounts from any course object structure.
 * Guarantees top-level receiver account ID (e.g. 1, 6, 7) is prioritized.
 */
export function mapCoursePaymentMethods(course: any): any[] {
  if (!course) return [];

  // Check if payment_methods is already an array
  if (Array.isArray(course.payment_methods) && course.payment_methods.length > 0) {
    return course.payment_methods.map((pm: any, idx: number) => {
      const resolvedId = pm.id || pm.receiver_account_id || pm.methodId || pm.method_id || pm.receiver_account?.id || `pm-${idx + 1}`;
      const logoUrl = pm.logo || pm.receiver_account?.logo || '';
      const fullLogoUrl = logoUrl && !logoUrl.startsWith('http')
        ? `https://api.darab.academy${logoUrl.startsWith('/') ? '' : '/'}${logoUrl}`
        : logoUrl;

      return {
        ...pm,
        id: resolvedId,
        methodId: String(resolvedId),
        receiver_account_id: resolvedId,
        methodName: pm.methodName || pm.name || pm.receiver_account?.name || 'حساب استقبال',
        type: pm.type || pm.receiver_account?.key || 'mobile',
        value: pm.value || pm.account_value || pm.account_number || '',
        logo: fullLogoUrl,
      };
    });
  }

  // Check fallback raw fields: receiver_accounts, receiverAccounts, user_payment_infos, academy_payment_methods
  const rawAccounts =
    course.receiver_accounts ||
    course.receiverAccounts ||
    course.user_payment_infos ||
    course.academy_payment_methods ||
    course.paymentMethods ||
    [];

  if (Array.isArray(rawAccounts) && rawAccounts.length > 0) {
    return rawAccounts.map((acc: any, idx: number) => {
      const logoUrl = acc.logo || acc.receiver_account?.logo || '';
      const fullLogoUrl = logoUrl && !logoUrl.startsWith('http')
        ? `https://api.darab.academy${logoUrl.startsWith('/') ? '' : '/'}${logoUrl}`
        : logoUrl;

      const resolvedId = acc.id || acc.receiver_account_id || acc.methodId || acc.method_id || acc.receiver_account?.id || `acc-${idx + 1}`;

      return {
        id: resolvedId,
        methodId: String(resolvedId),
        methodName: acc.name || acc.methodName || acc.receiver_account?.name || 'حساب استقبال',
        type: acc.type || acc.receiver_account?.key || 'mobile',
        value: acc.value || acc.account_value || acc.account_number || '',
        logo: fullLogoUrl,
        receiver_account_id: resolvedId,
      };
    });
  }

  return [];
}
