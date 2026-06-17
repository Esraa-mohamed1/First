'use client';

import React, { useState, useEffect } from 'react';
import { mockUserProfile } from '@/data/student/mockData';
import { ProfileHeader } from '@/components/Student/Profile/ProfileHeader';
import { PersonalInfo } from '@/components/Student/Profile/PersonalInfo';
import { SecuritySettings } from '@/components/Student/Profile/SecuritySettings';
import { AcademicProgress } from '@/components/Student/Profile/AcademicProgress';
import { ConnectedDevices } from '@/components/Student/Profile/ConnectedDevices';
import { getStudentProfile, updateStudentProfile } from '@/services/student-auth';
import { UserProfile } from '@/types/student';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getStudentProfile();
        // Backend returns user details. Let's normalize it
        const raw = response.data || response;
        if (raw) {
          setProfile({
            name: raw.name || raw.fullname || mockUserProfile.name,
            email: raw.email || mockUserProfile.email,
            phone: raw.phone || raw.mobile || mockUserProfile.phone,
            city: raw.city || mockUserProfile.city,
            avatar: raw.avatar || raw.avatar_url || mockUserProfile.avatar,
            points: raw.points ?? raw.points_balance ?? mockUserProfile.points,
            level: raw.level || raw.rank || mockUserProfile.level,
            progress: raw.progress ?? mockUserProfile.progress,
          });
        }
      } catch (err) {
        console.error('Error fetching student profile:', err);
        // Silently fallback to mock profile in case server is not connected or in dev
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async (updatedData: { name: string; email: string; phone: string; city: string }) => {
    try {
      const response = await updateStudentProfile(updatedData);
      const raw = response.data || response;
      
      // Update local React state with returned values (or updated values)
      setProfile(prev => ({
        ...prev,
        name: raw?.name || updatedData.name,
        email: raw?.email || updatedData.email,
        phone: raw?.phone || updatedData.phone,
        city: raw?.city || updatedData.city,
        avatar: raw?.avatar || raw?.avatar_url || prev.avatar,
      }));

      // Also save updated name in localStorage if needed (for header/greeting sync)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_name', raw?.name || updatedData.name);
        // If there's a cached user_info object, update it too
        const cachedUser = localStorage.getItem('user_info');
        if (cachedUser) {
          try {
            const u = JSON.parse(cachedUser);
            localStorage.setItem('user_info', JSON.stringify({ ...u, name: raw?.name || updatedData.name, email: raw?.email || updatedData.email }));
          } catch (e) {}
        }
      }

      toast.success('تم تحديث الملف الشخصي بنجاح!', {
        style: {
          fontFamily: 'IBM Plex Sans Arabic',
          fontWeight: 'bold',
          direction: 'rtl'
        }
      });
    } catch (err: any) {
      console.error('Error updating student profile:', err);
      const errMsg = err?.message || err?.error || 'فشل تحديث البيانات، يرجى المحاولة مرة أخرى.';
      toast.error(errMsg, {
        style: {
          fontFamily: 'IBM Plex Sans Arabic',
          fontWeight: 'bold',
          direction: 'rtl'
        }
      });
      throw err;
    }
  };

  return (
    <div className="space-y-6 animate-slide-up-fade">
      <ProfileHeader profile={profile} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Right Column (2/3 width) - Personal Info & Devices */}
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <PersonalInfo profile={profile} onSave={handleSaveProfile} />
          <ConnectedDevices />
        </div>
        
        {/* Left Column (1/3 width) - Security & Progress */}
        <div className="lg:col-span-1 space-y-6 order-1 lg:order-2">
          <SecuritySettings />
          <AcademicProgress progress={profile.progress} />
        </div>
      </div>
    </div>
  );
}
