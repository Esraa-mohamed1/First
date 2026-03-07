'use client';

import { Plus, GraduationCap, Users, UserPlus, Eye, MessageCircle } from 'lucide-react';

const AcademicQuickActions = () => {
  const actions = [
    { label: 'إضافة دورة', icon: Plus, color: 'bg-blue-600', href: '#' },
    { label: 'إضافة مدرب', icon: Plus, color: 'bg-blue-600', href: '#' },
    { label: 'إضافة طالب', icon: Plus, color: 'bg-blue-600', href: '#' },
    { label: 'عرض الدورات', icon: Eye, color: 'bg-blue-600', href: '#' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`${action.color} text-white p-6 rounded-3xl flex items-center justify-between font-black text-xl hover:shadow-xl transition-all group overflow-hidden relative`}
          >
            <div className="relative z-10 flex items-center gap-3">
              <action.icon size={28} />
              <span>{action.label}</span>
            </div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full group-hover:scale-150 transition-transform"></div>
          </button>
        ))}
      </div>
      
      <button className="w-full bg-blue-600 text-white p-6 rounded-3xl flex items-center justify-center gap-3 font-black text-2xl hover:shadow-xl transition-all shadow-lg shadow-blue-100">
        <MessageCircle size={32} />
        <span>ارسال رسالة للطلاب</span>
      </button>
    </div>
  );
};

export default AcademicQuickActions;
