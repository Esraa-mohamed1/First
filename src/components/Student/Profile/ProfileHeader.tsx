import React from 'react';
import { UserProfile } from '@/types/student';
import { Edit2, Star, Shield, Award } from 'lucide-react';

interface ProfileHeaderProps {
  profile: UserProfile;
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  return (
    <div className="bg-[#0f62fe] rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-lg shadow-blue-500/20">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4"></div>

      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 w-full md:w-auto">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white overflow-hidden shadow-md flex items-center justify-center">
            {/* Avatar placeholder */}
            <div className="w-full h-full bg-gray-200"></div>
            <img src="assets/profile.jpg" alt="" />
          </div>
          <button className="absolute -bottom-3 -right-3 bg-green-400 text-white p-2 rounded-xl border-2 border-white hover:bg-green-500 transition-colors shadow-sm">
            <Shield size={16} />
          </button>
        </div>

        <div className="text-center md:text-right text-white">
          <h1 className="text-3xl font-bold mb-3 tracking-tight">{profile.name}</h1>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="flex items-center gap-1.5 bg-blue-700/50 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium border border-blue-500/30">
              <Award size={16} className="text-yellow-400" />
              <span>{profile.level}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-green-500/20 text-green-100 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium border border-green-400/30">
              <Star size={16} className="text-green-300" />
              <span>{profile.points} نقطة</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-6 md:mt-0 self-start md:self-center w-full md:w-auto">
        <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-white text-[#0f62fe] px-6 py-3 rounded-2xl font-bold hover:bg-blue-50 transition-colors shadow-sm">
          <Edit2 size={18} />
          تعديل الملف
        </button>
      </div>
    </div>
  );
};
