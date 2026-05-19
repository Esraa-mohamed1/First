export type PaymentMethodType = "mobile" | "email" | "account_number";

export interface PaymentMethod {
  id: string;
  name: string;
  type: PaymentMethodType;
  icon: string;
  isActive: boolean;
}

export interface AcademyPaymentMethod {
  methodId: string;
  methodName: string;
  type: PaymentMethodType;
  value: string;
}
