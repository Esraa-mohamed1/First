'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, UploadCloud, Camera, Loader2, AlertCircle, Trash2, User } from 'lucide-react';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string;
  onAvatarFileSelected: (file: File) => Promise<void>;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const AvatarUploadModal = ({
  isOpen,
  onClose,
  currentAvatar,
  onAvatarFileSelected,
}: AvatarUploadModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manage object URL for preview and cleanup
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setError(null);
      setIsUploading(false);
      setIsDragging(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validateAndSetFile = (file: File) => {
    setError(null);

    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    const isImage = file.type.startsWith('image/') || validImageTypes.includes(file.type);

    if (!isImage) {
      setError('يرجى اختيار ملف صورة صالح (PNG, JPG, WEBP, GIF).');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError('حجم الصورة يتجاوز الحد المسموح به (5 ميجابايت).');
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || isUploading) return;

    setIsUploading(true);
    setError(null);

    try {
      // Pass the selected File to the profile update handler
      await onAvatarFileSelected(selectedFile);
      onClose();
    } catch (err: any) {
      console.error('Failed to update student avatar:', err);
      const errMsg =
        err?.message ||
        err?.error ||
        'حدث خطأ أثناء رفع الصورة وتحديث الملف الشخصي. يرجى المحاولة مرة أخرى.';
      setError(errMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      dir="rtl"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        onClick={() => {
          if (!isUploading) onClose();
        }}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-[32px] p-6 sm:p-8 shadow-2xl border border-gray-100 z-10 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isUploading}
          className="absolute left-6 top-6 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
          title="إغلاق"
        >
          <X size={20} />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center mb-6 pt-2">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-sm">
            <Camera size={30} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">تغيير الصورة الشخصية</h2>
          <p className="text-xs text-gray-500 font-medium">
            اختر صورة جديدة من جهازك لتحديث صورتك الشخصية
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2.5">
            <AlertCircle size={18} className="text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          disabled={isUploading}
        />

        {/* Dropzone & Preview Area */}
        <div className="space-y-4">
          {previewUrl ? (
            /* Selected Image Preview */
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50/80 rounded-3xl border border-gray-100 space-y-4">
              <div className="w-32 h-32 rounded-3xl overflow-hidden relative shadow-md border-4 border-white bg-white">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              {selectedFile && (
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold text-gray-800 truncate max-w-xs" dir="ltr">
                    {selectedFile.name}
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} ميجابايت
                  </p>
                </div>
              )}

              {!isUploading && (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    تغيير الصورة
                  </button>
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="إزالة الاختيار"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Dropzone / Select Trigger */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => {
                if (!isUploading) fileInputRef.current?.click();
              }}
              className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/20 scale-[0.99]'
                  : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50/10 bg-gray-50/40'
              }`}
            >
              {/* Current Avatar Mini Preview or Default Icon */}
              <div className="w-20 h-20 rounded-2xl overflow-hidden relative border-2 border-gray-100 bg-white shadow-sm flex items-center justify-center">
                {currentAvatar ? (
                  <img
                    src={currentAvatar}
                    alt="Current Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={32} className="text-gray-400" />
                )}
              </div>

              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mt-1">
                <UploadCloud size={22} className={isDragging ? 'animate-bounce' : ''} />
              </div>

              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-gray-800">
                  انقر لاختيار صورة أو اسحبها وأفلتها هنا
                </p>
                <p className="text-[11px] text-gray-400 font-medium">
                  يدعم PNG, JPG, WEBP, GIF (الحد الأقصى 5 ميجابايت)
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isUploading || !selectedFile}
              className="w-full py-3.5 px-6 bg-[#0f62fe] hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>جاري الحفظ والتحديث...</span>
                </>
              ) : (
                <span>حفظ وتحديث الصورة</span>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="w-full py-3 px-6 bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs rounded-2xl hover:bg-gray-100 transition-colors disabled:opacity-60"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
