import React from 'react';
import { Monitor, Smartphone, Tablet, Laptop } from 'lucide-react';
import { DeviceInfo } from '@/hooks/useDeviceTracker';

interface DeviceIconProps {
  type: DeviceInfo['type'];
  className?: string;
}

export const DeviceIcon: React.FC<DeviceIconProps> = ({ type, className }) => {
  switch (type) {
    case 'mobile':
      return <Smartphone className={className} size={24} />;
    case 'tablet':
      return <Tablet className={className} size={24} />;
    case 'laptop':
      return <Laptop className={className} size={24} />;
    case 'desktop':
    default:
      return <Monitor className={className} size={24} />;
  }
};
