'use client';

import React from 'react';
import { Plus, ChevronDown, ChevronUp, Pencil, Trash2, Video, FileText, FilePieChart as FilePowerpoint } from 'lucide-react';
import { Course } from '@/types/api';

interface CourseContentTabProps {
  course: Course | null;
  isAddingUnit: boolean;
  setIsAddingUnit: (val: boolean) => void;
  newUnitTitle: string;
  setNewUnitTitle: (val: string) => void;
  newUnitDescription: string;
  setNewUnitDescription: (val: string) => void;
  isSavingUnit: boolean;
  handleSaveUnit: () => Promise<void>;
  expandedUnits: number[];
  toggleUnit: (unitId: number) => void;
  handleEditUnit: (unitId: number) => void;
  handleDeleteUnit: (unitId: number) => void;
  handleEditLesson: (lessonId: number) => void;
  handleDeleteLesson: (lessonId: number) => void;
  handleAddLesson: (unitId: number, unitTitle: string) => void;
  setActiveTab: (tab: 'info' | 'content' | 'pricing' | 'landing_pages' | 'subscribers') => void;
}

export const CourseContentTab: React.FC<CourseContentTabProps> = ({
  course,
  isAddingUnit,
  setIsAddingUnit,
  newUnitTitle,
  setNewUnitTitle,
  newUnitDescription,
  setNewUnitDescription,
  isSavingUnit,
  handleSaveUnit,
  expandedUnits,
  toggleUnit,
  handleEditUnit,
  handleDeleteUnit,
  handleEditLesson,
  handleDeleteLesson,
  handleAddLesson,
  setActiveTab,
}) => {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Header & Add Unit */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between border border-outline-variant rounded-xl p-3 bg-white gap-3 shadow-sm">
        <div className="flex-grow text-center md:text-right px-4">
          <span className="font-bold text-gray-800 text-sm">
            الاجمالي {course?.units?.length || 0} وحدة فقط | {course?.units?.reduce((acc: number, unit: any) => acc + (unit.lessons?.length || 0), 0) || 0} دروس
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsAddingUnit(!isAddingUnit)}
          className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-primary-container hover:text-white transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-100"
        >
          <Plus size={18} strokeWidth={3} />
          <span>اضافة وحدة</span>
        </button>
      </div>

      {/* Add Unit Form (Inline) */}
      {isAddingUnit && (
        <div className="bg-white rounded-2xl shadow-sm border border-outline-variant p-5 space-y-4 animate-in fade-in slide-in-from-top-2">
          <h3 className="text-lg font-black text-gray-900">ادخل بيانات الوحدة</h3>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500">اسم الوحدة</label>
              <input
                type="text"
                value={newUnitTitle}
                onChange={(e) => setNewUnitTitle(e.target.value)}
                placeholder="ادخل اسم الوحدة"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-primary font-bold text-sm transition-all text-gray-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500">وصف للوحدة</label>
              <textarea
                value={newUnitDescription}
                onChange={(e) => setNewUnitDescription(e.target.value)}
                placeholder="ادخل وصف للوحدة"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-primary font-bold text-sm min-h-[80px] transition-all text-gray-900"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingUnit(false)}
              className="px-6 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-full hover:bg-gray-200 transition-all text-sm"
            >
              الغاء
            </button>
            <button
              type="button"
              onClick={handleSaveUnit}
              disabled={isSavingUnit}
              className="px-10 py-2.5 bg-primary text-white font-bold rounded-full hover:brightness-110 transition-all disabled:opacity-70 text-sm shadow-lg shadow-blue-50"
            >
              {isSavingUnit ? 'جاري الحفظ...' : 'حفظ'}
            </button>
          </div>
        </div>
      )}

      {/* Units List */}
      <div className="space-y-3">
        {course?.units && course.units.length > 0 ? (
          course.units.map((unit: any) => (
            <div key={unit.id} className="bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden">
              {/* Unit Header */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => toggleUnit(unit.id)}
              >
                <div className="flex items-center gap-3">
                  <button type="button" className="p-1.5 bg-gray-50 rounded-lg text-primary">
                    {expandedUnits.includes(unit.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <div>
                    <h3 className="text-base md:text-lg font-black text-gray-900">{unit.title}</h3>
                    {unit.description && <p className="text-xs text-gray-400 font-bold mt-0.5">{unit.description}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleEditUnit(unit.id); }}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDeleteUnit(unit.id); }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Lessons List */}
              {expandedUnits.includes(unit.id) && (
                <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50/30">
                  {unit.lessons && unit.lessons.length > 0 ? (
                    unit.lessons.map((lesson: any) => (
                      <div key={lesson.id} className="flex items-center justify-between p-3 bg-white border border-outline-variant rounded-xl hover:border-primary/45 transition-all group shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${lesson.type === 'video' ? 'bg-blue-50 text-blue-600' :
                              lesson.type === 'pdf' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                            }`}>
                            {lesson.type === 'video' ? <Video size={18} /> :
                              lesson.type === 'pdf' ? <FileText size={18} /> : <FilePowerpoint size={18} />}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm">{lesson.title}</h4>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold mt-0.5">
                              <span>{lesson.type === 'video' ? 'فيديو' : lesson.type === 'pdf' ? 'ملف PDF' : 'عرض تقديمي'}</span>
                              {lesson.duration && <span>• {lesson.duration} دقيقة</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleEditLesson(lesson.id); }}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleDeleteLesson(lesson.id); }}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : null}

                  {/* Add Lesson Button */}
                  <div className="border-2 border-dashed border-outline-variant rounded-xl p-1.5">
                    <button
                      type="button"
                      onClick={() => handleAddLesson(unit.id, unit.title)}
                      className="w-full py-3.5 rounded-xl text-gray-500 font-bold hover:text-primary hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 text-sm group"
                    >
                      <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center group-hover:bg-primary transition-all transform group-hover:scale-110">
                        <Plus size={14} strokeWidth={3} className="text-white" />
                      </div>
                      <span>اضف درس جديد</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          !isAddingUnit && (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-outline-variant">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="text-gray-300" size={32} />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-1">لا يوجد وحدات حتى الآن</h3>
              <p className="text-gray-400 font-bold text-sm mb-6">ابدأ بإضافة وحدة جديدة لترتيب محتوى الدورة</p>
              <button
                type="button"
                onClick={() => setIsAddingUnit(true)}
                className="bg-primary text-white px-6 py-2.5 rounded-xl font-black shadow-lg shadow-blue-100 hover:brightness-110 active:scale-95 transition-all text-sm"
              >
                اضافة وحدة جديدة
              </button>
            </div>
          )
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-outline-variant mt-6">
        <button
          type="button"
          onClick={() => setActiveTab('info')}
          className="px-10 py-3 bg-gray-100 text-gray-600 font-black rounded-full hover:bg-gray-200 transition-all text-sm"
        >
          السابق
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('landing_pages')}
          className="px-12 py-3 bg-primary text-white font-black rounded-full shadow-lg shadow-blue-100 hover:brightness-110 transition-all text-sm"
        >
          التالي
        </button>
      </div>
    </div>
  );
};
