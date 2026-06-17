import React from 'react';

export type DeviceMode = 'mobile' | 'tablet' | 'desktop';

export const DeviceModeContext = React.createContext<DeviceMode>('desktop');

export function useDeviceMode() {
  return React.useContext(DeviceModeContext);
}
