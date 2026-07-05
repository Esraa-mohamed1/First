'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  FileText, 
  Eye, 
  AlertCircle, 
  User, 
  TrendingUp, 
  BookOpen, 
  Wallet,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { twMerge } from 'tailwind-merge';

const MySwal = withReactContent(Swal);

// Interface for payment requests stored in localStorage
interface PurchaseRequest {
  id: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  courseImage: string;
  amount: string;
  paymentMethod: string;
  receiptImage: string; // Base64 encoding for local storage preview
  status: 'pending' | 'accepted' | 'rejected';
  date: string;
  rejectionReason?: string;
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    setLoading(true);
    const stored = localStorage.getItem('darab_course_requests');
    if (stored) {
      try {
        setRequests(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Seed default requests if none exist
      const defaultRequests: PurchaseRequest[] = [
        {
          id: 'REQ-9041',
          studentName: 'أحمد محمد',
          studentEmail: 'student@darab.academy',
          courseId: '1',
          courseTitle: 'دورة أدوبي فوتوشوب للمبتدئين',
          courseImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqzo_VQo06VQCFdzirf_0z2ioWmpWofFyxtbeUSOpgDZrefJDg9H6UA9iCfqy4ro7yg5FfYec1hNWpAg3PRosaeLX6QWVUEzwo9ublQriYxfSfNDlWA1uW1O6hw0le5xYhMv7XPFhD6yd7QpDnU9K5cZxFvPxYlfNukbtioKQZrrRJZFrM7nRQG0i4Kox8vCBDr8AVXDoZiEZCpnzjCCNjg_6oXBTMLW_BrGX4m-hb12D3_A2ef40AdQp3X9xGODqnl-ASu_rn0GM',
          amount: '250 ريال',
          paymentMethod: 'Vodafone Cash',
          receiptImage: 'https://api.darab.academy/receiver-account-logos/vodafone-cash.png',
          status: 'pending',
          date: new Date().toLocaleDateString('ar-EG')
        }
      ];
      localStorage.setItem('darab_course_requests', JSON.stringify(defaultRequests));
      setRequests(defaultRequests);
    }
    setLoading(false);
  };

  const handleUpdateStatus = (id: string, newStatus: 'accepted' | 'rejected', reason?: string) => {
    const updated = requests.map(req => {
      if (req.id === id) {
        return { 
          ...req, 
          status: newStatus,
          rejectionReason: reason 
        };
      }
      return req;
    });

    localStorage.setItem('darab_course_requests', JSON.stringify(updated));
    setRequests(updated);
    toast.success(`تم تحديث حالة الطلب بنجاح إلى: ${newStatus === 'accepted' ? 'مقبول' : 'مرفوض'}`);
  };

  const handleAccept = async (req: PurchaseRequest) => {
    const result = await MySwal.fire({
      title: 'قبول طلب التسجيل؟',
      text: `سيتم تفعيل كورس "${req.courseTitle}" للطالب "${req.studentName}" فوراً.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'نعم، اقبل واشترك!',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b'
    });

    if (result.isConfirmed) {
      handleUpdateStatus(req.id, 'accepted');
    }
  };

  const handleReject = async (req: PurchaseRequest) => {
    const { value: reason } = await MySwal.fire({
      title: 'رفض طلب التسجيل',
      input: 'text',
      inputLabel: 'سبب الرفض (سيتم عرضه للطالب)',
      inputPlaceholder: 'أدخل سبب الرفض هنا...',
      showCancelButton: true,
      confirmButtonText: 'تأكيد الرفض',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#64748b',
      inputValidator: (value) => {
        if (!value) {
          return 'يجب عليك إدخال سبب الرفض لتوضيح التفاصيل للطالب!';
        }
      }
    });

    if (reason) {
      handleUpdateStatus(req.id, 'rejected', reason);
    }
  };

  const handleViewReceipt = (imageUrl: string) => {
    MySwal.fire({
      title: 'إيصال دفع العميل المرفق',
      html: (
        <div className="w-full overflow-hidden mt-4">
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block cursor-zoom-in group relative"
            title="اضغط لفتح الصورة بالحجم الكامل في نافذة جديدة"
          >
            <img
              src={imageUrl}
              alt="Receipt Proof"
              className="w-full h-auto max-h-[60vh] object-contain rounded-xl border border-gray-100 shadow-sm transition-transform duration-300 group-hover:scale-[1.01]"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
              <span className="text-white text-xs font-bold bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm">
                فتح الصورة بالحجم الكامل 🔍
              </span>
            </div>
          </a>
          <p className="text-[11px] text-gray-400 mt-3 font-semibold">
            اضغط على الصورة لعرضها بالحجم الكامل في علامة تبويب جديدة
          </p>
        </div>
      ),
      width: '800px',
      showCloseButton: true,
      confirmButtonText: 'إغلاق',
      confirmButtonColor: '#2563eb'
    });
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return req.status === filter && matchesSearch;
  });

  // Calculate statistics
  const totalCount = requests.length;
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const acceptedCount = requests.filter(r => r.status === 'accepted').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-10 pb-6 sm:pb-12 font-sans" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div className="text-right">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">طلبات اشتراك الطلاب</h1>
          <p className="text-gray-500 mt-1.5 font-medium text-sm sm:text-base md:text-lg">تحقق واعتمد طلبات الطلاب المسجلة عبر طرق الدفع فودافون كاش وإنستاباي والتحويلات اليدوية</p>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] border border-gray-150 shadow-sm flex items-center gap-3 sm:gap-4 lg:gap-6 group hover:border-blue-300 transition-all">
          <div className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-blue-50 text-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
          </div>
          <div className="text-right">
            <p className="text-gray-400 font-bold text-[10px] sm:text-xs mb-0.5 sm:mb-1">إجمالي الطلبات</p>
            <h3 className="text-base sm:text-xl lg:text-2xl font-black text-gray-900">{totalCount} <span className="text-[10px] sm:text-xs text-gray-400 font-bold">طلب</span></h3>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] border border-gray-150 shadow-sm flex items-center gap-3 sm:gap-4 lg:gap-6 group hover:border-amber-300 transition-all">
          <div className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-amber-50 text-amber-600 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 animate-pulse" />
          </div>
          <div className="text-right">
            <p className="text-gray-400 font-bold text-[10px] sm:text-xs mb-0.5 sm:mb-1">بانتظار المراجعة</p>
            <h3 className="text-base sm:text-xl lg:text-2xl font-black text-gray-900">{pendingCount} <span className="text-[10px] sm:text-xs text-amber-500 font-bold">معلق</span></h3>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] border border-gray-150 shadow-sm flex items-center gap-3 sm:gap-4 lg:gap-6 group hover:border-green-300 transition-all">
          <div className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-green-50 text-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
          </div>
          <div className="text-right">
            <p className="text-gray-400 font-bold text-[10px] sm:text-xs mb-0.5 sm:mb-1">مقبول ومفعل</p>
            <h3 className="text-base sm:text-xl lg:text-2xl font-black text-gray-900">{acceptedCount} <span className="text-[10px] sm:text-xs text-green-500 font-bold">نشط</span></h3>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] border border-gray-150 shadow-sm flex items-center gap-3 sm:gap-4 lg:gap-6 group hover:border-rose-300 transition-all">
          <div className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-rose-50 text-rose-600 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
          </div>
          <div className="text-right">
            <p className="text-gray-400 font-bold text-[10px] sm:text-xs mb-0.5 sm:mb-1">طلبات مرفوضة</p>
            <h3 className="text-base sm:text-xl lg:text-2xl font-black text-gray-900">{rejectedCount} <span className="text-[10px] sm:text-xs text-rose-500 font-bold">طلب</span></h3>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-[2.5rem] border border-gray-200 shadow-sm flex flex-col lg:flex-row items-center gap-4 sm:gap-6">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 sm:w-5 sm:h-5" />
          <input 
            type="text" 
            placeholder="البحث برقم الطلب، اسم الطالب، أو اسم الكورس..."
            className="w-full pr-11 sm:pr-16 pl-4 sm:pl-6 py-3 sm:py-4 bg-gray-50 border border-transparent hover:border-gray-200 focus:border-blue-600 focus:bg-white rounded-xl sm:rounded-[1.5rem] outline-none transition-all font-bold text-xs sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tab Filters */}
        <div className="flex bg-gray-100/80 p-1 rounded-xl sm:rounded-2xl w-full lg:w-auto self-stretch lg:self-auto shrink-0 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button
            onClick={() => setFilter('all')}
            className={twMerge(
              "flex-1 lg:flex-none px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all",
              filter === 'all' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
            )}
          >
            الكل ({totalCount})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={twMerge(
              "flex-1 lg:flex-none px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all",
              filter === 'pending' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
            )}
          >
            معلقة ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('accepted')}
            className={twMerge(
              "flex-1 lg:flex-none px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all",
              filter === 'accepted' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
            )}
          >
            مقبولة ({acceptedCount})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={twMerge(
              "flex-1 lg:flex-none px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all",
              filter === 'rejected' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
            )}
          >
            مرفوضة ({rejectedCount})
          </button>
        </div>
      </div>

      {/* Requests table container */}
      <div className="bg-white rounded-2xl sm:rounded-[2.5rem] lg:rounded-[3rem] border border-gray-200 shadow-sm overflow-hidden min-h-[400px] relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <AlertCircle size={48} className="mb-3 text-slate-300" />
            <p className="text-lg font-black text-gray-700">لا توجد طلبات اشتراك مطابقة للتصفية</p>
            <p className="text-xs text-gray-400 font-bold mt-1">تأكد من اختيار التصفية الصحيحة أو تعديل مصطلحات البحث</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-slate-400 font-black text-[10px] sm:text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6">رقم الطلب</th>
                  <th className="px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6">الطالب</th>
                  <th className="px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6">الدورة المطلوبة</th>
                  <th className="px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6">المبلغ وطريقة الدفع</th>
                  <th className="px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 text-center">الإيصال</th>
                  <th className="px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 text-center">الحالة</th>
                  <th className="px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-blue-50/10 transition-colors">
                    <td className="px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 font-black text-slate-700 text-xs sm:text-sm">{req.id}</td>
                    
                    <td className="px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
                          {req.studentName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-black text-gray-900 whitespace-nowrap">{req.studentName}</p>
                          <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 whitespace-nowrap">{req.studentEmail}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6">
                      <span className="text-xs font-black text-gray-800 line-clamp-2 min-w-[150px] max-w-[250px]">{req.courseTitle}</span>
                    </td>

                    <td className="px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6">
                      <div className="whitespace-nowrap">
                        <p className="text-xs font-black text-emerald-600">{req.amount}</p>
                        <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 mt-0.5">{req.paymentMethod}</p>
                      </div>
                    </td>

                    <td className="px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 text-center">
                      <button
                        onClick={() => handleViewReceipt(req.receiptImage)}
                        className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-gray-200 text-gray-500 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-black transition-all whitespace-nowrap"
                      >
                        <Eye size={12} className="sm:w-3.5 sm:h-3.5" />
                        <span>معاينة</span>
                      </button>
                    </td>

                    <td className="px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6">
                      <div className="flex justify-center">
                        <span className={twMerge(
                          "px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black border uppercase tracking-wider inline-flex items-center gap-1 sm:gap-1.5 whitespace-nowrap",
                          req.status === 'accepted' ? "bg-green-50 text-green-600 border-green-100" :
                          req.status === 'rejected' ? "bg-rose-50 text-rose-600 border-rose-100" :
                          "bg-amber-50 text-amber-600 border-amber-100"
                        )}>
                          <div className={twMerge(
                            "w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full",
                            req.status === 'accepted' ? "bg-green-500" :
                            req.status === 'rejected' ? "bg-rose-500" : "bg-amber-500"
                          )} />
                          {req.status === 'accepted' ? 'مقبول' : req.status === 'rejected' ? 'مرفوض' : 'معلق'}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 text-left">
                      {req.status === 'pending' ? (
                        <div className="flex justify-end gap-1.5 sm:gap-2">
                          <button
                            onClick={() => handleAccept(req)}
                            className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] sm:text-xs rounded-lg sm:rounded-xl shadow-md transition-all active:scale-95 whitespace-nowrap"
                          >
                            قبول وتفعيل
                          </button>
                          <button
                            onClick={() => handleReject(req)}
                            className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-rose-500 hover:bg-rose-600 text-white font-black text-[10px] sm:text-xs rounded-lg sm:rounded-xl shadow-md transition-all active:scale-95 whitespace-nowrap"
                          >
                            رفض الطلب
                          </button>
                        </div>
                      ) : (
                        <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 block max-w-[150px] truncate" title={req.status === 'accepted' ? 'تمت الموافقة والتفعيل' : `تم الرفض: ${req.rejectionReason || 'غير محدد'}`}>
                          {req.status === 'accepted' ? 'تمت الموافقة والتفعيل' : `تم الرفض: ${req.rejectionReason || 'غير محدد'}`}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
