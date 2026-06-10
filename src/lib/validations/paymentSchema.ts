import { z } from "zod";

export const paymentMethodSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(["mobile", "email", "account_number"]),
  icon: z.string().min(1, "Icon is required"),
  isActive: z.boolean().default(true),
});

export const academyPaymentMethodSchema = (type: string) => {
  if (type === "mobile")
    return z.string().regex(/^01[0125][0-9]{8}$/, "رقم هاتف غير صحيح (01xxxxxxxxx)");
  if (type === "email")
    return z.string().email("بريد إلكتروني غير صحيح");
  if (type === "account_number")
    return z.string().min(5, "يجب أن يكون الرقم 5 أحرف على الأقل");
  return z.string().min(1, "القيمة مطلوبة");
};

export const paymentMethodsSelectionSchema = z.object({
  selectedMethods: z.array(z.object({
    methodId: z.string(),
    methodName: z.string(),
    type: z.enum(["mobile", "email", "account_number"]),
    value: z.string()
  })).min(1, "يجب اختيار وسيلة دفع واحدة على الأقل")
});
