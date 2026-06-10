import React from 'react';
import { mockUserProfile } from '@/data/student/mockData';
import { ProfileHeader } from '@/components/Student/Profile/ProfileHeader';
import { PersonalInfo } from '@/components/Student/Profile/PersonalInfo';
import { SecuritySettings } from '@/components/Student/Profile/SecuritySettings';
import { AcademicProgress } from '@/components/Student/Profile/AcademicProgress';
import { ConnectedDevices } from '@/components/Student/Profile/ConnectedDevices';

export default function ProfilePage() {
  return (
    <div className="space-y-6 animate-slide-up-fade">
      <ProfileHeader profile={mockUserProfile} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Right Column (2/3 width) - Personal Info & Devices (RTL format means this is right logically, but we place it first in grid for mobile or use col-span-2) */}
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <PersonalInfo profile={mockUserProfile} />
          <ConnectedDevices />
        </div>
        
        {/* Left Column (1/3 width) - Security & Progress */}
        <div className="lg:col-span-1 space-y-6 order-1 lg:order-2">
          <SecuritySettings />
          <AcademicProgress progress={mockUserProfile.progress} />
        </div>
      </div>
    </div>
  );
}
