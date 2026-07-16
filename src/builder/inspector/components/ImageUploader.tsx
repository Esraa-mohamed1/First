import React, { useRef, useState } from 'react';
import { UploadCloud, X, Image as ImageIcon, Loader2 } from 'lucide-react';
// Import uploadFileLocal to save files locally rather than using Bunny Storage
import { uploadFileLocal } from '@/services/upload';

interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label = 'تحميل صورة أو فيديو',
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      alert('الرجاء اختيار ملف صورة أو فيديو صالح');
      return;
    }

    setIsUploading(true);
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

  return (
    <div className="space-y-1.5 text-right" dir="rtl">
      {label && <label className="text-[10px] font-black text-slate-400 block">{label}</label>}
      
      {isUploading ? (
        // Uploading state
        <div className="border border-slate-100 rounded-2xl h-32 flex flex-col items-center justify-center gap-2 bg-slate-50">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          <span className="text-[9px] font-black text-slate-500">جاري معالجة الملف...</span>
        </div>
      ) : value ? (
        // Preview state
        <div className="relative rounded-2xl border border-slate-100 overflow-hidden bg-slate-50 group h-32 flex items-center justify-center">
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
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-white/95 rounded-xl text-xs font-bold text-slate-800 shadow hover:bg-white active:scale-95 transition-all"
            >
              تغيير الملف
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2 bg-rose-600 rounded-xl text-xs font-bold text-white shadow hover:bg-rose-700 active:scale-95 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        // Upload State
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
            isDragging 
              ? 'border-blue-500 bg-blue-50/10' 
              : 'border-slate-200 hover:border-slate-300 bg-slate-50/40 hover:bg-slate-50'
          }`}
        >
          <UploadCloud className={`w-8 h-8 ${isDragging ? 'text-blue-500 animate-bounce' : 'text-slate-400'}`} />
          <div className="text-center">
            <span className="text-[10px] font-black text-slate-700 block">اضغط هنا أو اسحب الملف لرفعه</span>
            <span className="text-[8px] text-slate-400 font-bold block mt-0.5">يدعم الصور ومقاطع الفيديو</span>
          </div>
        </div>
      )}

      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*"
        className="hidden"
      />
    </div>
  );
}
