'use client';

import React from 'react';
import { 
  X, 
  ChevronUp, 
  ChevronDown, 
  Upload, 
  Loader2, 
  Save, 
  ArrowRight 
} from 'lucide-react';
import QuillEditor from '@/components/Academic/QuillEditor';
import { SearchableSelect } from '@/components/Academic/Common/SearchableSelect';
import { User } from '@/types/api';

interface CreateCourseModalInfoTabProps {
  title: string;
  setTitle: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  categories: any[];
  errors: Record<string, any>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  currentUser: User | null;
  instructors: User[];
  selectedInstructor: number | null;
  setSelectedInstructor: (val: number | null) => void;
  previewUrl: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description: string;
  setDescription: (val: string) => void;
  whatYouWillLearn: string;
  setWhatYouWillLearn: (val: string) => void;
  whoIsThisFor: string;
  setWhoIsThisFor: (val: string) => void;
  openSections: Record<string, boolean>;
  toggleSection: (section: string) => void;
  handleSave: () => Promise<void>;
  isSubmitting: boolean;
  onClose: () => void;
}

export const CreateCourseModalInfoTab = ({
  title,
  setTitle,
  category,
  setCategory,
  categories,
  errors,
  setErrors,
  currentUser,
  instructors,
  selectedInstructor,
  setSelectedInstructor,
  previewUrl,
  fileInputRef,
  handleFileChange,
  description,
  setDescription,
  whatYouWillLearn,
  setWhatYouWillLearn,
  whoIsThisFor,
  setWhoIsThisFor,
  openSections,
  toggleSection,
  handleSave,
  isSubmitting,
  onClose,
}: CreateCourseModalInfoTabProps) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Right Side: Basic Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-black text-gray-900">
              اسم الدورة <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
              }}
              placeholder="ادخل اسم الدورة"
              className={`w-full p-4 bg-white border ${
                errors.title ? 'border-red-500 bg-red-50/30' : 'border-gray-100'
              } rounded-2xl outline-none focus:border-blue-600 font-bold text-right transition-all text-gray-900`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1">
                <X size={12} />
                {errors.title}
              </p>
            )}
          </div>

          <SearchableSelect
            label="الفئة"
            options={categories.map((c) => ({ id: c.id, name: c.name }))}
            value={category}
            onChange={(val) => {
              setCategory(val as string);
              if (errors.category_id) setErrors((prev) => ({ ...prev, category_id: null }));
            }}
            placeholder="اختر فئة (اختياري)"
            error={errors.category_id}
          />

          {(currentUser?.role === 'admin' || currentUser?.role === 'academy') && (
            <SearchableSelect
              label="المدرب"
              options={instructors.map((i) => ({ id: i.id, name: i.name }))}
              value={selectedInstructor}
              onChange={(val) => {
                setSelectedInstructor(val as number);
                if (errors.user_id) setErrors((prev) => ({ ...prev, user_id: null }));
              }}
              placeholder="اختر مدرب"
              error={errors.user_id}
              required
            />
          )}

          <div className="space-y-2">
            <label className="block text-sm font-black text-gray-900">
              صورة الدورة <span className="text-red-500">*</span>
            </label>
            <div
              className="border-2 border-dashed border-gray-100 rounded-[24px] p-12 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-blue-600 transition-all min-h-[320px] relative overflow-hidden bg-gray-50/30"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <>
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Upload className="text-gray-400 group-hover:text-blue-600" size={32} />
                  </div>
                  <div className="text-center">
                    <p className="font-black text-gray-900">اضف صورة الدورة</p>
                    <p className="text-xs font-bold text-gray-400 mt-2">صورة غلاف دورة : 1270x820</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Left Side: Accordion Sections */}
        <div className="space-y-4">
          {/* Description Section */}
          <div className="border border-gray-100 rounded-[20px] overflow-hidden bg-white shadow-sm">
            <button
              onClick={() => toggleSection('description')}
              className="w-full p-5 flex items-center justify-between font-black text-gray-900 hover:bg-gray-50/50 transition-all"
            >
              <span>وصف الدورة</span>
              {openSections.description ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {openSections.description && (
              <div className="p-5 pt-0">
                <QuillEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="ادخل وصف الدورة"
                />
              </div>
            )}
          </div>

          {/* What You Will Learn Section */}
          <div className="border border-gray-100 rounded-[20px] overflow-hidden bg-white shadow-sm">
            <button
              onClick={() => toggleSection('learning')}
              className="w-full p-5 flex items-center justify-between font-black text-gray-900 hover:bg-gray-50/50 transition-all"
            >
              <span>ماذا تتعلم</span>
              {openSections.learning ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {openSections.learning && (
              <div className="p-5 pt-0">
                <QuillEditor
                  value={whatYouWillLearn}
                  onChange={setWhatYouWillLearn}
                  placeholder="ماذا تتعلم في هذه الدورة ؟"
                />
              </div>
            )}
          </div>

          {/* Who Is This For Section */}
          <div className="border border-gray-100 rounded-[20px] overflow-hidden bg-white shadow-sm">
            <button
              onClick={() => toggleSection('audience')}
              className="w-full p-5 flex items-center justify-between font-black text-gray-900 hover:bg-gray-50/50 transition-all"
            >
              <span>لمن هذه الدورة</span>
              {openSections.audience ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {openSections.audience && (
              <div className="p-5 pt-0">
                <QuillEditor
                  value={whoIsThisFor}
                  onChange={setWhoIsThisFor}
                  placeholder="اذكر لمن تكون هذه الدورة ؟"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center gap-4 pt-10">
        <button
          onClick={handleSave}
          disabled={isSubmitting}
          className="flex-1 max-w-[280px] flex items-center justify-center gap-3 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:brightness-110 active:scale-95 transition-all disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          حفظ
        </button>
        <button
          onClick={onClose}
          className="flex-1 max-w-[280px] flex items-center justify-center gap-3 py-4 bg-gray-100 text-gray-600 font-black rounded-2xl hover:bg-gray-200 active:scale-95 transition-all"
        >
          <ArrowRight size={20} className="rotate-180" />
          عودة
        </button>
      </div>
    </div>
  );
};
