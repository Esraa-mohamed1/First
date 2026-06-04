'use client';

import React from 'react';
import { 
  X, 
  Eye, 
  Send,
} from 'lucide-react';

import { useCreateCourseModal } from './hooks/useCreateCourseModal';
import { CreateCourseModalErrorBanner } from './components/CreateCourseModalErrorBanner';
import { CreateCourseModalInfoTab } from './components/CreateCourseModalInfoTab';
import { CreateCourseModalContentTab } from './components/CreateCourseModalContentTab';
import { CreateCourseModalPricingTab } from './components/CreateCourseModalPricingTab';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId?: number | null;
  initialCourseType?: string | null;
}

const CreateCourseModal = ({ isOpen, onClose, courseId, initialCourseType }: CreateCourseModalProps) => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    instructors,
    selectedInstructor,
    setSelectedInstructor,
    title,
    setTitle,
    category,
    setCategory,
    categories,
    description,
    setDescription,
    whatYouWillLearn,
    setWhatYouWillLearn,
    whoIsThisFor,
    setWhoIsThisFor,
    openSections,
    toggleSection,
    previewUrl,
    fileInputRef,
    handleFileChange,
    pricingType,
    setPricingType,
    price,
    setPrice,
    currency,
    setCurrency,
    setStatus,
    units,
    isSubmitting,
    errors,
    setErrors,
    apiErrorMessages,
    setApiErrorMessages,
    handleSave,
  } = useCreateCourseModal({ isOpen, onClose, courseId, initialCourseType });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/40 backdrop-blur-sm" dir="rtl">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-7xl bg-[#F8FAFC] rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
          
          {/* Top Header/Action Bar */}
          <div className="p-6 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <button 
                  className="flex items-center gap-2 px-4 py-2 bg-[#E2FBE9] text-[#22C55E] rounded-lg font-bold text-sm hover:brightness-95 transition-all"
                  onClick={() => setStatus('published')}
                >
                  <Send size={16} />
                  نشر
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 border border-gray-100 rounded-lg font-bold text-sm hover:bg-gray-50 transition-all">
                  <Eye size={16} />
                  معاينة
                </button>
             </div>

             {/* Tab Switcher */}
             <div className="bg-white p-1.5 rounded-2xl flex items-center gap-2 shadow-sm border border-gray-50">
                <button 
                  onClick={() => setActiveTab('info')}
                  className={`px-8 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'info' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  معلومات الدورة
                </button>
                <button 
                  onClick={() => setActiveTab('content')}
                  className={`px-8 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'content' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  محتوي الدورة
                </button>
                <button 
                  onClick={() => setActiveTab('pricing')}
                  className={`px-8 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'pricing' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  السعر
                </button>
             </div>

             <div className="w-[200px]"></div> {/* Spacer for symmetry */}
          </div>

          <div className="px-10 pb-10">
            {/* API Error Alert Banner */}
            <CreateCourseModalErrorBanner
              apiErrorMessages={apiErrorMessages}
              setApiErrorMessages={setApiErrorMessages}
            />

            <div className="bg-white rounded-[24px] p-8 min-h-[600px] shadow-sm border border-gray-50">
              {activeTab === 'info' && (
                <CreateCourseModalInfoTab
                  title={title}
                  setTitle={setTitle}
                  category={category}
                  setCategory={setCategory}
                  categories={categories}
                  errors={errors}
                  setErrors={setErrors}
                  currentUser={currentUser}
                  instructors={instructors}
                  selectedInstructor={selectedInstructor}
                  setSelectedInstructor={setSelectedInstructor}
                  previewUrl={previewUrl}
                  fileInputRef={fileInputRef}
                  handleFileChange={handleFileChange}
                  description={description}
                  setDescription={setDescription}
                  whatYouWillLearn={whatYouWillLearn}
                  setWhatYouWillLearn={setWhatYouWillLearn}
                  whoIsThisFor={whoIsThisFor}
                  setWhoIsThisFor={setWhoIsThisFor}
                  openSections={openSections}
                  toggleSection={toggleSection}
                  handleSave={handleSave}
                  isSubmitting={isSubmitting}
                  onClose={onClose}
                />
              )}

              {activeTab === 'content' && (
                <CreateCourseModalContentTab
                  units={units}
                />
              )}

              {activeTab === 'pricing' && (
                <CreateCourseModalPricingTab
                  pricingType={pricingType}
                  setPricingType={setPricingType}
                  price={price}
                  setPrice={setPrice}
                  currency={currency}
                  setCurrency={setCurrency}
                  errors={errors}
                  setErrors={setErrors}
                  handleSave={handleSave}
                />
              )}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-8 left-8 p-3 text-gray-400 hover:text-gray-900 hover:bg-white rounded-2xl transition-all shadow-sm border border-gray-50 md:hidden"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCourseModal;
