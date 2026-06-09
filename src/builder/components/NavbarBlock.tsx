import React from 'react';
import { Search, Bell, User, HelpCircle } from 'lucide-react';

interface NavbarBlockProps {
  title?: string;
  showSearch?: boolean;
  showProfile?: boolean;
  bgColor?: string;
  borderColor?: string;
}

export default function NavbarBlock({
  title = 'بوابة التعلم',
  showSearch = true,
  showProfile = true,
  bgColor = '#ffffff',
  borderColor = '#e2e8f0',
}: NavbarBlockProps) {
  return (
    <header 
      style={{ backgroundColor: bgColor, borderColor: borderColor }}
      className="w-full rounded-2xl border px-6 py-4 flex justify-between items-center shadow-sm select-none"
      dir="rtl"
    >
      {/* Brand logo details */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 shrink-0 font-extrabold text-sm">
          د
        </div>
        <span className="font-black text-slate-800 text-sm tracking-tight">{title}</span>
      </div>

      {/* Middle search input box */}
      {showSearch && (
        <div className="hidden md:flex items-center flex-1 max-w-sm mx-8 bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-1.5 relative shadow-inner">
          <input 
            type="text" 
            placeholder="البحث عن دروس أو معلمين..." 
            className="w-full bg-transparent text-[11px] font-bold text-slate-700 outline-none text-right placeholder-slate-400"
            dir="rtl"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
        </div>
      )}

      {/* Right icons info */}
      <div className="flex items-center gap-3">
        <div className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
        </div>
        
        <div className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer transition-colors">
          <HelpCircle className="w-4 h-4" />
        </div>

        {showProfile && (
          <div className="h-8 w-8 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-400 cursor-pointer shadow-sm ml-1">
            <User className="w-4 h-4" />
          </div>
        )}
      </div>

    </header>
  );
}
