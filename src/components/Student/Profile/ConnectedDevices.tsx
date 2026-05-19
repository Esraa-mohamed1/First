'use client';

import React, { useState, useEffect } from 'react';
import { useDeviceTracker, DeviceInfo } from '@/hooks/useDeviceTracker';
import { DeviceCard } from './DeviceTracker/DeviceCard';
import { SessionsTable } from './DeviceTracker/SessionsTable';
import { ShieldCheck } from 'lucide-react';
import { getStoredAuthToken } from '@/lib/auth-storage';

export const ConnectedDevices = () => {
  const { currentDeviceId } = useDeviceTracker();
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real scenario, this would fetch from GET /api/users/[userId]/devices
    const fetchDevices = async () => {
      try {
        const token = getStoredAuthToken();
        const response = await fetch('/api/users/current/devices', {
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });
        if (response.ok) {
          const data = await response.json();
          setDevices(data);
        } else {
          throw new Error('Fallback to mock');
        }
      } catch (err) {
        // Fallback to only the currently tracked device
        const currentMockDevice: DeviceInfo = {
          id: currentDeviceId || 'current_dev',
          type: 'desktop',
          os: 'Windows 11',
          browser: 'Edge',
          ip: '192.168.1.100',
          location: 'الدمام، المملكة العربية السعودية',
          lastSeen: 'الآن',
          status: 'online',
          sessions: [
            { id: 's5', deviceId: currentDeviceId || 'current_dev', date: new Date().toLocaleString('ar-SA'), ip: '192.168.1.100', location: 'الدمام', pagesVisited: 1, duration: 'الآن' }
          ]
        };
        
        setDevices([currentMockDevice]);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [currentDeviceId]);

  // Set initial selected device
  useEffect(() => {
    if (devices.length > 0 && !selectedDeviceId) {
      // Prioritize current device or first online device
      const current = devices.find(d => d.id === currentDeviceId) || devices.find(d => d.status === 'online') || devices[0];
      setSelectedDeviceId(current.id);
    }
  }, [devices, currentDeviceId, selectedDeviceId]);

  const selectedDevice = devices.find(d => d.id === selectedDeviceId);

  return (
    <div className="bg-transparent mt-8">
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-blue-500" size={20} />
          <h2 className="text-lg font-bold text-gray-800">الأجهزة المتصلة</h2>
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          يتم تتبع نشاط الأجهزة
        </span>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-100 h-32 rounded-3xl"></div>
            <div className="bg-gray-100 h-32 rounded-3xl"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map(device => (
              <DeviceCard
                key={device.id}
                device={device}
                isActive={selectedDeviceId === device.id}
                isCurrentDevice={device.id === currentDeviceId}
                onClick={() => setSelectedDeviceId(device.id)}
              />
            ))}
          </div>

          {selectedDevice && (
            <div className="animate-fade-in">
              <SessionsTable sessions={selectedDevice.sessions} />
            </div>
          )}
        </>
      )}
    </div>
  );
};
