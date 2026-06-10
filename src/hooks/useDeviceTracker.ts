import { useEffect, useState } from 'react';
import { getStoredAuthToken } from '@/lib/auth-storage';

export interface DeviceSession {
  id: string;
  deviceId: string;
  date: string;
  ip: string;
  location: string;
  pagesVisited: number;
  duration: string;
}

export interface DeviceInfo {
  id: string;
  type: 'desktop' | 'mobile' | 'tablet' | 'laptop';
  os: string;
  browser: string;
  ip: string;
  location: string;
  lastSeen: string;
  status: 'online' | 'idle' | 'offline';
  sessions: DeviceSession[];
}

export const useDeviceTracker = () => {
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const fingerprintDevice = async () => {
      // Basic fingerprinting using UserAgent and LocalStorage
      let deviceId = localStorage.getItem('device_tracker_id');
      if (!deviceId) {
        deviceId = 'dev_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('device_tracker_id', deviceId);
      }
      setCurrentDeviceId(deviceId);

      const ua = navigator.userAgent;
      let type: DeviceInfo['type'] = 'desktop';
      if (/Mobi|Android/i.test(ua)) type = 'mobile';
      if (/Tablet|iPad/i.test(ua)) type = 'tablet';

      let os = 'Unknown OS';
      if (ua.indexOf('Win') !== -1) os = 'Windows';
      if (ua.indexOf('Mac') !== -1) os = 'MacOS';
      if (ua.indexOf('Linux') !== -1) os = 'Linux';
      if (ua.indexOf('Android') !== -1) os = 'Android';
      if (ua.indexOf('like Mac') !== -1) os = 'iOS';

      let browser = 'Unknown Browser';
      if (ua.indexOf('Chrome') !== -1) browser = 'Chrome';
      else if (ua.indexOf('Safari') !== -1) browser = 'Safari';
      else if (ua.indexOf('Firefox') !== -1) browser = 'Firefox';
      else if (ua.indexOf('Edge') !== -1) browser = 'Edge';

      const trackPayload = {
        deviceId,
        type,
        os,
        browser,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      };

      const token = getStoredAuthToken();

      try {
        await fetch('/api/track', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify(trackPayload),
        });
      } catch (err) {
        console.warn('Tracker API not available, falling back to mock tracking');
      }
    };

    fingerprintDevice();
  }, []);

  return { currentDeviceId };
};
