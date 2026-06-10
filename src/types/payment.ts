export type PaymentMethodType = "mobile" | "email" | "account_number" | "password";

export interface PaymentMethod {
  id: string;
  name: string;
  type: PaymentMethodType;
  icon: string;
  logo?: string;
  isActive: boolean;
}

export interface AcademyPaymentMethod {
  methodId: string;
  methodName: string;
  type: PaymentMethodType;
  value: string;
  currency?: string;
  logo?: string;
}
