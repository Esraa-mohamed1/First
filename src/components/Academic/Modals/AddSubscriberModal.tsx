'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, User as UserIcon, Mail, Phone, Lock, BookOpen, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { createUser, getUsers } from '@/services/users';
import { addCourseSubscriber, getCourses } from '@/services/courses';
import { User, Course } from '@/types/api';

interface AddSubscriberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscriberAdded: (subscriber?: any) => void;
  courseId?: number | string;
}

export default function AddSubscriberModal({ isOpen, onClose, onSubscriberAdded, courseId }: AddSubscriberModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subMode, setSubMode] = useState<'existing' | 'new'>('existing');
  
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | number>(courseId || '');
  const [loadingCourses, setLoadingCourses] = useState<boolean>(false);

  const [existingStudents, setExistingStudents] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | number>('');
  const [loadingStudents, setLoadingStudents] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'student',
    status: 'active'
  });

  useEffect(() => {
    if (courseId) {
      setSelectedCourseId(courseId);
    }
  }, [courseId]);

  useEffect(() => {
    if (isOpen) {
      // 1. Fetch courses list if courseId not pre-filled (Global mode)
      if (!courseId) {
        setLoadingCourses(true);
        getCourses()
          .then(res => {
            const list = res || [];
            setCoursesList(list);
            if (list.length > 0) {
              setSelectedCourseId(list[0].id);
            }
          })
          .catch(() => setCoursesList([]))
          .finally(() => setLoadingCourses(false));
      } else {
        setSelectedCourseId(courseId);
      }

      // 2. Fetch existing students list
      setLoadingStudents(true);
      getUsers('student')
        .then(res => {
          const list = res || [];
          setExistingStudents(list);
          if (list.length > 0) {
            setSelectedUserId(list[0].id);
            const first = list[0];
            setFormData(prev => ({
              ...prev,
              name: first.name || '',
              email: first.email || '',
              phone: first.phone || ''
            }));
            setSubMode('existing');
          } else {
            setSubMode('new');
          }
        })
        .catch(() => {
          setExistingStudents([]);
          setSubMode('new');
        })
        .finally(() => setLoadingStudents(false));
    }
  }, [isOpen, courseId]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStudentSelect = (userId: string | number) => {
    setSelectedUserId(userId);
    const student = existingStudents.find((s) => String(s.id) === String(userId));
    if (student) {
      setFormData(prev => ({
        ...prev,
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || ''
      }));
    }
  };

  const handleSubmit = async () => {
    const activeCourseId = courseId || selectedCourseId;
    if (!activeCourseId) {
      toast.error('يرجى اختيار الدورة التدريبية');
      return;
    }

    if (subMode === 'new' && !formData.name) {
      toast.error('يرجى كتابة اسم الطالب بالكامل');
      return;
    }

    setIsSubmitting(true);
    try {
      // Always send current date now for subscription starts_at
      const todayStr = new Date().toISOString().split('T')[0];

      let targetUserId: number | string | undefined = undefined;
      let targetEmail: string | undefined = undefined;
      let targetPhone: string | undefined = undefined;
      let targetName: string | undefined = undefined;

      if (subMode === 'existing') {
        const selectedStudent = existingStudents.find((s) => String(s.id) === String(selectedUserId));
        targetUserId = selectedUserId || selectedStudent?.id;
        targetEmail = selectedStudent?.email || formData.email || undefined;
        targetPhone = selectedStudent?.phone || formData.phone || undefined;
        targetName = selectedStudent?.name || formData.name;
      } else {
        // Create new user first if needed
        let createdUser: any = null;
        try {
          createdUser = await createUser(formData);
        } catch {
          /* user may exist */
        }
        targetUserId = createdUser?.id;
        targetEmail = formData.email || undefined;
        targetPhone = formData.phone || undefined;
        targetName = formData.name;
      }

      // Post User Subscription with current date now (starts_at)
      await addCourseSubscriber({
        course_id: activeCourseId,
        user_id: targetUserId,
        email: targetEmail,
        phone: targetPhone,
        name: targetName,
        status: formData.status || 'active',
        starts_at: todayStr
      });

      toast.success('تمت إضافة الاشتراك في الدورة بنجاح');
      onSubscriberAdded();
      onClose();

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'student',
        status: 'active'
      });
    } catch (error: any) {
      toast.error(error?.message || error?.data?.message || 'فشل إضافة المشترك في الدورة');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir="rtl">
      <div 
        className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
              <UserIcon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900">
                إضافة مشترك للدورة
              </h2>
              <p className="text-sm font-bold text-gray-400 mt-1">اختر طالباً مثالياً أو أضف طالباً جديداً للاشتراك</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-8 pt-6">
          <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
            <button
              type="button"
              onClick={() => setSubMode('existing')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                subMode === 'existing'
                  ? 'bg-white text-blue-600 shadow-sm font-black'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Users size={18} />
              <span>اختر من الطلاب الحاليين</span>
            </button>
            <button
              type="button"
              onClick={() => setSubMode('new')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                subMode === 'new'
                  ? 'bg-white text-blue-600 shadow-sm font-black'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <UserIcon size={18} />
              <span>إضافة طالب جديد</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Course Selector when on global subscribers page (courseId is not pre-selected) */}
          {!courseId && (
            <div className="space-y-2">
              <label className="block text-sm font-black text-gray-900">
                اختر الدورة <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <BookOpen className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                {loadingCourses ? (
                  <div className="w-full p-4 pr-12 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm text-gray-400 flex items-center gap-2">
                    <Loader2 className="animate-spin" size={16} />
                    جاري تحميل قائمة الدورات...
                  </div>
                ) : coursesList.length === 0 ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-xs font-bold">
                    لا توجد دورات مسجلة حالياً للاشتراك بها.
                  </div>
                ) : (
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full p-4 pr-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all appearance-none text-gray-900"
                  >
                    {coursesList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          )}

          {subMode === 'existing' ? (
            <div className="space-y-6">
              {/* Existing Student Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-black text-gray-900">
                  حدد الطالب <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  {loadingStudents ? (
                    <div className="w-full p-4 pr-12 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm text-gray-400 flex items-center gap-2">
                      <Loader2 className="animate-spin" size={16} />
                      جاري تحميل قائمة الطلاب...
                    </div>
                  ) : existingStudents.length === 0 ? (
                    <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-xs font-bold">
                      لا يوجد طلاب مسجلون حالياً. يرجى التبديل لتبويب "إضافة طالب جديد".
                    </div>
                  ) : (
                    <select
                      value={selectedUserId}
                      onChange={(e) => handleStudentSelect(e.target.value)}
                      className="w-full p-4 pr-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all appearance-none text-gray-900"
                    >
                      {existingStudents.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name || student.email || student.phone || `طالب #${student.id}`} ({student.email || student.phone || 'بدون بيانات تواصل'})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Student Readonly Summary Card */}
              {selectedUserId && (
                <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 space-y-1 text-xs font-bold text-blue-900">
                  <p><span className="text-blue-600">الاسم:</span> {formData.name || 'غير محدد'}</p>
                  {formData.email && <p><span className="text-blue-600">البريد:</span> {formData.email}</p>}
                  {formData.phone && <p><span className="text-blue-600">الهاتف:</span> {formData.phone}</p>}
                  <p className="text-[10px] text-blue-500 pt-1">سيتم ربط هذا الطالب بالدورة وتحديد تاريخ الاشتراك باليوم الحالي تلقائياً.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-black text-gray-900">
                  الاسم بالكامل <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="مثال: أحمد محمد"
                    className="w-full p-4 pr-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-gray-900"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-black text-gray-900">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    className="w-full p-4 pr-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-gray-900"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-black text-gray-900">رقم الجوال</label>
                <div className="relative">
                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="05X XXX XXXX"
                    className="w-full p-4 pr-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-gray-900"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-black text-gray-900">
                  كلمة المرور (اختياري)
                </label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="كلمة مرور الحساب (إن وجد)"
                    className="w-full p-4 pr-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-gray-900"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-8 py-3.5 bg-white text-gray-600 border border-gray-200 font-black rounded-2xl hover:bg-gray-50 transition-all text-sm cursor-pointer"
          >
            إلغاء
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3.5 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 hover:brightness-110 active:scale-95 transition-all text-sm disabled:opacity-70 flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            <span>حفظ الاشتراك</span>
          </button>
        </div>
      </div>
    </div>
  );
}
