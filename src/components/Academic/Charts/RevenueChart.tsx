'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const data = [
  { name: '01', value: 400 },
  { name: '02', value: 600 },
  { name: '03', value: 300 },
  { name: '04', value: 700 },
  { name: '05', value: 500 },
  { name: '06', value: 900 },
  { name: '07', value: 600 },
  { name: '08', value: 400 },
  { name: '09', value: 700 },
  { name: '10', value: 300 },
  { name: '11', value: 800 },
  { name: '12', value: 500 },
];

const AcademicRevenueChart = () => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-gray-900">ايراد الشهر الحالي</h3>
        <select className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-500 outline-none">
            <option>اكتوبر</option>
        </select>
      </div>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
            />
            <Tooltip 
              cursor={{ fill: '#f8faff' }}
              contentStyle={{ 
                backgroundColor: '#fff', 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
              }}
              labelStyle={{ fontWeight: 800, color: '#1e293b' }}
            />
            <Bar
              dataKey="value"
              radius={[6, 6, 6, 6]}
              barSize={12}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4880FF' : '#E2E8F0'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AcademicRevenueChart;
