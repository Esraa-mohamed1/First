import React, { useRef, useState } from 'react';
import { UploadCloud, X, Image as ImageIcon, Loader2, FolderOpen, Check } from 'lucide-react';
// Import uploadFileLocal to save files locally rather than using Bunny Storage
import { uploadFileLocal } from '@/services/upload';

interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  galleryImages?: string[];
  circlePreview?: boolean;
}

export default function ImageUploader({
  value,
  onChange,
  label = 'تحميل صورة أو فيديو',
  galleryImages = [],
  circlePreview = false,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      alert('الرجاء اختيار ملف صورة أو فيديو صالح');
      return;
    }

    setIsUploading(true);

    // 1. Try uploading to local server storage first
    try {
      const uploadedUrl = await uploadFileLocal(file);
      if (uploadedUrl) {
        onChange(uploadedUrl);
        setIsUploading(false);
        return;
      }
    } catch (err) {
      console.warn('Local storage upload failed, falling back to FileReader DataURL:', err);
    }

    // 2. Fallback to reading file as base64 DataURL
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        if (base64) {
          onChange(base64);
        } else {
          alert('فشل قراءة الملف، يرجى المحاولة مرة أخرى.');
        }
        setIsUploading(false);
      };
      reader.onerror = () => {
        alert('حدث خطأ أثناء قراءة الملف.');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Failed to read file as Base64:', err);
      alert('حدث خطأ أثناء معالجة الملف.');
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const isVideoFile = value && (value.startsWith('data:video/') || value.endsWith('.mp4') || value.endsWith('.webm') || value.endsWith('.ogg'));
  const hasGalleryImages = Array.isArray(galleryImages) && galleryImages.length > 0;

  return (
    <div className="space-y-1.5 text-right" dir="rtl">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black text-slate-500 block">{label}</label>
          {hasGalleryImages && (
            <button
              type="button"
              onClick={() => setIsGalleryOpen(true)}
              className="text-[9.5px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline transition-all"
            >
              <FolderOpen className="w-3 h-3" />
              <span>اختيار من المعرض ({galleryImages.length})</span>
            </button>
          )}
        </div>
      )}
      
      {isUploading ? (
        // Uploading state
        <div className="border border-slate-200 rounded-2xl h-32 flex flex-col items-center justify-center gap-2 bg-slate-50">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          <span className="text-[9px] font-black text-slate-500">جاري معالجة ورفع الملف...</span>
        </div>
      ) : value ? (
        // Preview state
        <div className={`relative border border-slate-200 overflow-hidden bg-slate-50 group flex items-center justify-center ${
          circlePreview ? 'w-24 h-24 rounded-full mx-auto' : 'rounded-2xl h-32'
        }`}>
          {isVideoFile ? (
            <video 
              src={value} 
              muted 
              autoPlay 
              loop 
              playsInline 
              className="w-full h-full object-cover"
            />
          ) : (
            <img 
              src={value} 
              alt="Preview" 
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
            />
          )}
          <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 bg-white/95 rounded-lg text-[10px] font-bold text-slate-800 shadow hover:bg-white active:scale-95 transition-all"
              title="تغيير الملف"
            >
              رفع
            </button>
            {hasGalleryImages && (
              <button
                type="button"
                onClick={() => setIsGalleryOpen(true)}
                className="p-1.5 bg-blue-600 rounded-lg text-[10px] font-bold text-white shadow hover:bg-blue-700 active:scale-95 transition-all"
                title="اختيار من المعرض"
              >
                معرض
              </button>
            )}
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 bg-rose-600 rounded-lg text-[10px] font-bold text-white shadow hover:bg-rose-700 active:scale-95 transition-all"
              title="إزالة الصورة"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        // Upload State
        <div className="space-y-2">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
              isDragging 
                ? 'border-blue-500 bg-blue-50/10' 
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/40 hover:bg-slate-50'
            }`}
          >
            <UploadCloud className={`w-7 h-7 ${isDragging ? 'text-blue-500 animate-bounce' : 'text-slate-400'}`} />
            <div className="text-center">
              <span className="text-[10px] font-black text-slate-700 block">اضغط هنا أو اسحب الصورة لرفعها</span>
              <span className="text-[8.5px] text-slate-400 font-bold block mt-0.5">يدعم JPG, PNG, WebP, GIF</span>
            </div>
          </div>

          {hasGalleryImages && (
            <button
              type="button"
              onClick={() => setIsGalleryOpen(true)}
              className="w-full py-2 px-3 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-[10px] font-extrabold text-slate-700 flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>اختيار من المعرض المتاح ({galleryImages.length} صور)</span>
            </button>
          )}
        </div>
      )}

      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*"
        className="hidden"
      />

      {/* Gallery Selection Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" dir="rtl">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-black text-slate-800">اختر صورة من المعرض</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsGalleryOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              {galleryImages.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs font-bold">
                  لا توجد صور في المعرض حالياً.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {galleryImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onChange(imgUrl);
                        setIsGalleryOpen(false);
                      }}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group ${
                        value === imgUrl ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-blue-400'
                      }`}
                    >
                      <img src={imgUrl} alt={`Gallery item ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                      {value === imgUrl && (
                        <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full p-0.5 shadow">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all"
              >
                رفع صورة جديدة من جهازك
              </button>
              <button
                type="button"
                onClick={() => setIsGalleryOpen(false)}
                className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300 transition-all"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

