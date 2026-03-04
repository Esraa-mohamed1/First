import { Link as LinkIcon, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function SetupPage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black mb-4">معلومات الاكاديمية</h1>
          <p className="text-gray-500 text-lg">أدخل معلومات الأكاديمية الخاصة بك</p>
        </div>

        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Academy Name */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">أسم الاكاديمية</label>
              <input
                type="text"
                placeholder="اسم الاكاديمية"
                className="w-full p-4 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Mobile Number */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">رقم جوال اساسي</label>
              <input
                type="text"
                placeholder="ادخل رقم الجوال"
                className="w-full p-4 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-left"
                dir="ltr"
              />
            </div>

            {/* Country */}
            <div className="space-y-2 relative">
              <label className="block text-sm font-bold text-gray-700">الدولة</label>
              <div className="relative">
                <select className="w-full p-4 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-gray-500 cursor-pointer transition-all">
                  <option>الدولة</option>
                  <option>السعودية</option>
                  <option>مصر</option>
                  <option>الإمارات</option>
                </select>
                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Field/Category */}
            <div className="space-y-2 relative">
              <label className="block text-sm font-bold text-gray-700">المجال</label>
              <div className="relative">
                <select className="w-full p-4 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-gray-500 cursor-pointer transition-all">
                  <option>ادخل مجال الاكاديمية</option>
                  <option>تعليمي</option>
                  <option>تدريبي</option>
                  <option>استشاري</option>
                </select>
                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Academy Link */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">لينك الاكاديمية</label>
            <div className="relative">
              <input
                type="text"
                placeholder="ادخل اللينك"
                className="w-full p-4 pl-12 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-left"
                dir="ltr"
              />
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <Link
            href="/auth/processing"
            className="block w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xl rounded-xl transition-all shadow-lg shadow-blue-500/30 text-center active:scale-95"
          >
            بدة استخدام المنصة
          </Link>
        </form>
      </div>
    </div>
  );
}
