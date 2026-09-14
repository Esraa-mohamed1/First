'use client';
import React, { useState, useEffect } from 'react';
import { ProfileHeader } from '@/components/Student/Profile/ProfileHeader';
import { PersonalInfo } from '@/components/Student/Profile/PersonalInfo';
import { SecuritySettings } from '@/components/Student/Profile/SecuritySettings';
import { ConnectedDevices } from '@/components/Student/Profile/ConnectedDevices';
import { getStudentProfile, updateStudentProfile } from '@/services/student-auth';
import { UserProfile } from '@/types/student';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getStudentProfile();

        const raw = response.data || response;

        if (raw) {
          setProfile({
            name: raw.name || '',
            email: raw.email || '',
            phone: raw.phone || '',
            avatar: raw.profile_image || undefined,
          });
        }
      } catch (err) {
        console.error('Error fetching student profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async (
    updatedData: {
      name: string;
      email: string;
      phone: string;
    }
  ) => {
    try {
      const response = await updateStudentProfile(updatedData);
      const raw = response.data || response;

      setProfile(prev => {
        if (!prev) return prev;

        return {
          ...prev,
          name: raw?.name || updatedData.name,
          email: raw?.email || updatedData.email,
          phone: raw?.phone || updatedData.phone,
          avatar: raw?.profile_image || prev.avatar,
        };
      });

      if (typeof window !== 'undefined') {
        const updatedName = raw?.name || updatedData.name;
        const updatedEmail = raw?.email || updatedData.email;
        const updatedPhone = raw?.phone || updatedData.phone;
        const updatedAvatar = raw?.profile_image;

        localStorage.setItem(
          'user_name',
          updatedName
        );

        const cachedUser = localStorage.getItem('user_info');

        if (cachedUser) {
          try {
            const u = JSON.parse(cachedUser);

            localStorage.setItem(
              'user_info',
              JSON.stringify({
                ...u,
                name: updatedName,
                email: updatedEmail,
                phone: updatedPhone,
                ...(updatedAvatar ? { profile_image: updatedAvatar } : {}),
              })
            );
          } catch (e) {
            console.error('Failed to update cached user info:', e);
          }
        }

        const updatedUser = {
          name: updatedName,
          email: updatedEmail,
          phone: updatedPhone,
          profile_image: updatedAvatar,
          avatar: updatedAvatar,
        };

        window.dispatchEvent(
          new CustomEvent('student-profile-updated', {
            detail: updatedUser,
          })
        );
      }

      toast.success('تم تحديث الملف الشخصي بنجاح!', {
        style: {
          fontFamily: 'IBM Plex Sans Arabic',
          fontWeight: 'bold',
          direction: 'rtl',
        },
      });
    } catch (err: any) {
      console.error('Error updating student profile:', err);

      const errMsg =
        err?.message ||
        err?.error ||
        'فشل تحديث البيانات، يرجى المحاولة مرة أخرى.';

      toast.error(errMsg, {
        style: {
          fontFamily: 'IBM Plex Sans Arabic',
          fontWeight: 'bold',
          direction: 'rtl',
        },
      });

      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">
          جاري تحميل الملف الشخصي...
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-red-500">
          تعذر تحميل بيانات الملف الشخصي.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up-fade">
      <ProfileHeader profile={profile} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Right Column - Personal Info & Devices */}
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <PersonalInfo
            profile={profile}
            onSave={handleSaveProfile}
          />

          <ConnectedDevices />
        </div>

        {/* Left Column - Security */}
        <div className="lg:col-span-1 space-y-6 order-1 lg:order-2">
          <SecuritySettings />
        </div>

      </div>
    </div>
  );
}