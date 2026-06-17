import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types/student';
import { User, Loader2 } from 'lucide-react';

interface PersonalInfoProps {
  profile: UserProfile;
  onSave: (updatedData: { name: string; email: string; phone: string; city: string }) => Promise<void>;
}

export const PersonalInfo = ({ profile, onSave }: PersonalInfoProps) => {
  const [name, setName] = useState(profile.name || '');
  const [email, setEmail] = useState(profile.email || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [city, setCity] = useState(profile.city || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(profile.name || '');
    setEmail(profile.email || '');
    setPhone(profile.phone || '');
    setCity(profile.city || '');
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({ name, email, phone, city });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-gray-200 shadow-md relative overflow-hidden">
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#EAEFEF] border border-gray-100 rounded-2xl px-5 py-3.5 text-gray-800 font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600 mr-2">البريد الإلكتروني</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            dir="ltr"
            className="w-full bg-[#EAEFEF] border border-gray-100 rounded-2xl px-5 py-3.5 text-gray-800 font-medium text-right focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600 mr-2">رقم الهاتف</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            dir="ltr"
            className="w-full bg-[#EAEFEF] border border-gray-100 rounded-2xl px-5 py-3.5 text-gray-800 font-medium text-right focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600 mr-2">المدينة</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-[#EAEFEF] border border-gray-100 rounded-2xl px-5 py-3.5 text-gray-800 font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all outline-none"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="bg-[#0f62fe] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving && <Loader2 size={16} className="animate-spin" />}
          <span>حفظ التغييرات</span>
        </button>
      </div>
    </form>
  );
};
