import React from 'react';
import { CreditCard, Globe, Hash, Pen } from 'lucide-react';
import { PaymentSectionData } from '../types/landing';
import { twMerge } from 'tailwind-merge';
import { colorToRgbTriplet } from '../utils/color';

interface PaymentSectionProps {
  data: PaymentSectionData;
  course: any;
  templateId: string;
  isEditable: boolean;
  onEdit: () => void;
}

export default function PaymentSection({
  data,
  course,
  templateId,
  isEditable,
  onEdit,
}: PaymentSectionProps) {
  const isTemplate1 = templateId === 'template_1' || templateId === 'Modern Course';
  
  // Custom colors parsing
  const defaultBg = isTemplate1 ? '#FBF7EE' : '#ffffff';
  const defaultText = isTemplate1 ? '#0D3B33' : '#1f2937';
  
  const localBg = data.background || defaultBg;
  const localText = data.textColor || defaultText;
  
  const bgRgb = colorToRgbTriplet(localBg);
  const textRgb = colorToRgbTriplet(localText);
  
  const primaryColorHex = isTemplate1 ? '#C9A24B' : 'var(--theme-primary)';
  const primaryRgbTriplet = isTemplate1 ? '201, 162, 75' : 'var(--theme-primary-rgb)';

  const sectionStyle = {
    backgroundColor: localBg,
    color: localText,
    '--local-bg-rgb': bgRgb,
    '--local-text-rgb': textRgb,
    '--theme-primary': primaryColorHex,
    '--theme-primary-rgb': primaryRgbTriplet,
  } as React.CSSProperties;

  // Extract raw receiver accounts / payment methods
  const rawMethods = course?.payment_methods || course?.receiver_accounts || course?.receiverAccounts || [];
  
  // Format to standard structure for rendering
  const receiverAccounts = rawMethods.map((item: any, index: number) => {
    const value = item.value || item.accountValue || item.account_value || item.accountNumber || item.account_number || '';
    const name = item.name || item.methodName || item.receiver_account?.name || '';
    const logo = item.logo || item.receiver_account?.logo || undefined;
    const country = item.country || item.country_name || item.receiver_account?.country_name || item.country_code || '';
    
    return {
      id: item.methodId || item.id || `pm-${index}`,
      name,
      accountNumber: value,
      country,
      logo
    };
  });

  if (receiverAccounts.length === 0) return null;

  if (isTemplate1) {
    return (
      <section 
        style={sectionStyle}
        className={twMerge(
          "section py-16 text-right relative border-b group",
          isEditable && "hover:ring-2 hover:ring-blue-500/50 hover:bg-slate-50 transition-all"
        )}
      >
        {isEditable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="absolute top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-1.5 text-xs font-bold font-sans transition-all cursor-pointer"
          >
            <Pen size={12} />
            تعديل قسم الحسابات
          </button>
        )}

        <div className="container max-w-[1120px] mx-auto px-4">
          <div className="text-center mb-10">
            <span 
              style={{ color: `rgb(${primaryRgbTriplet})` }}
              className="eyebrow inline-flex items-center gap-2 font-black text-xs uppercase tracking-wide"
            >
              ✦ &nbsp;الدفع والتحويل
            </span>
            <h2 style={{ color: localText }} className="section-title text-2xl md:text-3xl font-extrabold mt-2 mb-4">
              {data.title || 'وسائل الدفع المتاحة للامتلاك'}
            </h2>
            <p style={{ color: `rgba(${textRgb}, 0.7)` }} className="max-w-[500px] mx-auto text-sm">
              يمكنك إرسال رسوم الاشتراك مباشرة عن طريق التحويل البنكي إلى أحد حساباتنا المعتمدة أدناه.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {receiverAccounts.map((account: any) => (
              <div 
                key={account.id} 
                style={{ backgroundColor: '#ffffff', borderColor: `rgba(${textRgb}, 0.12)` }}
                className="border rounded-3xl p-6 shadow-sm flex items-start gap-4 text-right hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                  {account.logo ? (
                    <img src={account.logo} alt={account.name} className="w-full h-full object-contain p-2" />
                  ) : (
                    <CreditCard size={28} style={{ color: `rgb(${primaryRgbTriplet})` }} />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <h3 style={{ color: localText }} className="font-extrabold text-base">{account.name}</h3>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Hash size={14} style={{ color: `rgb(${primaryRgbTriplet})` }} />
                    <span 
                      style={{ color: `rgba(${textRgb}, 0.85)` }}
                      className="font-mono select-all font-bold tracking-wider"
                    >
                      {account.accountNumber}
                    </span>
                  </div>

                  {account.country && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Globe size={14} style={{ color: `rgb(${primaryRgbTriplet})` }} />
                      <span className="font-bold">{account.country}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Template 2 Blue Style
  return (
    <section 
      style={sectionStyle}
      className={twMerge(
        "py-16 text-right relative border-b border-slate-100 group",
        isEditable && "hover:ring-2 hover:ring-blue-500/50 hover:bg-slate-50 transition-all"
      )}
    >
      {isEditable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="absolute top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-1.5 text-xs font-bold font-sans transition-all cursor-pointer"
        >
          <Pen size={12} />
          تعديل قسم الحسابات
        </button>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-right mb-10">
          <h2 
            style={{ color: localText, borderRightColor: `rgb(${primaryRgbTriplet})` }}
            className="text-2xl md:text-3xl font-black border-r-[6px] pr-4 leading-none"
          >
            {data.title || 'بيانات الدفع والتحويل البنكي'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {receiverAccounts.map((account: any) => (
            <div 
              key={account.id} 
              style={{ backgroundColor: '#ffffff', borderColor: `rgba(${textRgb}, 0.1)` }}
              className="p-6 rounded-2xl border flex flex-col gap-4 text-right shadow-sm hover:border-[var(--theme-primary)] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                  {account.logo ? (
                    <img src={account.logo} alt={account.name} className="w-full h-full object-contain p-2" />
                  ) : (
                    <CreditCard size={22} style={{ color: `rgb(${primaryRgbTriplet})` }} />
                  )}
                </div>
                <h3 style={{ color: localText }} className="font-extrabold text-sm">{account.name}</h3>
              </div>

              <div className="space-y-1 text-xs">
                <div 
                  style={{ backgroundColor: `rgba(${textRgb}, 0.03)` }}
                  className="p-2.5 rounded-xl flex items-center justify-between"
                >
                  <span className="text-slate-400 font-bold">رقم الحساب:</span>
                  <span style={{ color: localText }} className="font-mono select-all font-bold tracking-wider">{account.accountNumber}</span>
                </div>

                {account.country && (
                  <div className="flex items-between justify-between pt-1">
                    <span className="text-slate-400 font-bold">بلد الحساب:</span>
                    <span style={{ color: `rgba(${textRgb}, 0.8)` }} className="font-bold">{account.country}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
