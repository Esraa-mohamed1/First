import React from 'react';
import { DeviceInfo } from '@/hooks/useDeviceTracker';
import { DeviceIcon } from './DeviceIcon';
import { StatusDot } from './StatusDot';

interface DeviceCardProps {
  device: DeviceInfo;
  isActive: boolean;
  isCurrentDevice: boolean;
  onClick: () => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, isActive, isCurrentDevice, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`relative p-5 rounded-3xl flex flex-col justify-between border shadow-sm transition-all cursor-pointer overflow-hidden ${
        isActive ? 'bg-blue-50/50 border-blue-200 shadow-md' : 'bg-white border-gray-200 hover:shadow-md'
      }`}
    >
      {isCurrentDevice && (
        <div className="absolute top-0 right-0 bg-blue-100 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-bl-xl">
          الجهاز الحالي
        </div>
      )}
      
      {device.status === 'online' && (
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-green-500 rounded-l-full"></div>
      )}

      <div className="flex items-start gap-4 mb-3">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
          isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-500'
        }`}>
          <DeviceIcon type={device.type} />
        </div>
        
        <div className="flex-1 text-right mt-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800 text-sm">{device.os}</h3>
            <StatusDot status={device.status} />
          </div>
          <p className="text-xs text-gray-500 mt-1">{device.browser}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-gray-100 text-right">
        <div>
          <span className="block text-[10px] text-gray-400">الموقع (IP)</span>
          <span className="block text-xs font-medium text-gray-700 dir-ltr text-right">{device.ip}</span>
        </div>
        <div>
          <span className="block text-[10px] text-gray-400">آخر ظهور</span>
          <span className="block text-xs font-medium text-gray-700">{device.lastSeen}</span>
        </div>
        <div className="col-span-2 mt-1">
          <span className="text-xs text-gray-500">{device.location}</span>
        </div>
      </div>
    </div>
  );
};
