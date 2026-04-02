"use client";

import React, { useState, useRef } from "react";
import * as tus from "tus-js-client";
import { UploadCloud, FileVideo, X, Play, Loader2, CheckCircle2 } from "lucide-react";

export const BunnyUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      setFile(selectedFile);
      if (!title) {
        // Strip extension for a default title
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
    } else {
      alert("Please select a valid video file.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith("video/")) {
      setFile(droppedFile);
      if (!title) {
        setTitle(droppedFile.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const startUpload = async () => {
    if (!file || !title) return;

    try {
      setIsUploading(true);
      setProgress(0);

      // 1. Request Video creation and get secure signature from our Next.js backend
      const response = await fetch("/api/video/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize video upload");
      }

      setVideoId(data.videoId);

      // 2. Initialize TUS client directly to Bunny Edge stream API
      const upload = new tus.Upload(file, {
        endpoint: `https://video.bunnycdn.com/tusupload`,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          AuthorizationSignature: data.signature,
          AuthorizationExpire: data.expirationTime.toString(),
          VideoId: data.videoId,
          LibraryId: data.libraryId,
        },
        metadata: {
          filetype: file.type,
          title: title,
        },
        onError: (error) => {
          console.error("Upload failed:", error);
          setIsUploading(false);
          alert("Upload failed: " + error.message);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          setProgress(Number(percentage));
        },
        onSuccess: () => {
          setIsUploading(false);
          setIsSuccess(true);
        },
      });

      // 3. Start the edge upload from the browser directly to provider!
      upload.start();

    } catch (err: any) {
      console.error(err);
      alert(err.message);
      setIsUploading(false);
    }
  };

  const resetUploader = () => {
    setFile(null);
    setTitle("");
    setProgress(0);
    setIsSuccess(false);
    setVideoId(null);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden" dir="rtl">
      <div className="p-6">
        <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
          <Play className="h-5 w-5 text-blue-600" />
          رفع درس فيديو جديد
        </h2>

        {!file ? (
          <div
            className="border-2 border-dashed border-zinc-300 rounded-xl p-8 text-center hover:bg-zinc-50 hover:border-blue-500 transition-all cursor-pointer group"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              accept="video/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>
            <p className="text-zinc-700 font-bold mb-1">اسحب وأفلت الفيديو هنا</p>
            <p className="text-zinc-500 text-sm">أو انقر لتصفح الملفات (MP4, MKV, MOV)</p>
          </div>
        ) : isSuccess ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">تم الرفع ومعالجة الفيديو بنجاح!</h3>
            <p className="text-zinc-500 mb-6 font-medium">معرف الفيديو: {videoId}</p>
            <button
              onClick={resetUploader}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
            >
              رفع فيديو آخر
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-start justify-between bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                  <FileVideo className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 truncate max-w-[200px] sm:max-w-[xs] text-right" dir="auto">{file.name}</h4>
                  <p className="text-sm text-zinc-500 font-medium">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              {!isUploading && (
                <button onClick={resetUploader} className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700 block text-right">عنوان الفيديو</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isUploading}
                placeholder="مثال: الدرس الأول - أساسيات البرمجة"
                className="w-full p-3 rounded-lg border border-zinc-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all disabled:opacity-60 bg-white font-bold"
              />
            </div>

            {isUploading && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm font-bold text-zinc-700">
                  <span>جاري الرفع للشبكة...</span>
                  <span dir="ltr">{progress}%</span>
                </div>
                <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              onClick={startUpload}
              disabled={isUploading || !title}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  برجاء الانتظار...
                </>
              ) : (
                "بدء الرفع الآمن"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
