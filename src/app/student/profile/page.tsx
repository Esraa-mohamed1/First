'use client';
import React, { useState, useEffect } from 'react';
import { ProfileHeader } from '@/components/Student/Profile/ProfileHeader';
import { PersonalInfo } from '@/components/Student/Profile/PersonalInfo';
import { SecuritySettings } from '@/components/Student/Profile/SecuritySettings';
import { ConnectedDevices } from '@/components/Student/Profile/ConnectedDevices';
import { getStudentProfile, updateStudentProfile } from '@/services/student-auth';
import { UserProfile } from '@/types/student';
import { normalizeProfileImageUrl } from '@/lib/utils';
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
          const avatarUrl = normalizeProfileImageUrl(raw.profile_image || raw.avatar || raw.image);
          setProfile({
            name: raw.name || '',
            email: raw.email || '',
            phone: raw.phone || '',
            avatar: avatarUrl || undefined,
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
      phone?: string;
    }
  ) => {
    try {
      const trimmedName = updatedData.name.trim();
      const trimmedEmail = updatedData.email.trim();
      const trimmedPhone = updatedData.phone ? updatedData.phone.trim() : '';

      const payload: { name: string; email: string; phone?: string } = {
        name: trimmedName,
        email: trimmedEmail,
      };

      if (trimmedPhone) {
        payload.phone = trimmedPhone;
      }

      const response = await updateStudentProfile(payload);
      const raw = response.data || response;

      const finalName = raw?.name || trimmedName;
      const finalEmail = raw?.email || trimmedEmail;
      const finalPhone = raw?.phone !== undefined ? (raw.phone || '') : (trimmedPhone || '');
      const returnedAvatar = raw?.profile_image || raw?.avatar;
      const finalAvatar = returnedAvatar ? normalizeProfileImageUrl(returnedAvatar) : profile?.avatar;

      setProfile(prev => {
        if (!prev) return prev;

        return {
          ...prev,
          name: finalName,
          email: finalEmail,
          phone: finalPhone,
          avatar: finalAvatar,
        };
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'user_name',
          finalName
        );

        const cachedUser = localStorage.getItem('user_info');

        if (cachedUser) {
          try {
            const u = JSON.parse(cachedUser);

            localStorage.setItem(
              'user_info',
              JSON.stringify({
                ...u,
                name: finalName,
                email: finalEmail,
                phone: finalPhone,
                ...(finalAvatar ? { profile_image: finalAvatar, avatar: finalAvatar } : {}),
              })
            );
          } catch (e) {
            console.error('Failed to update cached user info:', e);
          }
        }

        const updatedUser = {
          name: finalName,
          email: finalEmail,
          phone: finalPhone,
          profile_image: finalAvatar,
          avatar: finalAvatar,
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

  const handleAvatarFileSelected = async (file: File) => {
    if (!profile) return;

    try {
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('email', profile.email);

      if (profile.phone && profile.phone.trim()) {
        formData.append('phone', profile.phone.trim());
      }

      formData.append('profile_image', file);

      const response = await updateStudentProfile(formData);
      const raw = response.data || response;

      const returnedAvatar = raw?.profile_image || raw?.avatar;
      const finalAvatar = returnedAvatar ? normalizeProfileImageUrl(returnedAvatar) : profile.avatar;

      const finalName = raw?.name || profile.name;
      const finalEmail = raw?.email || profile.email;
      const finalPhone = raw?.phone !== undefined ? raw.phone : profile.phone;

      setProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          name: finalName,
          email: finalEmail,
          phone: finalPhone,
          avatar: finalAvatar,
        };
      });

      if (typeof window !== 'undefined') {
        const cachedUser = localStorage.getItem('user_info');
        if (cachedUser) {
          try {
            const u = JSON.parse(cachedUser);
            localStorage.setItem(
              'user_info',
              JSON.stringify({
                ...u,
                name: finalName,
                email: finalEmail,
                phone: finalPhone,
                ...(finalAvatar ? { profile_image: finalAvatar, avatar: finalAvatar } : {}),
              })
            );
          } catch (e) {
            console.error('Failed to update cached user info for avatar:', e);
          }
        }

        const updatedUser = {
          name: finalName,
          email: finalEmail,
          phone: finalPhone,
          profile_image: finalAvatar,
          avatar: finalAvatar,
        };

        window.dispatchEvent(
          new CustomEvent('student-profile-updated', {
            detail: updatedUser,
          })
        );
      }

      toast.success('تم تحديث الصورة الشخصية بنجاح!', {
        style: {
          fontFamily: 'IBM Plex Sans Arabic',
          fontWeight: 'bold',
          direction: 'rtl',
        },
      });
    } catch (err: any) {
      console.error('Error updating student profile avatar:', err);

      const errMsg =
        err?.message ||
        err?.error ||
        'فشل تحديث الصورة الشخصية، يرجى المحاولة مرة أخرى.';

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
      <ProfileHeader
        profile={profile}
        onAvatarFileSelected={handleAvatarFileSelected}
      />

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
          <SecuritySettings email={profile.email} />
        </div>

      </div>
    </div>
  );
}