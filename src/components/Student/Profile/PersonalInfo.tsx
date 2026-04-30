import React from 'react';
import { UserProfile } from '@/types/student';
import { User } from 'lucide-react';

interface PersonalInfoProps {
  profile: UserProfile;
}

export const PersonalInfo = ({ profile }: PersonalInfoProps) => {
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-md relative overflow-hidden">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-50 text-blue-600 p-2.5 rounded-2xl">
          <User size={22} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">المعلومات الشخصية</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600 mr-2">الاسم الكامل</label>
          <input
            type="text"
            defaultValue={profile.name}
            className="w-full bg-[#EAEFEF] border border-gray-100 rounded-2xl px-5 py-3.5 text-gray-800 font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600 mr-2">البريد الإلكتروني</label>
          <input
            type="email"
            defaultValue={profile.email}
            dir="ltr"
            className="w-full bg-[#EAEFEF] border border-gray-100 rounded-2xl px-5 py-3.5 text-gray-800 font-medium text-right focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600 mr-2">رقم الهاتف</label>
          <input
            type="tel"
            defaultValue={profile.phone}
            dir="ltr"
            className="w-full bg-[#EAEFEF] border border-gray-100 rounded-2xl px-5 py-3.5 text-gray-800 font-medium text-right focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600 mr-2">المدينة</label>
          <input
            type="text"
            defaultValue={profile.city}
            className="w-full bg-[#EAEFEF] border border-gray-100 rounded-2xl px-5 py-3.5 text-gray-800 font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all outline-none"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button className="bg-[#0f62fe] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-[0.98]">
          حفظ التغييرات
        </button>
      </div>
    </div>
  );
};
