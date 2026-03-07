'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const data = [
  { name: 'السعودية', value: 52.1, color: '#4880FF' },
  { name: 'مصر', value: 22.8, color: '#000000' },
  { name: 'الاردن', value: 13.9, color: '#C084FC' },
  { name: 'الكويت', value: 11.2, color: '#34D399' },
];

const AcademicVisitsByCountryChart = () => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex-1">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-gray-900">الزيارات حسب الدولة و المدينة</h3>
      </div>
      <div className="h-[250px] w-full flex items-center">
        <ResponsiveContainer width="50%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="w-1/2 flex flex-col gap-4 pr-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm font-bold text-gray-500">{item.name}</span>
              </div>
              <span className="text-sm font-black text-gray-900">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcademicVisitsByCountryChart;
