'use client';

import React from 'react';
import { Info, X, Upload, ImagePlus, Plus, Trash2, Landmark, Pencil } from 'lucide-react';
import { ClassificationItem } from '@/services/academic-classification';
import { AcademyPaymentMethod, PaymentMethod } from '@/types/payment';
import { User, ReceiverAccount } from '@/types/api';
import { UserPaymentInfo } from '@/services/finance';
import QuillEditor from '@/components/Academic/QuillEditor';
import { SearchableSelect } from '@/components/Academic/Common/SearchableSelect';
import { PaymentMethodDropdown } from '@/components/payment/PaymentMethodDropdown';
import { isSchoolTeacherRole } from '@/lib/auth-storage';
import { getLogoUrl } from '@/lib/utils';
import { translateErrorToArabic } from '../utils/errorHelpers';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface CourseInfoTabProps {
  courseInfo: {
    title: string;
    description: string;
    target_audience: string;
    category_id: string;
    user_id: string;
  };
  setCourseInfo: React.Dispatch<React.SetStateAction<{
    title: string;
    description: string;
    target_audience: string;
    category_id: string;
    user_id: string;
  }>>;
  shortDescription: string;
  setShortDescription: (val: string) => void;
  previewImage: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage?: (e?: React.MouseEvent) => void;
  categories: any[];
  setIsAddCategoryModalOpen: (open: boolean) => void;
  instructors: User[];
  setCoachName: (name: string) => void;
  setIsAddCoachModalOpen: (open: boolean) => void;
  userRole: string | null;
  currentUser: User | null;
  setAddClassificationModal: React.Dispatch<React.SetStateAction<{
    isOpen: boolean;
    type: 'grade' | 'semester' | 'subject' | 'year';
  }>>;
  gradeLevel: string;
  setGradeLevel: (val: string) => void;
  semester: string;
  setSemester: (val: string) => void;
  subject: string;
  setSubject: (val: string) => void;
  academicYear: string;
  setAcademicYear: (val: string) => void;
  activeGrades: ClassificationItem[];
  activeSemesters: ClassificationItem[];
  activeSubjects: ClassificationItem[];
  activeYears: ClassificationItem[];
  customSections: Array<{ id: string; title: string; items: string[] }>;
  handleAddSectionItem: (sectionId: string) => void;
  handleUpdateSectionItem: (sectionId: string, itemIndex: number, value: string) => void;
  handleRemoveSectionItem: (sectionId: string, itemIndex: number) => void;
  targetAudienceList: string[];
  handleAddTargetAudience: () => void;
  handleUpdateTargetAudience: (index: number, val: string) => void;
  handleRemoveTargetAudience: (index: number) => void;
  accessDurationType: 'lifetime' | 'days' | 'until_date';
  setAccessDurationType: (val: 'lifetime' | 'days' | 'until_date') => void;
  accessDays: string;
  setAccessDays: (val: string) => void;
  accessUntilDate: string;
  setAccessUntilDate: (val: string) => void;
  pricingType: 'free' | 'paid';
  setPricingType: (val: 'free' | 'paid') => void;
  price: string;
  setPrice: (val: string) => void;
  currency: 'EGP' | 'SAR';
  setCurrency: (val: 'EGP' | 'SAR') => void;
  receiverTemplates: ReceiverAccount[];
  setNewPaymentTemplateId: (val: string) => void;
  setNewPaymentCustomName: (val: string) => void;
  setNewPaymentAccountValue: (val: string) => void;
  setShowAddPaymentModal: (open: boolean) => void;
  activeMethods: PaymentMethod[];
  selectedPaymentMethods: AcademyPaymentMethod[];
  setSelectedPaymentMethods: React.Dispatch<React.SetStateAction<AcademyPaymentMethod[]>>;
  academyPaymentMethods: UserPaymentInfo[];
  errors: Record<string, any>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  handleSaveCourseInfo: (shouldNavigate?: boolean) => Promise<void>;
}

export const CourseInfoTab: React.FC<CourseInfoTabProps> = ({
  courseInfo,
  setCourseInfo,
  shortDescription,
  setShortDescription,
  previewImage,
  fileInputRef,
  handleImageChange,
  handleRemoveImage,
  categories,
  setIsAddCategoryModalOpen,
  instructors,
  setCoachName,
  setIsAddCoachModalOpen,
  userRole,
  currentUser,
  setAddClassificationModal,
  gradeLevel,
  setGradeLevel,
  semester,
  setSemester,
  subject,
  setSubject,
  academicYear,
  setAcademicYear,
  activeGrades,
  activeSemesters,
  activeSubjects,
  activeYears,
  customSections,
  handleAddSectionItem,
  handleUpdateSectionItem,
  handleRemoveSectionItem,
  targetAudienceList,
  handleAddTargetAudience,
  handleUpdateTargetAudience,
  handleRemoveTargetAudience,
  accessDurationType,
  setAccessDurationType,
  accessDays,
  setAccessDays,
  accessUntilDate,
  setAccessUntilDate,
  pricingType,
  setPricingType,
  price,
  setPrice,
  currency,
  setCurrency,
  receiverTemplates,
  setNewPaymentTemplateId,
  setNewPaymentCustomName,
  setNewPaymentAccountValue,
  setShowAddPaymentModal,
  activeMethods,
  selectedPaymentMethods,
  setSelectedPaymentMethods,
  academyPaymentMethods,
  errors,
  setErrors,
  handleSaveCourseInfo,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Section 1: Definition */}
      <section className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-5 h-5 text-blue-600" />
          <h3 className="font-title-md text-title-md text-gray-900">تعريف الدورة</h3>
        </div>

        {/* Title */}
        <div>
          <label className="block text-label-md mb-2 text-gray-900">اسم الدورة <span className="text-error">*</span></label>
          <input
            type="text"
            value={courseInfo.title}
            onChange={(e) => {
              setCourseInfo({ ...courseInfo, title: e.target.value });
              if (errors.title) setErrors(prev => ({ ...prev, title: null }));
            }}
            className="w-full border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-bold text-gray-900"
            placeholder="مثال: أساسيات التصميم الجرافيكي للمبتدئين"
          />
          {errors.title && (
            <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1">
              <X size={12} />
              {translateErrorToArabic(Array.isArray(errors.title) ? errors.title[0] : String(errors.title))}
            </p>
          )}
        </div>

        {/* Two-column layout: Image Upload and Short Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thumbnail upload (Right) */}
          <div className="order-2 md:order-2 space-y-2">
            <label className="block text-label-md mb-2 text-gray-900">الصورة التعريفية (Thumbnail)</label>
            <div
              onClick={() => {
                if (!previewImage) fileInputRef.current?.click();
              }}
              className="border-2 border-dashed border-outline-variant rounded-lg h-36 flex flex-col items-center justify-center bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer overflow-hidden relative group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              {previewImage ? (
                <div className="relative w-full h-full">
                  <img src={previewImage} alt="Course Preview" className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white font-bold text-xs gap-2 p-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-xs flex items-center gap-1 shadow-md hover:bg-slate-100 transition-transform active:scale-95 cursor-pointer"
                      title="تغيير الصورة"
                    >
                      <Pencil size={13} className="text-blue-600" />
                      <span>تغيير</span>
                    </button>
                    {handleRemoveImage && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(e);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center gap-1 shadow-md hover:bg-rose-700 transition-transform active:scale-95 cursor-pointer"
                        title="إلغاء الصورة"
                      >
                        <Trash2 size={13} />
                        <span>إلغاء</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <ImagePlus className="w-8 h-8 text-slate-400" />
                  <span className="text-label-sm text-on-surface-variant mt-1 font-bold">اضغط لرفع صورة أو اسحبها هنا</span>
                </>
              )}
            </div>
          </div>

          {/* Short description text-area (Left) */}
          <div className="order-1 md:order-1 space-y-2">
            <label className="block text-label-md mb-2 text-gray-900">الوصف المختصر</label>
            <textarea
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all h-36 resize-none text-sm text-gray-900 font-bold"
              placeholder="اكتب وصفاً موجزاً يظهر في بطاقة الدورة..."
            />
          </div>
        </div>

        {/* Full Description */}
        <div className="space-y-2">
          <label className="block text-label-md text-gray-900">الوصف الكامل للدورة</label>
          <div className="bg-white rounded-lg border border-outline-variant overflow-hidden">
            <QuillEditor
              value={courseInfo.description}
              onChange={(val) => {
                setCourseInfo({ ...courseInfo, description: val });
                if (errors.description) setErrors(prev => ({ ...prev, description: null }));
              }}
              placeholder="اشرح بالتفصيل ماذا سيتعلم الطالب..."
            />
          </div>
          {errors.description && (
            <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1">
              <X size={12} />
              {translateErrorToArabic(Array.isArray(errors.description) ? errors.description[0] : String(errors.description))}
            </p>
          )}
        </div>

        {/* Category and Coach selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-label-md mb-2 text-gray-900 font-bold">تصنيف / فئة الدورة</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <SearchableSelect
                  options={categories.map(c => ({ id: c.id, name: c.name }))}
                  value={courseInfo.category_id}
                  onChange={(val) => {
                    setCourseInfo({ ...courseInfo, category_id: val ? val.toString() : '' });
                    if (errors.category_id) setErrors(prev => ({ ...prev, category_id: null }));
                  }}
                  placeholder="اختر فئة (اختياري)"
                  error={errors.category_id ? translateErrorToArabic(Array.isArray(errors.category_id) ? errors.category_id[0] : String(errors.category_id)) : undefined}
                />
              </div>
              <button
                type="button"
                onClick={() => setIsAddCategoryModalOpen(true)}
                className="p-2.5 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-700 cursor-pointer h-[42px] self-start"
                title="إضافة تصنيف جديد"
              >
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-label-md mb-2 text-gray-900 font-bold">المدرب / المحاضر</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <SearchableSelect
                  options={instructors.map(i => ({ id: i.id, name: i.name }))}
                  value={courseInfo.user_id}
                  onChange={(val) => {
                    setCourseInfo({ ...courseInfo, user_id: val ? val.toString() : '' });
                    if (val) {
                      const selectedInst = instructors.find(i => i.id.toString() === val.toString());
                      if (selectedInst) setCoachName(selectedInst.name || selectedInst.fullName || '');
                    } else {
                      setCoachName('');
                    }
                    if (errors.user_id) setErrors(prev => ({ ...prev, user_id: null }));
                  }}
                  placeholder="اختر مدرب (افتراضي: الحساب الحالي)"
                  error={errors.user_id ? translateErrorToArabic(Array.isArray(errors.user_id) ? errors.user_id[0] : String(errors.user_id)) : undefined}
                />
              </div>
              <button
                type="button"
                onClick={() => setIsAddCoachModalOpen(true)}
                className="p-2.5 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-700 cursor-pointer h-[42px] self-start"
                title="إضافة مدرب جديد"
              >
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Academic Classification */}
      {isSchoolTeacherRole(userRole || currentUser) && (
        <section className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
              <h3 className="font-title-md text-title-md text-gray-900">التصنيف الدراسي</h3>
            </div>
            <button
              type="button"
              onClick={() => setAddClassificationModal({ isOpen: true, type: 'subject' })}
              className="px-4 py-2 bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مادة / صف</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-label-md mb-2 text-gray-900">الصف الدراسي</label>
              <div className="flex gap-2">
                <select
                  value={gradeLevel}
                  onChange={(e) => {
                    setGradeLevel(e.target.value);
                    setSemester('');
                    setSubject('');
                  }}
                  className="flex-1 border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm font-bold text-gray-900 bg-white cursor-pointer"
                >
                  <option value="">اختر الصف...</option>
                  {activeGrades.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setAddClassificationModal({ isOpen: true, type: 'grade' })}
                  className="p-2.5 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-700 cursor-pointer"
                  title="إضافة صف دراسي جديد"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-label-md mb-2 text-gray-900">الفصل الدراسي</label>
              <div className="flex gap-2">
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="flex-1 border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm font-bold text-gray-900 bg-white cursor-pointer"
                >
                  <option value="">اختر الترم...</option>
                  {activeSemesters.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setAddClassificationModal({ isOpen: true, type: 'semester' })}
                  className="p-2.5 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-700 cursor-pointer"
                  title="إضافة فصل دراسي جديد"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-label-md mb-2 text-gray-900">المادة</label>
              <div className="flex gap-2">
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="flex-1 border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm font-bold text-gray-900 bg-white cursor-pointer"
                >
                  <option value="">اختر المادة...</option>
                  {activeSubjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setAddClassificationModal({ isOpen: true, type: 'subject' })}
                  className="p-2.5 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-700 cursor-pointer"
                  title="إضافة مادة دراسية جديدة"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-label-md mb-2 text-gray-900">العام الدراسي</label>
              <div className="flex gap-2">
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="flex-1 border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm font-bold text-gray-900 bg-white cursor-pointer"
                >
                  <option value="">اختر العام الدراسي...</option>
                  {activeYears.map((y) => (
                    <option key={y.id} value={y.id}>
                      {y.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setAddClassificationModal({ isOpen: true, type: 'year' })}
                  className="p-2.5 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-700 cursor-pointer"
                  title="إضافة عام دراسي جديد"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section 3: Learning Details */}
      <section className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm space-y-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>checklist</span>
          <h3 className="font-title-md text-title-md text-gray-900">تفاصيل التعلم</h3>
        </div>

        {/* Outcomes outcomes */}
        {(() => {
          const learnSec = customSections.find(s => s.id === 'what_you_will_learn') || { id: 'what_you_will_learn', title: 'ماذا ستتعلم؟', items: [''] };
          return (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-label-md font-bold text-gray-900">ماذا سيتعلم الطالب؟ (مخرجات التعلم)</label>
                <button
                  type="button"
                  onClick={() => handleAddSectionItem('what_you_will_learn')}
                  className="text-primary text-label-sm font-bold flex items-center gap-1 hover:underline"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span> إضافة مخرج
                </button>
              </div>
              <div className="space-y-3">
                {learnSec.items.map((point, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      className="flex-grow border border-outline-variant rounded-lg px-4 py-2 text-sm text-gray-900 font-bold bg-gray-50/20"
                      type="text"
                      value={point}
                      onChange={(e) => handleUpdateSectionItem('what_you_will_learn', index, e.target.value)}
                      placeholder="مثال: فهم مبادئ الألوان وتناسقها"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSectionItem('what_you_will_learn', index)}
                      className="p-2 text-on-surface-variant hover:text-error transition-colors"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Target Audience outcomes */}
        <div className="hidden">
          <div className="flex items-center justify-between mb-3">
            <label className="text-label-md font-bold text-gray-900">الفئة المستهدفة</label>
            <button
              type="button"
              onClick={handleAddTargetAudience}
              className="text-primary text-label-sm font-bold flex items-center gap-1 hover:underline"
            >
              <span className="material-symbols-outlined text-[18px]">add</span> إضافة فئة
            </button>
          </div>
          <div className="space-y-3">
            {targetAudienceList.map((audience, index) => (
              <div key={index} className="flex gap-2">
                <input
                  className="flex-grow border border-outline-variant rounded-lg px-4 py-2 text-sm text-gray-900 font-bold bg-gray-50/20"
                  type="text"
                  value={audience}
                  onChange={(e) => handleUpdateTargetAudience(index, e.target.value)}
                  placeholder="مثال: الطلاب والراغبين في دخول مجال التصميم"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveTargetAudience(index)}
                  className="p-2 text-on-surface-variant hover:text-error transition-colors"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Access Duration */}
      <section className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
          <h3 className="font-title-md text-title-md text-gray-900">مدة الوصول</h3>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <label className={`flex-grow flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${accessDurationType === 'lifetime' ? 'border-primary bg-primary/5' : 'border-outline-variant hover:bg-surface-container-low'}`}>
            <input
              type="radio"
              name="access_duration"
              checked={accessDurationType === 'lifetime'}
              onChange={() => setAccessDurationType('lifetime')}
              className="w-5 h-5 text-primary focus:ring-primary"
            />
            <span className="text-label-md font-bold text-gray-900">مدى الحياة</span>
          </label>
          <label className={`flex-grow flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${accessDurationType === 'days' ? 'border-primary bg-primary/5' : 'border-outline-variant hover:bg-surface-container-low'}`}>
            <input
              type="radio"
              name="access_duration"
              checked={accessDurationType === 'days'}
              onChange={() => setAccessDurationType('days')}
              className="w-5 h-5 text-primary focus:ring-primary"
            />
            <span className="text-label-md font-bold text-gray-900">عدد أيام من الاشتراك</span>
          </label>
          <label className={`flex-grow flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${accessDurationType === 'until_date' ? 'border-primary bg-primary/5' : 'border-outline-variant hover:bg-surface-container-low'}`}>
            <input
              type="radio"
              name="access_duration"
              checked={accessDurationType === 'until_date'}
              onChange={() => setAccessDurationType('until_date')}
              className="w-5 h-5 text-primary focus:ring-primary"
            />
            <span className="text-label-md font-bold text-gray-900">حتى تاريخ محدد</span>
          </label>
        </div>
        {accessDurationType === 'days' && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <label className="block text-xs font-bold text-gray-500 mb-1.5">عدد الأيام</label>
            <input
              type="number"
              value={accessDays}
              onChange={(e) => setAccessDays(e.target.value)}
              placeholder="مثال: 90"
              className="border border-outline-variant rounded-lg px-4 py-2 w-full max-w-xs text-sm text-gray-900 font-bold bg-white outline-none focus:border-primary"
            />
          </div>
        )}
        {accessDurationType === 'until_date' && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <label className="block text-xs font-bold text-gray-500 mb-1.5">تاريخ انتهاء الوصول</label>
            <input
              type="date"
              value={accessUntilDate}
              onChange={(e) => setAccessUntilDate(e.target.value)}
              className="border border-outline-variant rounded-lg px-4 py-2 w-full max-w-xs text-sm text-gray-900 font-bold bg-white outline-none focus:border-primary"
            />
          </div>
        )}
      </section>

      {/* Section 5: Pricing & Collection accounts */}
      <section className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm overflow-hidden text-right space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
          <h3 className="font-title-md text-title-md text-gray-900">التسعير وطرق التحصيل</h3>
        </div>

        {/* Pricing Options */}
        <div className="space-y-6">
          <div className="flex bg-surface-container p-1 rounded-lg w-fit border border-gray-100">
            <button
              type="button"
              onClick={() => {
                setPricingType('free');
                setSelectedPaymentMethods([]);
              }}
              className={`px-8 py-2 rounded-md text-label-md font-bold transition-all ${pricingType === 'free' ? 'bg-white shadow-sm text-primary font-black' : 'text-on-surface-variant hover:text-gray-900'}`}
            >
              مجانية
            </button>
            <button
              type="button"
              onClick={() => setPricingType('paid')}
              className={`px-8 py-2 rounded-md text-label-md font-bold transition-all ${pricingType === 'paid' ? 'bg-white shadow-sm text-primary font-black' : 'text-on-surface-variant hover:text-gray-900'}`}
            >
              مدفوعة
            </button>
          </div>

          {pricingType === 'paid' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-label-md mb-2 text-gray-900">السعر الأساسي</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value);
                        if (errors.price) setErrors(prev => ({ ...prev, price: null }));
                      }}
                      placeholder="0.00"
                      className={`w-full border ${errors.price ? 'border-red-500 bg-red-50/20' : 'border-outline-variant'} rounded-lg px-4 py-2 pl-12 text-sm font-bold text-gray-900 bg-white`}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant pointer-events-none font-bold text-xs">
                      {currency}
                    </div>
                  </div>
                  {errors.price && (
                    <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1">
                      <X size={12} />
                      {translateErrorToArabic(Array.isArray(errors.price) ? errors.price[0] : String(errors.price))}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-label-md mb-2 text-gray-900">العملة</label>
                  <select
                    value={currency}
                    onChange={(e) => {
                      const newCurr = e.target.value as any;
                      setCurrency(newCurr);
                      setSelectedPaymentMethods([]);
                    }}
                    className="w-full border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary text-sm font-bold text-gray-900 bg-white outline-none"
                  >
                    <option value="SAR">SAR — ريال سعودي</option>
                    <option value="EGP">EGP — جنيه مصري</option>
                    <option value="KWD">KWD — دينار كويتي</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Collection Accounts */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <div>
              <h4 className="text-base font-black text-gray-900">طرق التحصيل (وسائل الدفع)</h4>
              <p className="text-xs text-gray-400 font-bold mt-0.5">اختر وسائل الدفع التي تريد تفعيلها لهذه الدورة</p>
            </div>
            <button
              type="button"
              disabled={pricingType === 'free'}
              onClick={() => {
                if (pricingType === 'free') return;
                const countryCode = currency === 'EGP' ? 'EG' : 'SA';
                const filtered = receiverTemplates.filter(t => t.country_code === countryCode);
                if (filtered.length > 0) {
                  setNewPaymentTemplateId(filtered[0].id.toString());
                  setNewPaymentCustomName(filtered[0].name);
                } else {
                  setNewPaymentTemplateId('');
                  setNewPaymentCustomName('');
                }
                setNewPaymentAccountValue('');
                setShowAddPaymentModal(true);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-center ${
                pricingType === 'free'
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md cursor-pointer'
              }`}
            >
              <Plus className="w-4 h-4" />
              إضافة وسيلة استقبال جديدة
            </button>
          </div>

          {pricingType === 'free' && (
            <div className="mb-4 p-3.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-amber-600">info</span>
              <span>الدورة مجانية — تم تعطيل اختيار وسائل الدفع.</span>
            </div>
          )}

          <PaymentMethodDropdown
            disabled={pricingType === 'free'}
            options={activeMethods}
            selectedValues={pricingType === 'free' ? [] : selectedPaymentMethods.map(m => m.methodId)}
            onChange={(ids) => {
              if (pricingType === 'free') return;
              if (ids.length > 3) {
                MySwal.fire({
                  title: 'الحد الأقصى لوسائل الدفع',
                  text: 'يمكنك تحديد 3 وسائل دفع كحد أقصى لهذه الدورة.',
                  icon: 'warning',
                  confirmButtonText: 'حسناً',
                  confirmButtonColor: '#2563eb',
                });
                return;
              }

              const newMethods = ids.map(id => {
                const existing = selectedPaymentMethods.find(m => m.methodId === id);
                if (existing) return existing;
                const method = activeMethods.find(m => m.id === id);
                if (!method) return null;
                const originalInfo = academyPaymentMethods.find(m => m.id.toString() === id);
                return {
                  methodId: method.id,
                  methodName: method.name,
                  type: method.type,
                  value: originalInfo?.accountValue || originalInfo?.account_value || '',
                  currency: originalInfo?.currency || 'SAR',
                  logo: method.logo || originalInfo?.logo
                };
              }).filter(Boolean) as AcademyPaymentMethod[];
              setSelectedPaymentMethods(newMethods);
              if (errors.receiver_accounts) setErrors(prev => ({ ...prev, receiver_accounts: null }));
            }}
          />
          {errors.receiver_accounts && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mt-2">
              <X size={14} className="text-red-500 shrink-0" />
              <p className="text-red-600 text-xs font-bold">
                {translateErrorToArabic(Array.isArray(errors.receiver_accounts) ? errors.receiver_accounts[0] : String(errors.receiver_accounts || ''))}
              </p>
            </div>
          )}

          {selectedPaymentMethods.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-top-2 duration-300">
              {selectedPaymentMethods.map((pm) => (
                <div key={pm.methodId} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative group/pm">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPaymentMethods(prev => prev.filter(m => m.methodId !== pm.methodId));
                    }}
                    className="absolute top-4 left-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shadow-sm bg-white border border-slate-100"
                    title="إزالة وسيلة الدفع"
                  >
                    <Trash2 size={13} />
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100/80 overflow-hidden shrink-0">
                      {pm.logo ? (
                        <img src={getLogoUrl(pm.logo)} alt={pm.methodName} className="w-full h-full object-cover" />
                      ) : (
                        <Landmark size={18} className="text-primary" />
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">الحساب المفعل</span>
                      <span className="font-black text-slate-900 text-sm mt-0.5">{pm.methodName}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-50 flex flex-col gap-1 text-right">
                    <span className="text-[10px] text-slate-400 font-bold block">رقم الحساب / المحفظة</span>
                    <div className="flex items-center justify-between gap-3 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50 mt-1">
                      <span className="font-mono text-xs text-slate-700 font-bold break-all select-all">{pm.value}</span>
                      <span className="text-[9px] bg-blue-50 text-primary px-2 py-0.5 rounded font-black tracking-wider uppercase">{pm.currency}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom tab buttons */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => handleSaveCourseInfo(true)}
          className="px-12 py-3 bg-primary text-white font-black rounded-full shadow-lg shadow-blue-100 hover:brightness-110 transition-all text-sm"
        >
          التالي
        </button>
      </div>
    </div>
  );
};
