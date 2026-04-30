import React from 'react';
import { Monitor, Smartphone, LogOut } from 'lucide-react';

export const ConnectedDevices = () => {
  return (
    <div className="bg-transparent mt-8">
      <div className="flex items-center gap-3 mb-6 px-2">
        <h2 className="text-lg font-bold text-gray-800">الأجهزة المتصلة</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mobile Device */}
        <div className="bg-white p-5 rounded-3xl flex items-center justify-between border border-gray-200 shadow-md hover:shadow-lg transition-shadow group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              <Smartphone size={24} />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-800 text-sm">iPhone 15</h3>
                <span className="text-xs text-gray-400">- جدة</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">منذ يومين</p>
            </div>
          </div>
        </div>

        {/* Laptop Device */}
        <div className="bg-white p-5 rounded-3xl flex items-center justify-between border border-gray-200 shadow-md hover:shadow-lg transition-shadow group cursor-pointer relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-green-500 rounded-l-full"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              <Monitor size={24} />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-800 text-sm">MacBook Pro</h3>
                <span className="text-xs text-gray-400">- الرياض</span>
              </div>
              <p className="text-xs text-green-600 font-bold mt-1">نشط الآن</p>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};
