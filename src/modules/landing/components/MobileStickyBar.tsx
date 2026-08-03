'use client';

import React from 'react';
import { MessageCircle, Zap } from 'lucide-react';

interface MobileStickyBarProps {
  courseData: any;
  onSubscribe: () => void;
  isSubscribing: boolean;
  whatsappNumber?: string;
}

export function MobileHeader({ courseTitle }: { courseTitle?: string }) {
  return (
    <header className="md:hidden sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white px-4 py-3 flex items-center justify-between shadow-md select-none" dir="rtl">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-xs text-white shrink-0 shadow-sm">
          د
        </div>
        <span className="text-xs font-bold truncate text-slate-100 max-w-[210px]">
          {courseTitle || 'أكاديمية درّب'}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="flex items-center gap-1 text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          متاح الآن
        </span>
      </div>
    </header>
  );
}

export function MobileStickyBar({
  courseData,
  onSubscribe,
  isSubscribing,
  whatsappNumber,
}: MobileStickyBarProps) {
  const price = courseData?.final_price || courseData?.price || 299;
  const originalPrice = courseData?.original_price || courseData?.price_before_discount;
  const isFree = courseData?.price_type === 'free' || Number(price) === 0;
  const currency = courseData?.currency || 'SAR';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-3 px-4 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] transition-all animate-in slide-in-from-bottom duration-300 select-none" dir="rtl">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        {/* Price display */}
        <div className="flex flex-col shrink-0 text-right">
          <span className="text-[10px] font-bold text-slate-400">استثمار الدورة:</span>
          {isFree ? (
            <span className="text-sm font-black text-emerald-600">مجاني بالكامل</span>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-base font-black text-slate-900">{price}</span>
              <span className="text-[10px] font-bold text-slate-600">{currency}</span>
              {originalPrice && Number(originalPrice) > Number(price) && (
                <span className="text-[9px] text-slate-400 line-through font-medium mr-1">
                  {originalPrice}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-1">
          <button
            type="button"
            onClick={onSubscribe}
            disabled={isSubscribing}
            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Zap size={14} className="fill-current text-amber-300" />
            <span>{isSubscribing ? 'جاري التسجيل...' : isFree ? 'انضم مجاناً' : 'اشترك بالدورة الآن'}</span>
          </button>

          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center hover:bg-emerald-100 transition-all shrink-0 cursor-pointer"
              title="تواصل عبر الواتساب"
            >
              <MessageCircle size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
