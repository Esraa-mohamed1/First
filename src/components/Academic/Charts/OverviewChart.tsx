'use client';

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'يناير', value: 20 },
  { name: 'فبراير', value: 26 },
  { name: 'مارس', value: 26 },
  { name: 'أبريل', value: 29 },
  { name: 'مايو', value: 30 },
  { name: 'يونيو', value: 34 },
  { name: 'يوليو', value: 48 },
  { name: 'أغسطس', value: 40 },
  { name: 'سبتمبر', value: 39 },
  { name: 'أكتوبر', value: 42 },
  { name: 'نوفمبر', value: 51 },
  { name: 'ديسمبر', value: 31 },
  { name: 'يناير', value: 39 },
  { name: 'فبراير', value: 35 },
  { name: 'مارس', value: 47 },
  { name: 'أبريل', value: 52 },
  { name: 'مايو', value: 42 },
  { name: 'يونيو', value: 42 },
  { name: 'يوليو', value: 86 }, // The peak point
  { name: 'أغسطس', value: 35 },
  { name: 'سبتمبر', value: 43 },
  { name: 'أكتوبر', value: 52 },
  { name: 'نوفمبر', value: 49 },
  { name: 'ديسمبر', value: 46 },
  { name: 'يناير', value: 47 },
  { name: 'فبراير', value: 41 },
  { name: 'مارس', value: 54 },
  { name: 'أبريل', value: 42 },
  { name: 'مايو', value: 44 },
  { name: 'يونيو', value: 47 },
  { name: 'يوليو', value: 48 },
  { name: 'أغسطس', value: 57 },
  { name: 'سبتمبر', value: 56 },
  { name: 'أكتوبر', value: 61 },
  { name: 'نوفمبر', value: 24 },
  { name: 'ديسمبر', value: 31 },
  { name: 'يناير', value: 32 },
  { name: 'فبراير', value: 27 },
  { name: 'مارس', value: 47 },
  { name: 'أبريل', value: 46 },
  { name: 'مايو', value: 48 },
  { name: 'يونيو', value: 47 },
  { name: 'يوليو', value: 43 },
  { name: 'أغسطس', value: 72 }, // Another high point
  { name: 'سبتمبر', value: 59 },
  { name: 'أكتوبر', value: 65 },
  { name: 'نوفمبر', value: 60 },
  { name: 'ديسمبر', value: 60 },
  { name: 'يناير', value: 53 },
  { name: 'فبراير', value: 52 },
  { name: 'مارس', value: 52 },
  { name: 'أبريل', value: 58 },
  { name: 'مايو', value: 42 },
  { name: 'يونيو', value: 56 },
  { name: 'يوليو', value: 51 },
  { name: 'أغسطس', value: 57 },
  { name: 'سبتمبر', value: 52 },
  { name: 'أكتوبر', value: 48 },
  { name: 'نوفمبر', value: 55 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#2563eb] text-white text-xs font-bold py-1 px-2 rounded-lg shadow-lg -translate-y-2">
          {`${Number(payload[0].value).toFixed(2)}`}
        </div>
      );
    }
    return null;
};

const OverviewChart = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-black text-gray-900">تفاصيل اخر 12 شهر</h3>
      </div>
      <div className="h-[300px] w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 10 }} 
              interval={4}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 10 }} 
              dx={-10}
              tickFormatter={(value) => `${value}%`}
              domain={[20, 100]}
              ticks={[20, 40, 60, 80, 100]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2563eb', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#2563eb" 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#colorValue)" 
              activeDot={{ r: 6, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OverviewChart;
