import React from 'react';
import { DeviceInfo } from '@/hooks/useDeviceTracker';

interface StatusDotProps {
  status: DeviceInfo['status'];
}

export const StatusDot: React.FC<StatusDotProps> = ({ status }) => {
  let colorClass = 'bg-gray-400'; // offline
  if (status === 'online') colorClass = 'bg-green-500';
  if (status === 'idle') colorClass = 'bg-yellow-400';

  return (
    <span className="relative flex h-3 w-3">
      {status === 'online' && (
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
      )}
      <span className={`relative inline-flex rounded-full h-3 w-3 ${colorClass}`}></span>
    </span>
  );
};
