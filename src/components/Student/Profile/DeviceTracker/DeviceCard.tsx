import React from 'react';
import { DeviceInfo } from '@/hooks/useDeviceTracker';
import { DeviceIcon } from './DeviceIcon';

interface DeviceCardProps {
  device: DeviceInfo;
  isActive: boolean;
  isCurrentDevice: boolean;
  onClick: () => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  isActive,
  isCurrentDevice,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-3xl flex flex-col justify-between border shadow-sm transition-all cursor-pointer overflow-hidden ${isActive
          ? 'bg-blue-50/50 border-blue-200 shadow-md'
          : 'bg-white border-gray-200 hover:shadow-md'
        }`}
    >
      {isCurrentDevice && (
        <div className="absolute top-0 right-0 bg-blue-100 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-bl-xl">
          الجهاز الحالي
        </div>
      )}

      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isActive
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-50 text-gray-500'
            }`}
        >
          <DeviceIcon type={device.type} />
        </div>

        <div className="flex-1 text-right mt-1">
          <h3 className="font-bold text-gray-800 text-sm">
            {device.os || 'الجهاز الحالي'}
          </h3>

          <div className="mt-2">
            <span className="block text-[10px] text-gray-400">
              آخر ظهور
            </span>
            <span className="block text-xs font-medium text-gray-700">
              {device.lastSeen}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
