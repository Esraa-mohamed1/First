'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, GraduationCap, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  createGrade,
  createSubject,
  createTerm,
  createAcademicYear,
  ClassificationItem
} from '@/services/academic-classification';

interface AddClassificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'grade' | 'semester' | 'subject' | 'year';
  availableGrades?: ClassificationItem[];
  currentGradeId?: string;
  onSuccess: (type: 'grade' | 'semester' | 'subject' | 'year', newItem: any) => void;
}

export default function AddClassificationModal({
  isOpen,
  onClose,
  initialType = 'grade',
  availableGrades = [],
  currentGradeId = '',
  onSuccess,
}: AddClassificationModalProps) {
  const [activeTab, setActiveTab] = useState<'grade' | 'semester' | 'subject' | 'year'>(initialType);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [stage, setStage] = useState('المرحلة الثانوية');
  const [selectedGradeId, setSelectedGradeId] = useState(currentGradeId || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setActiveTab(initialType);
    if (currentGradeId) setSelectedGradeId(currentGradeId);
  }, [initialType, currentGradeId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('يرجى كتابة الاسم');
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        name: name.trim(),
        description: desc.trim() || 'وصف التصنيف',
        is_active: true,
      };

      let created: any = null;
      if (activeTab === 'grade') {
        payload.stage = stage || 'المرحلة الثانوية';
        created = await createGrade(payload);
        toast.success('تمت إضافة الصف الدراسي بنجاح!');
      } else if (activeTab === 'subject') {
        if (selectedGradeId) payload.grade_id = selectedGradeId;
        created = await createSubject(payload);
        toast.success('تمت إضافة المادة الدراسية بنجاح!');
      } else if (activeTab === 'semester') {
        if (selectedGradeId) payload.grade_id = selectedGradeId;
        created = await createTerm(payload);
        toast.success('تمت إضافة الفصل الدراسي بنجاح!');
      } else if (activeTab === 'year') {
        created = await createAcademicYear(payload);
        toast.success('تمت إضافة العام الدراسي بنجاح!');
      }

      setName('');
      setDesc('');
      onSuccess(activeTab, created);
      onClose();
    } catch (err: any) {
      console.error('Failed to create classification item:', err);
      toast.error('حدث خطأ أثناء إضافة التصنيف، يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200" dir="rtl">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-8 border border-slate-100 relative animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 left-6 text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">إضافة تصنيف دراسي جديد</h2>
            <p className="text-xs font-bold text-slate-500">أضف صف دراسي، مادة، أو ترم جديد مباشرة للنظام</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('grade')}
            className={`flex-1 py-2 px-3 text-xs font-black rounded-xl transition-all cursor-pointer ${
              activeTab === 'grade' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            صف دراسي
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('subject')}
            className={`flex-1 py-2 px-3 text-xs font-black rounded-xl transition-all cursor-pointer ${
              activeTab === 'subject' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            مادة دراسية
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('semester')}
            className={`flex-1 py-2 px-3 text-xs font-black rounded-xl transition-all cursor-pointer ${
              activeTab === 'semester' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ترم دراسي
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('year')}
            className={`flex-1 py-2 px-3 text-xs font-black rounded-xl transition-all cursor-pointer ${
              activeTab === 'year' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            عام دراسي
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black mb-1.5 text-slate-800">
              الاسم <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
              placeholder={
                activeTab === 'grade'
                  ? 'مثال: الصف الثالث الثانوي'
                  : activeTab === 'subject'
                  ? 'مثال: الفيزياء'
                  : activeTab === 'semester'
                  ? 'مثال: الفصل الدراسي الأول'
                  : 'مثال: 2025/2026'
              }
            />
          </div>

          {(activeTab === 'subject' || activeTab === 'semester') && availableGrades.length > 0 && (
            <div>
              <label className="block text-xs font-black mb-1.5 text-slate-800">الصف الدراسي المرتبط (اختياري)</label>
              <select
                value={selectedGradeId}
                onChange={(e) => setSelectedGradeId(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all bg-white cursor-pointer"
              >
                <option value="">-- عام (جميع الصفوف) --</option>
                {availableGrades.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeTab === 'grade' && (
            <div>
              <label className="block text-xs font-black mb-1.5 text-slate-800">المرحلة التعليمية</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all bg-white cursor-pointer"
              >
                <option value="المرحلة الابتدائية">المرحلة الابتدائية</option>
                <option value="المرحلة الإعدادية / المتوسطة">المرحلة الإعدادية / المتوسطة</option>
                <option value="المرحلة الثانوية">المرحلة الثانوية</option>
                <option value="التعليم الجامعي">التعليم الجامعي</option>
                <option value="عام">عام</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-black mb-1.5 text-slate-800">الوصف (اختياري)</label>
            <textarea
              rows={2}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
              placeholder="وصف مختصر..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-black hover:bg-slate-50 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md shadow-blue-100 transition-all flex items-center gap-2 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>إضافة التصنيف</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
