'use client';

const AcademicPackageCard = () => {
  const stats = [
    { label: 'تاريخ الانتهاء', value: '22/10/2022', progress: 84 },
    { label: 'نسبة استخدام الـ وايفاي', value: '62/150', progress: 62 },
    { label: 'نسبة استخدام الطلاب', value: '150/250', progress: 58 },
    { label: 'نسبة استخدام التخزين او الفيديو', value: '1.2TB/2TB', progress: 60 },
  ];

  return (
    <div className="bg-blue-600 p-8 rounded-[40px] text-white shadow-2xl shadow-blue-200">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-2xl font-black">الباقة الحالية</h3>
        <span className="bg-green-400 text-white px-5 py-2 rounded-full font-black text-sm">بريميوم</span>
      </div>

      <div className="space-y-8">
        {stats.map((stat, index) => (
          <div key={index} className="space-y-3">
            <div className="flex justify-between text-sm font-bold opacity-80">
              <span>{stat.label}</span>
              <span>{stat.value}</span>
            </div>
            <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-1000" 
                style={{ width: `${stat.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black text-xl mt-12 hover:bg-blue-50 transition-colors shadow-lg">
        ترقيه الباقة
      </button>
    </div>
  );
};

export default AcademicPackageCard;
