'use client';

import { ChevronDown } from 'lucide-react';
import SelectCourseTypeModal from '@/components/Academic/Modals/SelectCourseTypeModal';
import AddStudentModal from '@/components/Academic/Modals/AddStudentModal';

import { useAcademicDashboard } from './hooks/useAcademicDashboard';
import { StatsGrid } from './components/StatsGrid';
import { StudentsTable } from './components/StudentsTable';
import { CourseLibrary } from './components/CourseLibrary';
import { PremiumUsage } from './components/PremiumUsage';
import { DashboardChecklist } from './components/DashboardChecklist';
import { PromoCarousel } from './components/PromoCarousel';

export default function AcademicDashboardPage() {
  const {
    isSelectTypeModalOpen,
    setIsSelectTypeModalOpen,
    isAddStudentModalOpen,
    setIsAddStudentModalOpen,
    isPremiumExpanded,
    setIsPremiumExpanded,
    carouselIndex,
    setCarouselIndex,
    courses,
    stats,
    fetchData,
    enrichedStudents,
    carouselSlides,
    handleNextSlide,
    handlePrevSlide,
    totalStudentsLimit,
    usedStudents,
    remainingStudents,
    studentProgressPercent,
    totalCoursesLimit,
    usedCourses,
    remainingCourses,
    courseProgressPercent,
    storagePercent,
  } = useAcademicDashboard();

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700 text-right" dir="rtl">

      {/* Top Header Section */}
      <div className="flex flex-col gap-4 text-right">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">لوحة التحكم</h2>
        <div className="flex justify-start">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-colors">
            <ChevronDown size={25} className="text-gray-400" />
            <span>التاريخ</span>
          </button>
        </div>
      </div>

      {/* 1. Stats Grid (5 Cards) */}
      <StatsGrid stats={stats} />

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* RIGHT COLUMN (Main widgets) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6 lg:space-y-8 order-1">

          {/* A. Last Registered Students Card */}
          <StudentsTable
            enrichedStudents={enrichedStudents}
            setIsAddStudentModalOpen={setIsAddStudentModalOpen}
          />

          {/* B. Course Library Card */}
          <CourseLibrary
            courses={courses}
            setIsSelectTypeModalOpen={setIsSelectTypeModalOpen}
          />

          {/* C. Premium Package Usage Card */}
          <PremiumUsage
            isPremiumExpanded={isPremiumExpanded}
            setIsPremiumExpanded={setIsPremiumExpanded}
            totalStudentsLimit={totalStudentsLimit}
            usedStudents={usedStudents}
            remainingStudents={remainingStudents}
            studentProgressPercent={studentProgressPercent}
            storagePercent={storagePercent}
            totalCoursesLimit={totalCoursesLimit}
            usedCourses={usedCourses}
            remainingCourses={remainingCourses}
            courseProgressPercent={courseProgressPercent}
          />

        </div>

        {/* LEFT COLUMN (Sidebar widgets) */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6 lg:space-y-8 order-2">
          <DashboardChecklist
            setIsSelectTypeModalOpen={setIsSelectTypeModalOpen}
          />

          {/* F. Promotional Carousel Banner Card */}
          <PromoCarousel
            carouselIndex={carouselIndex}
            setCarouselIndex={setCarouselIndex}
            carouselSlides={carouselSlides}
            handleNextSlide={handleNextSlide}
            handlePrevSlide={handlePrevSlide}
          />

        </div>

      </div>

      {/* Modals Hookup */}
      <SelectCourseTypeModal
        isOpen={isSelectTypeModalOpen}
        onClose={() => setIsSelectTypeModalOpen(false)}
      />

      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        onStudentAdded={fetchData}
      />

    </div>
  );
}
