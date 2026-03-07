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
  { name: 'Linux', value: 400, color: '#60A5FA' },
  { name: 'Mac', value: 600, color: '#34D399' },
  { name: 'iOS', value: 300, color: '#000000' },
  { name: 'Windows', value: 700, color: '#60A5FA' },
  { name: 'Android', value: 500, color: '#C084FC' },
  { name: 'Other', value: 900, color: '#4ADE80' },
];

const AcademicVisitsByDeviceChart = () => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex-1">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-gray-900">الزيارات حسب الجهاز</h3>
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
              tickFormatter={(value) => `${value/10}k`}
            />
            <Tooltip 
              cursor={{ fill: '#f8faff' }}
              contentStyle={{ 
                backgroundColor: '#fff', 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
              }}
            />
            <Bar
              dataKey="value"
              radius={[6, 6, 6, 6]}
              barSize={16}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AcademicVisitsByDeviceChart;
