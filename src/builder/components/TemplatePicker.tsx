'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Loader2, X, Sparkles, LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';
import { createPage, CreatePagePayload } from '@/services/pages';

// -----------------------------------------------------------------------
// Static template metadata — must stay in sync with templates.ts IDs
// -----------------------------------------------------------------------

interface TemplatePreview {
  id: string;
  name: string;
  description: string;
  badge: string;
  colors: {
    primary: string;
    bg: string;
    accent: string;
    secondary: string;
  };
  sections: string[];
}

const TEMPLATES: TemplatePreview[] = [
  {
    id: 'academy-dashboard',
    name: 'لوحة التحكم الكلاسيكية',
    description: 'قالب متكامل يضم إحصائيات الطلاب، المبيعات، والكورسات.',
    badge: 'الأكثر شيوعاً ⭐',
    colors: {
      primary: '#2563eb',
      bg: '#eff6ff',
      accent: '#1d4ed8',
      secondary: '#10b981',
    },
    sections: ['navbar', 'hero', 'KPIs', 'charts', 'course cards'],
  },
  {
    id: 'template_2',
    name: 'قالب يوديمي الاحترافي',
    description: 'تصميم تعليمي كلاسيكي وعصري مستوحى من منصة Udemy، لعرض الكورسات والتصنيفات بطريقة مرتبة وجذابة.',
    badge: 'منصة تعليمية 🎓',
    colors: {
      primary: '#2FA8E0',
      bg: '#F3F8FC',
      accent: '#0B2540',
      secondary: '#FF7A5C',
    },
    sections: ['navbar', 'hero', 'features', 'categories', 'course cards', 'testimonials'],
  },
  {
    id: 'template_3',
    name: 'القالب الأرجواني الإبداعي',
    description: 'تصميم فني بلمسات أرجوانية ملائم للأكاديميات الفنية والتصميم والتحريك.',
    badge: 'إبداعي 🎨',
    colors: {
      primary: '#8b5cf6',
      bg: '#FAF5FF',
      accent: '#581c87',
      secondary: '#7c3aed',
    },
    sections: ['navbar', 'hero', 'KPIs (3)', 'metrics', 'course cards'],
  },
];

// -----------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------

interface TemplatePickerProps {
  pagePayload: CreatePagePayload;
  onClose: () => void;
  onSuccess?: (templateId: string, pageId: string | number) => void;
}

// -----------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------

export default function TemplatePicker({ pagePayload, onClose, onSuccess }: TemplatePickerProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSelectTemplate = async (templateId: string) => {
    if (loadingId) return; // prevent double-click

    setSelectedId(templateId);
    setLoadingId(templateId);

    try {
      const created = await createPage(pagePayload);
      const pageId = created.id;

      toast.success('تم إنشاء الصفحة بنجاح! جاري فتح الباني...', {
        style: {
          fontFamily: 'IBM Plex Sans Arabic',
          fontSize: '11px',
          fontWeight: 'bold',
          direction: 'rtl',
        },
      });

      if (onSuccess) {
        onSuccess(templateId, pageId);
      }

      router.push(
        `/academic/website/builder?templateId=${templateId}&pageId=${pageId}`
      );
    } catch (err: any) {
      console.error('Failed to create page via API:', err);
      toast.error(
        err?.response?.data?.message || 'فشل إنشاء الصفحة. يرجى المحاولة مجدداً.',
        {
          style: {
            fontFamily: 'IBM Plex Sans Arabic',
            fontSize: '11px',
            fontWeight: 'bold',
            direction: 'rtl',
          },
        }
      );
      setSelectedId(null);
      setLoadingId(null);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      dir="rtl"
      style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}
    >
      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
        onClick={loadingId ? undefined : onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-slate-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                <LayoutGrid className="w-4 h-4 text-blue-500" />
              </span>
              <h2 className="text-xl font-black text-slate-900">اختر قالب الصفحة</h2>
            </div>
            <p className="text-xs font-bold text-slate-400">
              اختر القالب الذي يناسب هوية أكاديميتك — يمكنك تعديل كل شيء لاحقاً من الباني
            </p>
          </div>

          {!loadingId && (
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl border border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Template Cards Grid */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          {TEMPLATES.map((tpl) => {
            const isSelected = selectedId === tpl.id;
            const isLoading = loadingId === tpl.id;
            const isDisabled = !!loadingId && !isLoading;

            return (
              <button
                key={tpl.id}
                onClick={() => handleSelectTemplate(tpl.id)}
                disabled={isDisabled}
                className={`
                  group relative text-right rounded-[1.75rem] border-2 p-0 overflow-hidden transition-all duration-300
                  ${isSelected
                    ? 'border-blue-500 shadow-xl shadow-blue-500/15 scale-[1.01]'
                    : 'border-slate-100 hover:border-slate-300 hover:shadow-lg hover:scale-[1.01]'
                  }
                  ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {/* Template Color Preview */}
                <div
                  className="w-full h-36 relative overflow-hidden"
                  style={{ background: tpl.colors.bg }}
                >
                  {/* Mini UI preview */}
                  <div className="absolute inset-0 p-3 flex flex-col gap-2">
                    {/* Mock navbar */}
                    <div
                      className="w-full h-5 rounded-lg flex items-center px-2 gap-1.5"
                      style={{ background: 'white', borderBottom: `2px solid ${tpl.colors.primary}10` }}
                    >
                      <div className="w-3 h-3 rounded-full" style={{ background: tpl.colors.primary }} />
                      <div className="flex-1 h-1.5 rounded-full bg-slate-100" />
                      <div className="w-4 h-2 rounded" style={{ background: tpl.colors.primary + '30' }} />
                    </div>
                    {/* Mock hero */}
                    <div
                      className="w-full rounded-xl flex-1 flex flex-col justify-center px-3 py-1.5 gap-1"
                      style={{ background: tpl.colors.bg }}
                    >
                      <div className="h-2 rounded-full w-3/4" style={{ background: tpl.colors.accent + '40' }} />
                      <div className="h-1.5 rounded-full w-1/2" style={{ background: tpl.colors.accent + '20' }} />
                      <div className="h-5 rounded-lg w-16 mt-1" style={{ background: tpl.colors.primary }} />
                    </div>
                    {/* Mock KPI row */}
                    <div className="flex gap-1.5">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex-1 h-5 rounded-lg"
                          style={{ background: tpl.colors.primary + (i === 1 ? '20' : '10') }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Selected checkmark overlay */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-white" />
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Info */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className="text-[9px] font-black px-2 py-0.5 rounded-full"
                      style={{
                        background: tpl.colors.primary + '15',
                        color: tpl.colors.primary,
                      }}
                    >
                      {tpl.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-800 text-right leading-snug">
                    {tpl.name}
                  </h3>

                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed text-right">
                    {tpl.description}
                  </p>

                  {/* Sections tags */}
                  <div className="flex flex-wrap gap-1 justify-end pt-1">
                    {tpl.sections.slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className="text-[8px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-500"
                      >
                        {s}
                      </span>
                    ))}
                    {tpl.sections.length > 4 && (
                      <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-400">
                        +{tpl.sections.length - 4}
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="pt-2">
                    <div
                      className={`
                        w-full py-2.5 rounded-xl text-[11px] font-black text-center transition-all
                        ${isLoading
                          ? 'bg-blue-500 text-white'
                          : isSelected
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-900 text-white group-hover:bg-blue-500'
                        }
                      `}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-1.5">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          جاري الإنشاء...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1.5">
                          <Sparkles className="w-3 h-3" />
                          ابدأ بهذا القالب
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer hint */}
        <div className="px-8 pb-6 text-center">
          <p className="text-[10px] font-bold text-slate-400">
            ✨ جميع القوالب قابلة للتخصيص الكامل من الباني — النصوص والألوان والصور وترتيب الأقسام
          </p>
        </div>
      </div>
    </div>
  );
}
