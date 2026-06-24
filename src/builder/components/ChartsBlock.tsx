'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { getTypographyStyle, hasSectionBackground } from '../utils/typography';

interface ChartsBlockProps {
  title?: string;
  chartType?: 'area' | 'bar' | 'line';
  primaryColor?: string;
  secondaryColor?: string;
  height?: number;
  showGrid?: boolean;
  [key: string]: any;
}

const MOCK_DATA = [
  { name: 'يناير', students: 420, revenue: 2400 },
  { name: 'فبراير', students: 580, revenue: 3500 },
  { name: 'مارس', students: 850, revenue: 5800 },
  { name: 'أبريل', students: 790, revenue: 4900 },
  { name: 'مايو', students: 1120, revenue: 7800 },
  { name: 'يونيو', students: 1480, revenue: 9200 },
];

export default function ChartsBlock(props: ChartsBlockProps) {
  const {
    title = 'إحصائيات التسجيل الشهري',
    chartType = 'area',
    primaryColor = 'var(--theme-primary)',
    secondaryColor = '#fbbf24',
    height = 300,
    showGrid = true,
  } = props;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    const isTransparentBg = hasSectionBackground(props);
    return (
      <div 
        style={{ height }}
        className={`w-full ${isTransparentBg ? 'bg-white/50 border-white/30 backdrop-blur-md shadow-sm' : 'bg-white border-slate-100 shadow-[0_12px_40px_rgba(25,28,29,0.02)]'} rounded-3xl p-6 flex flex-col justify-between animate-pulse`}
      >

        <div className="h-6 w-48 bg-slate-100 rounded-md"></div>
        <div className="flex-1 bg-slate-50/50 rounded-xl mt-4"></div>
      </div>
    );
  }

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={MOCK_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />}
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight="bold" tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} fontWeight="bold" tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '1rem', border: '1px solid #f1f5f9', fontFamily: 'IBM Plex Sans Arabic', fontSize: '11px', textAlign: 'right' }} />
            <Bar dataKey="students" fill={primaryColor} radius={[8, 8, 0, 0]} name="الطلاب الجدد" />
            <Bar dataKey="revenue" fill={secondaryColor} radius={[8, 8, 0, 0]} name="الأرباح (ريال)" />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={MOCK_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />}
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight="bold" tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} fontWeight="bold" tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '1rem', border: '1px solid #f1f5f9', fontFamily: 'IBM Plex Sans Arabic', fontSize: '11px', textAlign: 'right' }} />
            <Line type="monotone" dataKey="students" stroke={primaryColor} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="الطلاب الجدد" />
            <Line type="monotone" dataKey="revenue" stroke={secondaryColor} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="الأرباح (ريال)" />
          </LineChart>
        );
      case 'area':
      default:
        return (
          <AreaChart data={MOCK_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={secondaryColor} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={secondaryColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />}
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight="bold" tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} fontWeight="bold" tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '1rem', border: '1px solid #f1f5f9', fontFamily: 'IBM Plex Sans Arabic', fontSize: '11px', textAlign: 'right' }} />
            <Area type="monotone" dataKey="students" stroke={primaryColor} strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" name="الطلاب الجدد" />
            <Area type="monotone" dataKey="revenue" stroke={secondaryColor} strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="الأرباح (ريال)" />
          </AreaChart>
        );
    }
  };

  const titleTypography = getTypographyStyle(props, 'title', {
    font: 'IBM Plex Sans Arabic',
    size: 'text-base',
    weight: 'font-black',
    color: '#1f2937'
  });

  const isTransparentBg = hasSectionBackground(props);

  return (
    <div className={`${isTransparentBg ? 'bg-white/70 border-white/40 shadow-lg shadow-slate-900/5 backdrop-blur-md' : 'bg-white border-slate-100 shadow-[0_12px_40px_rgba(25,28,29,0.02)]'} rounded-3xl p-6 flex flex-col space-y-4 text-right`} dir="rtl">

      <div className="flex justify-between items-center pb-2 border-b border-slate-50">
        <h3 
          style={titleTypography.style}
          className={`${titleTypography.className}`}
        >
          {title}
        </h3>
        
        {/* Custom Legend Mock indicators */}
        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
          <span className="flex items-center gap-1.5">
            <span style={{ backgroundColor: primaryColor }} className="w-2 h-2 rounded-full"></span>
            الطلاب
          </span>
          <span className="flex items-center gap-1.5">
            <span style={{ backgroundColor: secondaryColor }} className="w-2 h-2 rounded-full"></span>
            الأرباح
          </span>
        </div>
      </div>

      <div style={{ height }} className="w-full relative mt-2">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
