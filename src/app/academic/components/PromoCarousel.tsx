'use client';

import React from 'react';
import { GripHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface CarouselSlide {
  title: string;
  description: string;
}

interface PromoCarouselProps {
  carouselIndex: number;
  setCarouselIndex: (index: number) => void;
  carouselSlides: CarouselSlide[];
  handleNextSlide: () => void;
  handlePrevSlide: () => void;
}

export const PromoCarousel = ({
  carouselIndex,
  setCarouselIndex,
  carouselSlides,
  handleNextSlide,
  handlePrevSlide,
}: PromoCarouselProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative group min-h-[400px] sm:min-h-[460px] flex flex-col justify-between p-4 sm:p-6">
      
      {/* Header Block */}
      <div className="flex items-center justify-between w-full mb-2">
        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
          <GripHorizontal size={16} />
        </div>
        <h4 className="text-[10px] sm:text-xs font-black text-gray-900 leading-tight text-right flex-1 mr-2 truncate" title="هل تريد المزيد من المستخدمين على موقعك؟">
          هل تريد المزيد من المستخدمين على موقعك؟
        </h4>
      </div>

      {/* Illustration Mockup Image */}
      <div className="relative h-36 sm:h-44 w-full my-3 sm:my-4 flex items-center justify-center overflow-hidden rounded-xl border border-gray-50">
        <Image
          src="/assets/ima.png"
          alt="Promotional Banner"
          fill
          className="object-contain hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 300px"
          priority
        />
      </div>

      {/* Active Slide Text Content */}
      <div className="space-y-1 sm:space-y-2 text-right">
        <h4 className="text-xs sm:text-sm font-black text-gray-900 leading-snug">
          {carouselSlides[carouselIndex].title}
        </h4>
        <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold leading-relaxed min-h-[40px] sm:min-h-[50px] line-clamp-3">
          {carouselSlides[carouselIndex].description}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-row sm:flex-col xl:flex-row items-center sm:items-stretch xl:items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
        <button className="flex-1 py-2 sm:py-2.5 bg-white border border-blue-600 text-blue-600 rounded-lg sm:rounded-xl font-black text-[10px] sm:text-xs hover:bg-blue-600 hover:text-white transition-all duration-200 active:scale-95 text-center whitespace-nowrap">
          ابدأ الأن
        </button>
        <button className="text-orange-400 font-black text-[10px] sm:text-xs hover:underline py-2 text-center whitespace-nowrap px-2">
          لا، شكراً
        </button>
      </div>

      {/* Carousel Index Dots Indicator */}
      <div className="flex justify-center gap-1 sm:gap-1.5 mt-4 sm:mt-5">
        {carouselSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCarouselIndex(i)}
            className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
              i === carouselIndex ? 'bg-blue-600 w-2 sm:w-3' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Side Edge Navigation Arrows */}
      <button 
        onClick={handlePrevSlide}
        className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 bg-white/90 border border-gray-100 rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 hover:text-white text-gray-400 transition-all duration-200 z-10"
      >
        <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
      </button>
      <button 
        onClick={handleNextSlide}
        className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 bg-white/90 border border-gray-100 rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 hover:text-white text-gray-400 transition-all duration-200 z-10"
      >
        <ChevronRight size={14} className="sm:w-4 sm:h-4" />
      </button>
    </div>
  );
};
