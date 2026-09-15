'use client';

import React, { useState, useEffect } from 'react';
import { Menu, User } from 'lucide-react';
import {
  getSuperAdminProfile,
  SuperAdminProfile,
} from '@/services/super-admin-profile';

const Header = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const [name, setName] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const profile = await getSuperAdminProfile();
        if (isMounted && profile) {
          setName(profile.name || '');
          setProfileImage(profile.profile_image || null);
        }
      } catch (error) {
        console.error('Failed to fetch Super Admin profile in Header:', error);
      }
    };

    fetchProfile();

    const handleProfileUpdated = (event: CustomEvent<SuperAdminProfile>) => {
      if (event.detail) {
        setName(event.detail.name || '');
        setProfileImage(event.detail.profile_image || null);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(
        'super-admin-profile-updated',
        handleProfileUpdated as EventListener
      );
    }

    return () => {
      isMounted = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener(
          'super-admin-profile-updated',
          handleProfileUpdated as EventListener
        );
      }
    };
  }, []);

  return (
    <header className="bg-white h-20 border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
      {/* Right Side (Search & Toggle) */}
      <div className="flex items-center gap-2 md:gap-6">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all lg:hidden"
        >
          <Menu size={24} className="text-gray-600" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm overflow-hidden relative flex items-center justify-center">
            {profileImage ? (
              <img
                src={profileImage}
                alt={name || 'Super Admin'}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={20} className="text-blue-600" />
            )}
          </div>
          <div className="text-right hidden md:block">
            <h4 className="text-sm font-bold text-gray-900">
              {name || 'سوبر أدمن'}
            </h4>
            <p className="text-xs text-gray-500 font-medium">الادمن</p>
          </div>
        </div>
      </div>

      {/* Left Side placeholder to maintain flex spacing */}
      <div className="flex items-center gap-4" />
    </header>
  );
};

export default Header;

