import React from 'react';
import { DeviceSession } from '@/hooks/useDeviceTracker';
import { Clock, MapPin, Globe, Activity } from 'lucide-react';

interface SessionsTableProps {
  sessions: DeviceSession[];
}

export const SessionsTable: React.FC<SessionsTableProps> = ({ sessions }) => {
  if (sessions.length === 0) {
    return (
      <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-8 text-center mt-6">
        <p className="text-gray-500 text-sm">لا توجد سجلات نشاط متاحة لهذا الجهاز.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-bold text-gray-800 text-sm">سجل النشاطات الأخيرة</h3>
        <span className="text-xs text-gray-500">{sessions.length} جلسات</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-50/50 text-xs text-gray-500">
            <tr>
              <th className="py-3 px-4 font-medium">التاريخ والوقت</th>
              <th className="py-3 px-4 font-medium">الموقع و IP</th>
              <th className="py-3 px-4 font-medium">الصفحات المزورة</th>
              <th className="py-3 px-4 font-medium">مدة الجلسة</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-50">
            {sessions.map((session) => (
              <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-gray-700">{session.date}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                      <Globe size={12} className="text-gray-400" />
                      <span className="dir-ltr text-right">{session.ip}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-[10px]">
                      <MapPin size={10} className="text-gray-400" />
                      <span>{session.location}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-blue-400" />
                    <span className="text-gray-700 font-medium">{session.pagesVisited}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {session.duration}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
