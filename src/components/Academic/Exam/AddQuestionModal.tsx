'use client';

import React from 'react';
import {
  X,
  CheckCircle2,
  ListOrdered,
  HelpCircle,
  FileText,
  ArrowRightLeft,
  Image as ImageIcon,
  Database,
  Sparkles,
  Layers,
} from 'lucide-react';
import { QuestionType } from '@/types/academic/exam.types';

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: QuestionType) => void;
  onOpenContentBank?: () => void;
}

interface QuestionTypeItem {
  type: QuestionType;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  isPopular?: boolean;
}

const QUESTION_TYPE_ITEMS: QuestionTypeItem[] = [
  {
    type: 'mcq',
    title: 'اختيار من متعدد (MCQ)',
    subtitle: 'سؤال مع خيارات متعددة وتحديد إجابة صحيحة واحدة أو أكثر',
    icon: ListOrdered,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    isPopular: true,
  },
  {
    type: 'true_false',
    title: 'صح أم خطأ (True / False)',
    subtitle: 'سؤال بسيط وسريع بعبارة تقبل الصواب أو الخطأ',
    icon: CheckCircle2,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    type: 'fill_blanks',
    title: 'ملء الفراغات (Fill in the Blanks)',
    subtitle: 'نص يحتوي على فراغات مفقودة يملؤها الطالب بالإجابة الصحيحة',
    icon: Layers,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    type: 'short_answer',
    title: 'إجابة قصيرة ومقالية (Short Answer)',
    subtitle: 'حقل نصي حر لكتابة التفسير أو الناتج الرياضي والمقالي',
    icon: FileText,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    type: 'matching',
    title: 'المطابقة والتوصيل (Matching Pairs)',
    subtitle: 'قائمتين من العناصر يقوم الطالب بربط كل عنصر بما يناسبه',
    icon: ArrowRightLeft,
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
  },
  {
    type: 'image_answer',
    title: 'إجابة معتمدة على صورة (Image Based)',
    subtitle: 'إرفاق رسم بياني أو شكل توضيحي والإجابة بناءً عليه',
    icon: ImageIcon,
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
  },
];

export const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
  isOpen,
  onClose,
  onSelectType,
  onOpenContentBank,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" dir="rtl">
      <div className="bg-white border border-slate-200 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                إضافة سؤال جديد للاختبار
              </h3>
              <p className="text-xs text-slate-500">
                اختر النمط المناسب للسؤال لبدء كتابة الخيارات والشروط
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar">
          {/* Question Type Tiles List (Matching Prototype .tile & .feature) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUESTION_TYPE_ITEMS.map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => {
                    onSelectType(item.type);
                    onClose();
                  }}
                  className={`p-4 rounded-2xl border text-right transition-all flex items-start gap-3.5 group hover:shadow-md cursor-pointer ${
                    item.isPopular
                      ? 'border-blue-300 bg-blue-50/30 hover:border-blue-500 hover:bg-blue-50/60'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                    <IconComp className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <b className="text-sm text-slate-900 group-hover:text-blue-600 transition-colors block truncate">
                        {item.title}
                      </b>
                    </div>
                    <small className="text-xs text-slate-500 line-clamp-2 leading-relaxed block">
                      {item.subtitle}
                    </small>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Import from Question Bank Tile */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenContentBank) onOpenContentBank();
              }}
              className="w-full p-4 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 hover:from-blue-100/80 hover:to-indigo-100/80 transition-all flex items-center justify-between text-right cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <b className="text-sm font-bold text-blue-900 block">
                    استيراد أسئلة من بنك الأسئلة والمحتوى
                  </b>
                  <small className="text-xs text-blue-600/80">
                    اختر من الأسئلة الجاهزة المضافة مسبقاً في مادتك التدريبية
                  </small>
                </div>
              </div>

              <span className="text-xs font-bold text-blue-600 bg-white px-3 py-1.5 rounded-xl border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition">
                فتح البنك
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold rounded-xl text-slate-600 hover:bg-slate-100 transition"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};
