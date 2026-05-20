'use client';

import React from 'react';
import { AcademyPaymentSettingsForm } from '@/components/forms/AcademyPaymentSettingsForm';
import { Landmark } from 'lucide-react';

export default function AcademyPaymentSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
          <Landmark size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المالية</h1>
          <p className="text-gray-500">إدارة إعدادات الدفع والتحصيلات</p>
        </div>
      </div>

      <AcademyPaymentSettingsForm />
    </div>
  );
}

