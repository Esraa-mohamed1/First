'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Film,
  Video,
  Upload,
  HardDrive,
  Clock,
  Plus,
  Lightbulb,
  Search,
  Layers,
  ArrowRight,
  Loader2,
  Sparkles,
  PlayCircle,
  Database,
} from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import toast from 'react-hot-toast';
import VideoCard from '@/components/Academic/Market/VideoCard';
import UploadVideoModal from '@/components/Academic/Market/UploadVideoModal';
import VideoPlayerModal from '@/components/Academic/Market/VideoPlayerModal';
import { AcademyVideo } from '@/types/videos';
import {
  getAcademyVideos,
  deleteAcademyVideo,
  updateAcademyVideo,
} from '@/services/academy-videos';
import { getMyUsageLimit } from '@/services/auth';

const MySwal = withReactContent(Swal);

export default function AcademyVideosPage() {
  const router = useRouter();

  // State
  const [videos, setVideos] = useState<AcademyVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [storageLimit, setStorageLimit] = useState<{
    totalGB: number;
    usedMB: number;
    remainingMB: number;
  } | null>(null);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<AcademyVideo | null>(null);

  // Load videos
  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAcademyVideos();
      setVideos(data);
    } catch (err) {
      console.error('Failed to load videos:', err);
      toast.error('فشل في تحميل قائمة الفيديوهات');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load storage usage
  const fetchUsage = useCallback(async () => {
    try {
      const usageRes = await getMyUsageLimit();
      const list = usageRes?.data || (Array.isArray(usageRes) ? usageRes : []);
      const storageObj = list.find(
        (item: any) =>
          item.feature_slug === 'storage_limit' || item.key_feature === 'storage_space'
      );
      if (storageObj) {
        const totalGB = parseFloat(storageObj.total_limit || '0');
        const usedMB = parseFloat(storageObj.used_amount || '0');
        const remainingMB = Math.max(0, totalGB * 1024 - usedMB);
        setStorageLimit({ totalGB, usedMB, remainingMB });
      }
    } catch (err) {
      console.warn('Failed to load storage limit:', err);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
    fetchUsage();
  }, [fetchVideos, fetchUsage]);

  // Handle Delete
  const handleDeleteVideo = async (id: number | string) => {
    const result = await MySwal.fire({
      title: 'هل أنت متأكد من حذف الفيديو؟',
      text: 'لن يتمكن الطلاب من مشاهدة هذا الفيديو بعد حذفه.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-[2rem]',
        confirmButton: 'rounded-xl font-bold px-6 py-3',
        cancelButton: 'rounded-xl font-bold px-6 py-3',
      },
    });

    if (result.isConfirmed) {
      try {
        await deleteAcademyVideo(id);
        setVideos((prev) => prev.filter((v) => String(v.id) !== String(id) && String(v.video_id) !== String(id)));
        toast.success('تم حذف الفيديو بنجاح');
      } catch (err) {
        console.error('Delete video failed:', err);
        toast.error('فشل في حذف الفيديو');
      }
    }
  };

  // Handle Edit (Title and Order)
  const handleEditVideo = async (video: AcademyVideo) => {
    const { value: formValues } = await MySwal.fire({
      title: 'تعديل بيانات الفيديو',
      html: `
        <div class="space-y-4 text-right" dir="rtl">
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">عنوان الفيديو</label>
            <input id="swal-title" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 outline-none" value="${video.title || ''}" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">الترتيب</label>
            <input id="swal-order" type="number" min="1" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 outline-none" value="${video.order || 1}" />
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'حفظ التعديلات',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#7c3aed',
      customClass: {
        popup: 'rounded-[2rem]',
        confirmButton: 'rounded-xl font-bold px-6 py-3',
        cancelButton: 'rounded-xl font-bold px-6 py-3',
      },
      preConfirm: () => {
        const titleInput = (document.getElementById('swal-title') as HTMLInputElement)?.value;
        const orderInput = (document.getElementById('swal-order') as HTMLInputElement)?.value;
        if (!titleInput) {
          Swal.showValidationMessage('يرجى إدخال عنوان الفيديو');
          return false;
        }
        return { title: titleInput, order: Number(orderInput) || 1 };
      },
    });

    if (formValues) {
      try {
        await updateAcademyVideo(video.id, formValues);
        setVideos((prev) =>
          prev.map((v) =>
            String(v.id) === String(video.id) || String(v.video_id) === String(video.video_id)
              ? { ...v, ...formValues }
              : v
          )
        );
        toast.success('تم تحديث بيانات الفيديو بنجاح');
      } catch (err) {
        toast.error('فشل في حفظ التعديلات');
      }
    }
  };

  // Stats calculation
  const totalVideos = videos.length;
  const totalSizeMb = videos
    .reduce((acc, v) => acc + (parseFloat(String(v.file_size_mb || 0)) || 0), 0)
    .toFixed(1);
  const latestVideo = videos.length > 0 ? videos[0] : null;

  // Filtered videos
  const filteredVideos = videos.filter((v) =>
    (v.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <span>مكتبة الفيديوهات</span>

          </h2>
          <p className="text-gray-400 font-bold mt-1 text-sm">
            إدارة ورفع الفيديوهات التعليمية الخاصة بالحقائب والمتجر
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">

          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3.5 rounded-2xl text-sm font-black shadow-lg shadow-purple-200 hover:scale-105 transition-all cursor-pointer"
          >
            <Plus size={18} strokeWidth={3} />
            <span>رفع فيديو جديد</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards (Matches Market Bags 4-column layout) */}


      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
          <Loader2 size={40} className="animate-spin text-purple-600" />
          <span className="text-sm font-bold">جاري تحميل مكتبة الفيديوهات...</span>
        </div>
      ) : videos.length === 0 ? (
        /* Empty State */
        <div className="border-2 border-dashed border-gray-200 rounded-[36px] p-12 lg:p-20 text-center bg-white/40 backdrop-blur-sm space-y-6 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-3xl bg-purple-100/70 text-purple-600 flex items-center justify-center shadow-inner">
            <Film size={42} />
          </div>
          <h3 className="text-2xl lg:text-3xl font-black text-gray-900">
            أنشئ أول فيديو تعليمي وأضفه إلى حقائبك
          </h3>
          <p className="text-gray-500 font-bold max-w-xl text-sm lg:text-base leading-relaxed">
            ارفع فيديوهاتك التدريبية عالية الجودة، سيتم معالجتها وتأمينها تلقائياً عبر سيرفرات Bunny CDN لتصبح جاهزة للعرض والبيع في متجرك.
          </p>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-base shadow-lg shadow-purple-200 hover:scale-105 transition-all cursor-pointer"
          >
            <Plus size={22} strokeWidth={3} />
            <span>رفع أول فيديو</span>
          </button>
        </div>
      ) : (
        /* Videos Grid & Controls */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-2xl font-black text-gray-900">
              قائمة الفيديوهات المرفوعة ({videos.length})
            </h3>

            {/* Search Box */}
            <div className="relative w-full sm:w-72">
              <Search
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث عن فيديو..."
                className="w-full pr-11 pl-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-bold text-gray-800 outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 transition-all"
              />
            </div>
          </div>

          {filteredVideos.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
              <p className="text-gray-400 font-bold text-sm">
                لا توجد نتائج تطابق بحثك عن &quot;{searchQuery}&quot;
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.id || video.video_id}
                  video={video}
                  onPreview={(v) => setPreviewVideo(v)}
                  onDelete={handleDeleteVideo}
                  onEdit={handleEditVideo}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Tips Section (Matches bags page footer) */}
      <div className="space-y-6 pt-4">
        <h3 className="text-2xl font-black text-gray-900">نصائح لفيديوهات تعليمية ناجحة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Lightbulb size={20} />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-black text-gray-900">جودة وتنسيق الفيديو</h4>
              <p className="text-xs font-bold text-gray-400 leading-relaxed">
                استخدم صيغة MP4 بدقة 1080p وترميز H.264 لضمان سرعة المعالجة وأفضل أداء تشغيل لطلابك على جميع الأجهزة.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <PlayCircle size={20} />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-black text-gray-900">ترتيب الدروس والمحاور</h4>
              <p className="text-xs font-bold text-gray-400 leading-relaxed">
                اضبط حقل الترتيب لكل فيديو لتنظيم تسلسل المحتوى التدريبي بوضوح داخل الحقيبة التدريبية.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-black text-gray-900">حماية وتشفير البث</h4>
              <p className="text-xs font-bold text-gray-400 leading-relaxed">
                يتم تأمين جميع الفيديوهات المرفوعة وتوزيعها عبر شبكة Bunny CDN العالمية لحمايتها من التحميل غير المصرح به.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Video Modal */}
      <UploadVideoModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        suggestedOrder={videos.length + 1}
        onVideoUploaded={(newVideo) => {
          setVideos((prev) => [newVideo, ...prev]);
        }}
      />

      {/* Video Player Modal */}
      <VideoPlayerModal
        video={previewVideo}
        onClose={() => setPreviewVideo(null)}
      />
    </div>
  );
}
