import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types/student';
import { User, Camera } from 'lucide-react';
import Image from 'next/image';
import profileImg from '@/assets/profile.png';
import { AvatarUploadModal } from './AvatarUploadModal';

interface ProfileHeaderProps {
  profile: UserProfile;
  onAvatarFileSelected?: (file: File) => Promise<void>;
}

export const ProfileHeader = ({ profile, onAvatarFileSelected }: ProfileHeaderProps) => {
  const [imgError, setImgError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [profile.avatar]);

  return (
    <>
      <div className="bg-[#0f62fe] rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-lg shadow-blue-500/20">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4"></div>

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 w-full md:w-auto">
          {/* Avatar Area */}
          <div className="relative group">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-24 h-24 rounded-2xl bg-white border-4 border-white overflow-hidden shadow-md relative flex items-center justify-center cursor-pointer block transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/40"
              title="تغيير الصورة الشخصية"
            >
              {imgError ? (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <User size={32} className="text-gray-400" />
                </div>
              ) : (
                <Image
                  key={profile.avatar || 'default-avatar'}
                  src={profile.avatar && !imgError ? profile.avatar : profileImg.src}
                  alt={profile.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                  onError={() => setImgError(true)}
                />
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 z-10">
                <Camera size={20} />
                <span className="text-[9px] font-bold">تغيير</span>
              </div>
            </button>

            {/* Camera Badge Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="absolute -bottom-2 -right-2 bg-white text-blue-600 p-2 rounded-xl border-2 border-blue-50 hover:bg-blue-50 hover:scale-110 active:scale-95 transition-all shadow-md z-20"
              title="تغيير الصورة الشخصية"
            >
              <Camera size={14} />
            </button>
          </div>

          <div className="text-center md:text-right text-white">
            <h1 className="text-3xl font-bold mb-3 tracking-tight">{profile.name}</h1>
            <div className="flex items-center gap-3 justify-center md:justify-start">
            </div>
          </div>
        </div>
      </div>

      {onAvatarFileSelected && (
        <AvatarUploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentAvatar={profile.avatar}
          onAvatarFileSelected={onAvatarFileSelected}
        />
      )}
    </>
  );
};

