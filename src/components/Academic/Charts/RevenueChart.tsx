'use client';

import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '01', income: 4000, expense: 2400 },
  { name: '02', income: 3000, expense: 3800 },
  { name: '03', income: 4500, expense: 2000 },
  { name: '04', income: 3200, expense: 4800 },
  { name: '05', income: 6000, expense: 3800 },
  { name: '06', income: 8000, expense: 3000 }, // Peak
  { name: '07', income: 4800, expense: 2200 },
  { name: '08', income: 4200, expense: 5800 },
  { name: '09', income: 6000, expense: 2600 },
  { name: '10', income: 3800, expense: 4200 },
  { name: '11', income: 5500, expense: 3000 },
  { name: '12', income: 7500, expense: 2800 },
];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#2563eb] text-white text-xs font-bold py-1 px-2 rounded-lg shadow-lg -translate-y-2">
          {`${Number(payload[0].value).toLocaleString()}`}
        </div>
      );
    }
    return null;
};

const RevenueChart = () => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-10">
        <div className="space-y-1">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">ايراد الشهر الحالي</h3>
            <p className="text-sm font-bold text-gray-400">تحليل الإيرادات والمصروفات خلال الشهر</p>
        </div>
        <select className="bg-gray-50 border border-gray-100 text-sm font-black text-gray-600 rounded-xl px-5 py-2.5 outline-none hover:bg-gray-100 transition-all">
          <option>أكتوبر</option>
          <option>سبتمبر</option>
        </select>
      </div>
      <div className="h-[300px] w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={12} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12 }} 
              dy={10}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              content={<CustomTooltip />}
            />
            <Bar dataKey="income" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
