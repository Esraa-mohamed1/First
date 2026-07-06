'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  GraduationCap, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Upload, 
  Plus, 
  Image as ImageIcon, 
  Wallet, 
  ChevronRight, 
  Loader2 
} from 'lucide-react';
import { getStudentCourses, getMySubscriptions, enrollInCourse } from '@/services/student-courses';
import { Course } from '@/types/student';
import { getLogoUrl } from '@/lib/utils';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

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

export default function StudentRequestsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState('');
  const [amount, setAmount] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptBase64, setReceiptBase64] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Derive current course and its payment methods
  const selectedCourse = useMemo(() => {
    return courses.find(c => String(c.id) === selectedCourseId);
  }, [courses, selectedCourseId]);

  const currentCoursePaymentMethods = useMemo(() => {
    if (!selectedCourse) return [];
    const raw = (selectedCourse as any).payment_methods || (selectedCourse as any).receiverAccounts || (selectedCourse as any).receiver_accounts || [];
    return raw.map((item: any) => ({
      methodId: (item.methodId || item.method_id || item.id)?.toString() || '',
      methodName: item.name || item.methodName || '',
      type: 'account_number' as const,
      value: item.value || item.accountValue || item.account_value || '',
      currency: item.currency || 'SAR',
      logo: item.logo || undefined
    }));
  }, [selectedCourse]);

  // Sync amount and auto-select first payment method when selected course changes
  useEffect(() => {
    if (selectedCourse) {
      const priceVal = (selectedCourse as any).final_price || (selectedCourse as any).price || '';
      setAmount(String(priceVal));

      if (currentCoursePaymentMethods.length > 0) {
        setSelectedPaymentMethodId(currentCoursePaymentMethods[0].methodId);
      } else {
        setSelectedPaymentMethodId('');
      }
    } else {
      setAmount('');
      setSelectedPaymentMethodId('');
    }
  }, [selectedCourseId, currentCoursePaymentMethods, selectedCourse]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const backendRequests = await getMySubscriptions();
      
      // Retrieve student info from localStorage if exists
      let sName = 'أحمد محمد';
      let sEmail = 'student@darab.academy';
      const userInfoStr = localStorage.getItem('user_info');
      if (userInfoStr) {
        try {
          const parsed = JSON.parse(userInfoStr);
          sName = parsed.name || sName;
          sEmail = parsed.email || sEmail;
        } catch (e) {}
      }

      const mapped: PurchaseRequest[] = (backendRequests || []).map((req: any) => {
        let resolvedStatus: PurchaseRequest['status'] = 'pending';
        if (req.status === 'accepted' || req.status === 'active') resolvedStatus = 'accepted';
        else if (req.status === 'rejected' || req.status === 'cancelled') resolvedStatus = 'rejected';
        else if (req.status === 'penidng' || req.status === 'pending') resolvedStatus = 'pending';

        const courseTitle = req.course?.title || 'دورة تعليمية';
        const courseImage = req.course?.image ? getLogoUrl(req.course.image) : '';
        const finalPrice = req.course?.final_price || req.course?.price || '';
        const currency = req.course?.currency || 'SAR';
        const formattedAmount = finalPrice ? `${finalPrice} ${currency}` : '';

        return {
          id: req.transaction_id || `REQ-${req.id}`,
          studentName: sName,
          studentEmail: sEmail,
          courseId: String(req.course_id || req.course?.id || ''),
          courseTitle,
          courseImage,
          amount: formattedAmount,
          paymentMethod: req.payment_method || 'تحويل بنكي',
          receiptImage: getLogoUrl(req.receipt),
          status: resolvedStatus,
          date: req.created_at ? new Date(req.created_at).toLocaleDateString('ar-EG') : new Date().toLocaleDateString('ar-EG'),
          rejectionReason: req.message || req.rejection_reason || req.rejectionReason || ''
        };
      });
      setRequests(mapped);
    } catch (err) {
      console.error('Failed to load subscription requests:', err);
      toast.error('فشل في تحميل سجل طلبات الاشتراك');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Fetch available courses
    const fetchCourses = async () => {
      try {
        const fetchedCourses = await getStudentCourses();
        // Normalize each course to ensure it has payment_methods if not defined or empty
        const normalized = (fetchedCourses || []).map((c: any) => {
          const raw = c.payment_methods || c.receiverAccounts || c.receiver_accounts || [];
          const priceVal = c.final_price || c.price || 0;
          const hasPaymentMethods = raw.length > 0;
          
          let resolvedMethods = raw;
          if (!hasPaymentMethods && Number(priceVal) > 0) {
            resolvedMethods = [
              { id: 'vodafone_cash', name: 'فودافون كاش', value: '01012345678', logo: 'https://api.darab.academy/receiver-account-logos/vodafone-cash.png' },
              { id: 'instapay', name: 'إنستا باي', value: 'username@instapay', logo: 'https://api.darab.academy/receiver-account-logos/instapay.png' },
              { id: 'bank_transfer', name: 'تحويل بنكي', value: '1234-5678-9012-3456', logo: 'https://api.darab.academy/receiver-account-logos/bank.png' }
            ];
          }
          return {
            ...c,
            payment_methods: resolvedMethods
          };
        });
        setCourses(normalized);
      } catch (err) {
        console.error('Failed to load student courses:', err);
        // Fallback courses for demonstration
        setCourses([
          {
            id: '1',
            title: 'دورة أدوبي فوتوشوب للمبتدئين',
            slug: 'photoshop',
            description: '',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqzo_VQo06VQCFdzirf_0z2ioWmpWofFyxtbeUSOpgDZrefJDg9H6UA9iCfqy4ro7yg5FfYec1hNWpAg3PRosaeLX6QWVUEzwo9ublQriYxfSfNDlWA1uW1O6hw0le5xYhMv7XPFhD6yd7QpDnU9K5cZxFvPxYlfNukbtioKQZrrRJZFrM7nRQG0i4Kox8vCBDr8AVXDoZiEZCpnzjCCNjg_6oXBTMLW_BrGX4m-hb12D3_A2ef40AdQp3X9xGODqnl-ASu_rn0GM',
            instructor_name: 'م. محمد المفتي',
            price: '500',
            final_price: '250',
            currency: 'SAR',
            payment_methods: [
              { id: 'vodafone_cash', name: 'فودافون كاش', value: '01012345678', logo: 'https://api.darab.academy/receiver-account-logos/vodafone-cash.png' },
              { id: 'instapay', name: 'إنستا باي', value: 'username@instapay', logo: 'https://api.darab.academy/receiver-account-logos/instapay.png' },
              { id: 'bank_transfer', name: 'تحويل بنكي', value: '1234-5678-9012-3456', logo: 'https://api.darab.academy/receiver-account-logos/bank.png' }
            ]
          } as any,
          {
            id: '2',
            title: 'ميكروسوفت إكسيل من الصفر للاحتراف',
            slug: 'excel',
            description: '',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDapuZMqMbglOubBSplHYKHbUUEPOVBNZfPBYfEdrnbwVoJA6p_fXveTFrcYVKfSEKsCZOzcikKHpuWVQRu4n8xxKYXhgM_nanjOQ0cdv-kXhVbMcOq5kzHgm5DH5WlDzYGmDh0ROSe4C_qATsLJhy-iZA4oKXn9HQImP6_0u46v5kDYayBS8_wDmyGvixd7EoZGbUePlgROCvJVAy1-l6nThq3n3XvQJDoOFPy76n8F28rsKmL09nMbF_TcgXK5YffQFE2uS-uFwI',
            instructor_name: 'أ. صهيب حسن',
            price: '400',
            final_price: '200',
            currency: 'SAR',
            payment_methods: [
              { id: 'vodafone_cash', name: 'فودافون كاش', value: '01012345678', logo: 'https://api.darab.academy/receiver-account-logos/vodafone-cash.png' },
              { id: 'instapay', name: 'إنستا باي', value: 'username@instapay', logo: 'https://api.darab.academy/receiver-account-logos/instapay.png' },
              { id: 'bank_transfer', name: 'تحويل بنكي', value: '1234-5678-9012-3456', logo: 'https://api.darab.academy/receiver-account-logos/bank.png' }
            ]
          } as any,
          {
            id: '3',
            title: 'أساسيات صناعة المحتوى والأفلام',
            slug: 'filmmaking',
            description: '',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqzo_VQo06VQCFdzirf_0z2ioWmpWofFyxtbeUSOpgDZrefJDg9H6UA9iCfqy4ro7yg5FfYec1hNWpAg3PRosaeLX6QWVUEzwo9ublQriYxfSfNDlWA1uW1O6hw0le5xYhMv7XPFhD6yd7QpDnU9K5cZxFvPxYlfNukbtioKQZrrRJZFrM7nRQG0i4Kox8vCBDr8AVXDoZiEZCpnzjCCNjg_6oXBTMLW_BrGX4m-hb12D3_A2ef40AdQp3X9xGODqnl-ASu_rn0GM',
            instructor_name: 'م. عمرو البرلسي',
            price: '600',
            final_price: '300',
            currency: 'SAR',
            payment_methods: [
              { id: 'vodafone_cash', name: 'فودافون كاش', value: '01012345678', logo: 'https://api.darab.academy/receiver-account-logos/vodafone-cash.png' },
              { id: 'instapay', name: 'إنستا باي', value: 'username@instapay', logo: 'https://api.darab.academy/receiver-account-logos/instapay.png' },
              { id: 'bank_transfer', name: 'تحويل بنكي', value: '1234-5678-9012-3456', logo: 'https://api.darab.academy/receiver-account-logos/bank.png' }
            ]
          } as any
        ]);
      }
    };
    fetchCourses();
    loadRequests();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      setPreviewUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !amount || !receiptFile || !selectedPaymentMethodId) {
      toast.error('الرجاء إدخال جميع الحقول وتحديد طريقة الدفع وإرفاق إيصال الدفع');
      return;
    }

    setSubmitting(true);
    
    try {
      await enrollInCourse(selectedCourseId, selectedPaymentMethodId, receiptFile);
      
      setSubmitting(false);
      setShowAddForm(false);

      // Reset form
      setSelectedCourseId('');
      setSelectedPaymentMethodId('');
      setAmount('');
      setReceiptFile(null);
      setPreviewUrl(null);
      setReceiptBase64('');

      MySwal.fire({
        title: 'تم إرسال طلب الشراء بنجاح!',
        text: 'طلبك قيد المراجعة حالياً من قبل إدارة الأكاديمية. يمكنك تتبع حالة الطلب من هذه الصفحة.',
        icon: 'success',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#2563eb'
      });

      // Refresh list
      loadRequests();
    } catch (error: any) {
      setSubmitting(false);
      const errMsg = error?.message || 'حدث خطأ أثناء إرسال طلب الاشتراك، يرجى المحاولة مرة أخرى.';
      toast.error(errMsg);
    }
  };

  const getStatusBadge = (status: PurchaseRequest['status']) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="flex items-center gap-1.5 px-5 py-3 rounded-xl text-xs font-black bg-emerald-50 text-emerald-600 border border-emerald-100/60 shadow-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>تم القبول والاشتراك</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1.5 px-5 py-3 rounded-xl text-xs font-black bg-rose-50 text-rose-600 border border-rose-100/60 shadow-sm">
            <XCircle className="w-4 h-4" />
            <span>مرفوض</span>
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="flex items-center gap-1.5 px-5 py-3 rounded-xl text-xs font-black bg-amber-50 text-amber-600 border border-amber-100/60 shadow-sm">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>قيد المراجعة</span>
          </span>
        );
    }
  };

  const handleShowReceipt = (imageUrl: string) => {
    MySwal.fire({
      title: 'إيصال التحويل المرفق',
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
              alt="Receipt Image"
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

  return (
    <div className="space-y-8 animate-fade-in font-sans" dir="rtl">
      
      {/* Header Container */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1 text-right">
            <h1 className="text-3xl font-black text-gray-900">طلبات الشراء والاشتراكات</h1>
            <p className="text-gray-500 text-sm font-semibold">تتبع وقدم طلبات الاشتراك في الدورات التدريبية عبر الدفع اليدوي وإيصالات التحويل</p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-lg shadow-blue-500/15 active:scale-95 transition-all w-full md:w-auto"
          >
            {showAddForm ? (
              <>
                <ChevronRight className="w-4 h-4" />
                <span>العودة للطلبات</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[3px]" />
                <span>طلب اشتراك بدورة جديدة</span>
              </>
            )}
          </button>
        </div>
      </div>

      {showAddForm ? (
        /* Submission Purchase Form */
        <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-8 animate-slide-up-fade">
          <h2 className="text-xl font-black text-gray-900 border-b border-gray-50 pb-4 mb-6">طلب اشتراك جديد بدورة</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6 text-right">
            {/* Select Course */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 block pr-1">الدورة التدريبية المطلوبة</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full p-4 bg-gray-50/80 border border-gray-100 hover:border-gray-200 focus:border-blue-500 focus:bg-white rounded-2xl text-xs font-bold text-gray-700 outline-none transition-all appearance-none"
                required
              >
                <option value="">اختر الدورة...</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 block pr-1">طريقة الدفع المستخدمة</label>
              {selectedCourseId ? (
                currentCoursePaymentMethods.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentCoursePaymentMethods.map((pm: any) => (
                      <label
                        key={pm.methodId}
                        className={`flex items-center gap-3 p-4 border rounded-2xl cursor-pointer hover:bg-slate-50 transition-all ${
                          selectedPaymentMethodId === pm.methodId
                            ? 'border-blue-500 bg-blue-50/10'
                            : 'border-gray-100 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={pm.methodId}
                          checked={selectedPaymentMethodId === pm.methodId}
                          onChange={() => setSelectedPaymentMethodId(pm.methodId)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <span className="text-xs font-black text-gray-700 block">{pm.methodName}</span>
                          <span className="text-[9px] font-bold text-gray-400">{pm.value}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-xs text-gray-400 font-bold">لا تتوفر طرق دفع لهذه الدورة حالياً</p>
                  </div>
                )
              ) : (
                <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-xs text-gray-400 font-bold">الرجاء اختيار الدورة التدريبية أولاً لعرض طرق الدفع المتاحة</p>
                </div>
              )}
            </div>

            {/* Paid Amount */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 block pr-1">المبلغ الذي قمت بدفعه (ريال/جنيه)</label>
              <input
                type="number"
                placeholder="أدخل قيمة المبلغ المدفوع"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-4 bg-gray-50/80 border border-gray-100 hover:border-gray-200 focus:border-blue-500 focus:bg-white rounded-2xl text-xs font-bold text-gray-700 outline-none transition-all"
                required
              />
            </div>

            {/* Receipt Upload Drop Zone */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 block pr-1">صورة إيصال التحويل (Proof of Payment)</label>
              <div className="border-2 border-dashed border-gray-200 hover:border-blue-500 rounded-3xl p-6 bg-slate-50/50 hover:bg-white text-center cursor-pointer transition-all relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required={!previewUrl}
                />
                
                {previewUrl ? (
                  <div className="flex flex-col items-center space-y-3">
                    <img
                      src={previewUrl}
                      alt="Receipt Preview"
                      className="w-32 h-32 object-cover rounded-xl border border-gray-200"
                    />
                    <span className="text-xs font-black text-blue-600">تغيير الصورة المرفقة</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-4 space-y-3">
                    <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-slate-400 shadow-sm">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-700">اضغط هنا أو اسحب الملف لرفعه</p>
                      <p className="text-[10px] text-gray-400 font-bold mt-1">يدعم ملفات الصور (JPG, PNG) بحد أقصى 5 ميجابايت</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/15 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:bg-blue-300"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري إرسال طلب الشراء...</span>
                </>
              ) : (
                <span>إرسال طلب التحقق والشراء</span>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Requests Listing */
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-6">
          <h2 className="text-xl font-black text-gray-900 border-b border-gray-50 pb-4 mb-6">سجل طلبات الشراء</h2>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center justify-center text-gray-400">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                <Wallet className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-lg font-black text-gray-800">لا توجد طلبات اشتراك حالياً</p>
              <p className="text-xs text-gray-400 font-bold mt-1">قم بتقديم طلب اشتراك بدورة جديدة لبدء رحلتك التعليمية</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="p-8 border border-gray-100 hover:border-blue-100 rounded-[2rem] bg-slate-50/20 hover:bg-blue-50/5 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all group"
                >
                  <div className="flex items-center gap-6 text-right">
                    {/* Course cover */}
                    <div className="w-24 h-24 rounded-2xl bg-[#0a192f] overflow-hidden flex items-center justify-center shrink-0 border border-gray-100">
                      {req.courseImage ? (
                        <img src={req.courseImage} alt={req.courseTitle} className="w-full h-full object-cover" />
                      ) : (
                        <GraduationCap className="w-8 h-8 text-blue-500" />
                      )}
                    </div>
                    
                    {/* Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">المعاملة: {req.id}</span>
                        <span className="text-xs text-gray-400 font-bold">{req.date}</span>
                      </div>
                      <h3 className="text-sm md:text-base font-black text-gray-800 leading-snug group-hover:text-blue-600 transition-colors">{req.courseTitle}</h3>
                      <div className="flex items-center gap-4 text-xs text-gray-500 font-semibold">
                        <span className="font-black text-gray-700">{req.amount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Badge */}
                  <div className="flex items-center justify-end gap-4">
                    <button
                      onClick={() => handleShowReceipt(req.receiptImage)}
                      className="flex items-center gap-1.5 px-6 py-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-white hover:text-blue-600 hover:border-blue-200 text-xs font-black transition-all bg-slate-50/50"
                    >
                      <FileText className="w-4 h-4" />
                      <span>عرض الإيصال</span>
                    </button>
                    {getStatusBadge(req.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
