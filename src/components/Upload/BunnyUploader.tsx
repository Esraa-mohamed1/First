'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  UploadCloud, 
  FileVideo, 
  X, 
  Play, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Video,
  BarChart2,
  Settings
} from 'lucide-react';

const LIBRARY_ID = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID;
const API_KEY = process.env.NEXT_PUBLIC_BUNNY_API_KEY;
const PULL_ZONE_ID = process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE_ID;

const POLL_INTERVAL = 5000; // 5 seconds
const MAX_POLL_TIME = 10 * 60 * 1000; // 10 minutes

export const BunnyUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'idle' | 'creating' | 'uploading' | 'encoding' | 'saving' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [encodeProgress, setEncodeProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState('');

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile);
      if (!title) setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
      setError(null);
      setStatus('idle');
    } else if (selectedFile) {
      setError('يرجى اختيار ملف فيديو صالح.');
    }
  };

  const startFlow = async () => {
    if (!file || !title) return;
    
    if (!LIBRARY_ID || !API_KEY || !PULL_ZONE_ID) {
      setError('إعدادات BunnyCDN غير مكتملة. يرجى مراجعة متغيرات البيئة.');
      setStatus('error');
      return;
    }

    setError(null);
    setUploadProgress(0);
    setEncodeProgress(0);

    try {
      // 1. Create video entry
      setStatus('creating');
      const createRes = await axios.post(
        `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`,
        { title },
        { headers: { AccessKey: API_KEY, 'Content-Type': 'application/json' } }
      );
      const guid = createRes.data.guid;

      // 2. Upload video file
      setStatus('uploading');
      await axios.put(
        `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${guid}`,
        file,
        {
          headers: { 
            AccessKey: API_KEY,
            'Content-Type': 'application/octet-stream'
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || file.size));
            setUploadProgress(percent);
          }
        }
      );

      // 3. Poll BunnyCDN for encoding status
      setStatus('encoding');
      const startTime = Date.now();
      
      pollIntervalRef.current = setInterval(async () => {
        try {
          if (Date.now() - startTime > MAX_POLL_TIME) {
            throw new Error('انتهت مهلة المعالجة (10 دقائق).');
          }

          const statusRes = await axios.get(
            `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${guid}`,
            { headers: { AccessKey: API_KEY } }
          );

          const { status: bunnyStatus, encodeProgress: bunnyProgress } = statusRes.data;
          setEncodeProgress(bunnyProgress);

          // status === 4 means encoding is complete
          if (bunnyStatus === 4 && bunnyProgress === 100) {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            
            // 4. Build final URL
            const streamUrl = `https://vz-${PULL_ZONE_ID}.b-cdn.net/${guid}/playlist.m3u8`;
            setVideoUrl(streamUrl);

            // 5. Send only the URL to your backend
            setStatus('saving');
            await axios.post('/api/videos', { videoUrl: streamUrl });
            
            setStatus('success');
          } else if (bunnyStatus === 3) {
             // Status 3 means it's processing but failed? No, 3 is usually encoding.
             // We just keep polling.
          }
        } catch (err: any) {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setError(err.message || 'حدث خطأ أثناء التحقق من حالة المعالجة');
          setStatus('error');
        }
      }, POLL_INTERVAL);

    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'حدث خطأ أثناء الرفع');
      setStatus('error');
    }
  };

  const resetUploader = () => {
    setFile(null);
    setTitle('');
    setStatus('idle');
    setError(null);
    setUploadProgress(0);
    setEncodeProgress(0);
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
  };

  const isProcessing = status !== 'idle' && status !== 'success' && status !== 'error';

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden text-right" dir="rtl">
      <div className="p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Video size={24} />
              </div>
              رفع درس فيديو
            </h2>
            <p className="text-gray-400 font-bold text-sm mt-1">رفع وتجهيز الفيديو عبر BunnyCDN</p>
          </div>
          {file && !isProcessing && status !== 'success' && (
            <button onClick={resetUploader} className="p-3 text-gray-400 hover:text-red-500 bg-gray-50 rounded-xl transition-all">
              <X size={20} />
            </button>
          )}
        </div>

        {!file ? (
          <div
            className="border-2 border-dashed border-gray-200 rounded-[2rem] p-16 text-center hover:bg-blue-50/30 hover:border-blue-400 transition-all cursor-pointer group relative overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              accept="video/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <UploadCloud size={40} />
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2">اسحب وأفلت الفيديو هنا</h3>
            <p className="text-gray-400 font-bold">أو انقر لتصفح الملفات من جهازك</p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-300 bg-gray-50 px-3 py-1 rounded-full">MP4</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-300 bg-gray-50 px-3 py-1 rounded-full">MKV</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-300 bg-gray-50 px-3 py-1 rounded-full">MOV</span>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* File Info */}
            <div className="flex items-center gap-5 p-6 bg-gray-50/50 border border-gray-100 rounded-3xl">
              <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl shadow-sm flex items-center justify-center shrink-0">
                <FileVideo size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-gray-900 truncate" dir="auto">{file.name}</h4>
                <p className="text-sm text-gray-400 font-bold mt-0.5">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>

            {/* Title Input */}
            <div className="space-y-3">
              <label className="text-sm font-black text-gray-700 mr-2">عنوان الدرس</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isProcessing || status === 'success'}
                placeholder="أدخل عنواناً جذاباً للفيديو..."
                className="w-full p-5 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all disabled:opacity-50 font-bold"
              />
            </div>

            {/* Progress Area */}
            {isProcessing && (
              <div className="space-y-6 pt-4">
                {/* Status Indicator */}
                <div className="flex items-center gap-3 text-blue-600 animate-pulse">
                  <Loader2 className="animate-spin" size={18} />
                  <span className="text-sm font-black">
                    {status === 'creating' && 'جاري تهيئة مساحة الرفع...'}
                    {status === 'uploading' && 'جاري رفع الفيديو إلى السحابة...'}
                    {status === 'encoding' && 'جاري معالجة الفيديو وتجهيز الجودات...'}
                    {status === 'saving' && 'جاري حفظ الرابط النهائي...'}
                  </span>
                </div>

                {/* Upload Progress */}
                {status === 'uploading' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Upload Progress</span>
                      <span className="text-2xl font-black text-blue-600" dir="ltr">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-50">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Encoding Progress */}
                {status === 'encoding' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Encoding Progress</span>
                      <span className="text-2xl font-black text-orange-500" dir="ltr">{encodeProgress}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-50">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all duration-300"
                        style={{ width: `${encodeProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-gray-400 font-bold text-center">يمكنك ترك هذه الصفحة، المعالجة ستستمر في الخلفية</p>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-4 p-5 bg-red-50 border border-red-100 rounded-2xl text-red-600 animate-in slide-in-from-top-2">
                <AlertCircle className="shrink-0 mt-0.5" size={20} />
                <div className="space-y-1">
                  <p className="font-black text-sm">حدث خطأ أثناء العمل</p>
                  <p className="text-xs font-bold opacity-80">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {status === 'success' && (
              <div className="text-center py-6 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">اكتمل الرفع بنجاح!</h3>
                <p className="text-gray-400 font-bold mb-8">تم حفظ الفيديو وتجهيزه للعرض.</p>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-8 overflow-hidden">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2 text-right">Stream URL</p>
                    <p className="text-xs font-mono text-gray-500 truncate text-left" dir="ltr">{videoUrl}</p>
                </div>
                <button
                  onClick={resetUploader}
                  className="px-10 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-lg"
                >
                  رفع فيديو آخر
                </button>
              </div>
            )}

            {/* Actions */}
            {status !== 'success' && (
              <button
                onClick={startFlow}
                disabled={isProcessing || !title}
                className={`w-full py-5 rounded-[2rem] font-black text-xl transition-all flex items-center justify-center gap-3 shadow-xl ${
                  isProcessing 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-1 active:scale-95 shadow-blue-200'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    <span>جاري التنفيذ...</span>
                  </>
                ) : (
                  <>
                    <Play size={24} fill="currentColor" />
                    <span>ابدأ الرفع والمعالجة</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
