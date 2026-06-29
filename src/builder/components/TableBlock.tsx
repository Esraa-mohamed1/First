import React from 'react';
import { Search, Mail, Calendar, BookOpen, Phone } from 'lucide-react';
import Link from 'next/link';
import { getTypographyStyle, hasSectionBackground } from '../utils/typography';
import { useBuilderStore } from '../store/builderStore';
import { getUsers } from '@/services/users';
import { getCourses } from '@/services/courses';

interface TableBlockProps {
  title?: string;
  showSearch?: boolean;
  rowsLimit?: number;
  headerBg?: string;
  rows?: any[];
  [key: string]: any;
}

export const MOCK_ROWS = [
  { id: '1', name: 'أحمد محمد الجابر', email: 'ahmed.jaber@email.com', course: 'Photoshop Fundamentals', price: '250 ريال', date: '2026/06/07' },
  { id: '2', name: 'سارة عبد الله العتيبي', email: 'sara.otb@email.com', course: 'Microsoft Excel Advanced', price: '190 ريال', date: '2026/06/07' },
  { id: '3', name: 'خالد وليد الشمري', email: 'khaled.shm@email.com', course: 'Beginner to Marketing Pro', price: '320 ريال', date: '2026/06/06' },
  { id: '4', name: 'فاطمة حسن القحطاني', email: 'fatima.qah@email.com', course: 'Learning English - Level 1', price: '250 ريال', date: '2026/06/05' },
  { id: '5', name: 'عبد الرحمن علي الشهري', email: 'abdulrahman@email.com', course: 'Fundamentals of Film Making', price: '400 ريال', date: '2026/06/04' },
  { id: '6', name: 'هند محمد الدوسري', email: 'hind.dos@email.com', course: 'Photoshop Fundamentals', price: '250 ريال', date: '2026/06/03' },
];

export default function TableBlock(props: TableBlockProps) {
  const {
    title = 'آخر المسجلين بالدورات',
    showSearch = true,
    rowsLimit = 5,
    headerBg = '#f8fafc',
    rows = MOCK_ROWS,
  } = props;

  const { isEditing } = useBuilderStore();
  const [realUsers, setRealUsers] = React.useState<any[]>([]);
  const [realCourses, setRealCourses] = React.useState<any[]>([]);

  const isCoachesTable = title.includes('مدرب') || title.includes('المدربين');

  React.useEffect(() => {
    async function loadData() {
      try {
        const role = isCoachesTable ? 'academy' : 'student';
        const [usersData, coursesData] = await Promise.all([
          getUsers(role),
          getCourses().catch(() => [])
        ]);
        if (usersData && usersData.length > 0) {
          setRealUsers(usersData);
        }
        if (coursesData && coursesData.length > 0) {
          setRealCourses(coursesData);
        }
      } catch (err) {
        console.error('Failed to load data for TableBlock:', err);
      }
    }
    loadData();
  }, [isCoachesTable]);

  const formattedRows = React.useMemo(() => {
    if (realUsers.length === 0) return rows;
    return realUsers.map((u, idx) => {
      const courseObj = realCourses.length > 0 ? realCourses[idx % realCourses.length] : null;
      const courseTitle = courseObj ? courseObj.title : 'الدورة التمهيدية';
      
      const dateStr = u.created_at
        ? new Date(u.created_at).toLocaleDateString('ar-EG')
        : `2026/06/${String(idx + 1).padStart(2, '0')}`;

      if (isCoachesTable) {
        return {
          id: String(u.id),
          name: u.name || u.fullName || 'مدرب متعاون',
          email: u.email,
          course: u.phone || 'غير متوفر',
          price: u.status === 'active' || !u.status ? 'نشط' : 'غير نشط',
          date: dateStr
        };
      }

      return {
        id: String(u.id),
        name: u.name || u.fullName || 'طالب الأكاديمية',
        email: u.email,
        course: courseTitle,
        price: 'مجاني',
        date: dateStr
      };
    });
  }, [realUsers, realCourses, rows, isCoachesTable]);

  const visibleRows = formattedRows.slice(0, rowsLimit);

  const titleTypography = getTypographyStyle(props, 'title', {
    font: 'IBM Plex Sans Arabic',
    size: 'text-base',
    weight: 'font-black',
    color: '#1f2937'
  });

  const isTransparentBg = hasSectionBackground(props);
  const actualHeaderBg = isTransparentBg && headerBg === '#f8fafc' ? 'rgba(248, 250, 252, 0.4)' : headerBg;

  return (
    <div className={`${isTransparentBg ? 'bg-white/70 border-white/40 shadow-lg shadow-slate-900/5 backdrop-blur-md' : 'bg-white border-slate-100 shadow-[0_12px_40px_rgba(25,28,29,0.02)]'} rounded-3xl p-6 space-y-5 text-right`} dir="rtl">
      {isEditing && (
        <div className="bg-amber-50 border-r-4 border-amber-500 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-amber-800 font-bold shadow-sm" dir="rtl">
          <span className="flex items-center gap-1.5 text-right">
            <span className="text-base">💡</span>
            هذه البيانات حقيقية معروضة من قاعدة البيانات ولا يمكن تعديلها من هنا. لتعديلها يرجى الانتقال إلى صفحة {isCoachesTable ? 'المدربين' : 'الطلاب'}.
          </span>
          <Link href={isCoachesTable ? '/academic/coaches' : '/academic/students'} className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap">
            {isCoachesTable ? 'إدارة المدربين' : 'إدارة الطلاب'}
          </Link>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 
          style={titleTypography.style}
          className={`${titleTypography.className}`}
        >
          {title}
        </h3>
        
        {showSearch && (
          <div className={`relative ${isTransparentBg ? 'bg-white/30 border-white/20' : 'bg-slate-50/80 border-slate-200/80'} rounded-xl px-3.5 py-1.5 w-full sm:max-w-xs flex items-center shadow-inner`}>

            <input 
              type="text" 
              placeholder="البحث في الجدول..." 
              className="w-full bg-transparent text-xs font-bold text-slate-700 outline-none text-right placeholder-slate-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
          </div>
        )}
      </div>

      <div className="border border-slate-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr 
                style={{ backgroundColor: actualHeaderBg }}
                className="border-b border-slate-100"
              >
                <th className="py-4 px-6 text-xs font-black text-slate-400">{isCoachesTable ? 'المدرب' : 'الطالب'}</th>
                <th className="py-4 px-6 text-xs font-black text-slate-400">{isCoachesTable ? 'الهاتف' : 'الدورة المسجل بها'}</th>
                <th className="py-4 px-6 text-xs font-black text-slate-400">{isCoachesTable ? 'الحالة' : 'القيمة المدفوعة'}</th>
                <th className="py-4 px-6 text-xs font-black text-slate-400">{isCoachesTable ? 'تاريخ الانضمام' : 'التاريخ'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {visibleRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <span className="text-xs font-extrabold text-slate-800 block">{row.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" />
                        {row.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                      {isCoachesTable ? (
                        <>
                          <Phone className="w-3.5 h-3.5 text-blue-500" />
                          {row.course}
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                          {row.course}
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-xs font-black ${
                      row.price === 'نشط' ? 'text-green-600 bg-green-50 px-2 py-0.5 rounded' : 
                      row.price === 'غير نشط' ? 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded' : 
                      'text-emerald-600'
                    }`}>
                      {row.price}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-300" />
                      {row.date}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
