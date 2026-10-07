'use client';

import React from 'react';

interface BankSkeletonProps {
  mode: 'grid' | 'list';
}

export default function BankSkeleton({ mode }: BankSkeletonProps) {
  if (mode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4 relative overflow-hidden"
          >
            {/* Top Color Accent */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gray-200" />

            <div className="flex items-start justify-between gap-3 pt-1">
              <div className="w-12 h-12 rounded-2xl bg-gray-100" />
              <div className="w-16 h-6 rounded-full bg-gray-100" />
            </div>

            <div className="space-y-2">
              <div className="w-3/4 h-5 bg-gray-200 rounded-md" />
              <div className="w-full h-3 bg-gray-100 rounded-md" />
              <div className="w-2/3 h-3 bg-gray-100 rounded-md" />
            </div>

            <div className="flex gap-2 pt-2">
              <div className="w-16 h-6 bg-gray-100 rounded-lg" />
              <div className="w-16 h-6 bg-gray-100 rounded-lg" />
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
              <div className="w-24 h-3 bg-gray-100 rounded-md" />
              <div className="w-6 h-6 bg-gray-100 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-pulse">
      <div className="w-32 h-4 bg-gray-200 rounded-md mb-2" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-start gap-4"
        >
          <div className="w-11 h-11 rounded-xl bg-gray-100 shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="w-5/6 h-4 bg-gray-200 rounded-md" />
            <div className="w-1/2 h-3 bg-gray-100 rounded-md" />
          </div>
          <div className="w-20 h-6 bg-gray-100 rounded-full shrink-0" />
        </div>
      ))}
    </div>
  );
}
