'use client';

import React, { useEffect, useRef, useState } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, 
  Settings, Maximize, Shield, Info,
  RotateCcw, FastForward, SkipBack, SkipForward,
  PlayCircle, MousePointer2, Sparkles, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '@/hooks/usePlayerStore';
import { useHls } from '@/hooks/useHls';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  src: string;
  userEmail: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, userEmail }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());

  // Use a high-quality fallback if src is missing or invalid for demo
  const videoSrc = src || "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
  const { videoRef, isLoaded, error } = useHls(videoSrc);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { 
    isPlaying, setIsPlaying, 
    playbackSpeed, setPlaybackSpeed,
    volume, setVolume,
    currentTime, setCurrentTime,
    duration, setDuration
  } = usePlayerStore();


  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const dur = videoRef.current.duration;
      setCurrentTime(current);
      setDuration(dur);
      setProgress((current / dur) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = (parseFloat(e.target.value) / 100) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skip = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current?.requestFullscreen) {
      if (document.fullscreenElement) document.exitFullscreen();
      else containerRef.current.requestFullscreen();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative group aspect-video bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl"
      onMouseMove={() => {
        setShowControls(true);
        const timer = setTimeout(() => setShowControls(false), 3000);
        return () => clearTimeout(timer);
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-600 z-20">
          <motion.div 
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-20 h-20 rounded-[2rem] bg-white/20 backdrop-blur-xl border-4 border-white/40 flex items-center justify-center mb-8"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <p className="text-white text-xl font-black tracking-tight animate-pulse">نحن نجهز لك الرحلة الممتعة...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-20 p-10 text-center">
          <div className="w-24 h-24 rounded-[2rem] bg-red-500/20 flex items-center justify-center mb-8 border-4 border-red-500/20">
            <Info className="w-12 h-12 text-red-500" />
          </div>
          <h3 className="text-3xl font-black text-white mb-4">أوه! حدث خطأ بسيط</h3>
          <p className="text-white/60 text-lg max-w-sm font-bold">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-10 px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xl transition-all shadow-2xl shadow-blue-600/30 active:scale-95"
          >
            حاول مرة أخرى يا بطل
          </button>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
        playsInline
      />

      {/* Security Watermarks */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <motion.div 
          animate={{ 
            x: ['-20%', '120%'],
            y: ['0%', '100%']
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute text-white/5 text-xs font-black select-none whitespace-nowrap bg-white/5 px-4 py-1 rounded-full backdrop-blur-[2px]"
        >
          {userEmail} • {timestamp} • بطل تيقني الذكي
        </motion.div>
      </div>

      {/* Custom Controls */}
      <AnimatePresence>
        {(showControls || !isPlaying) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-slate-900/40 flex flex-col justify-between p-10 z-30"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="px-5 py-2.5 rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-white/10 text-xs font-black text-white uppercase tracking-widest flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  جودة عالية جداً
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:rotate-12">
                  <Settings className="w-7 h-7" />
                </button>
              </div>
            </div>

            {/* Center Controls */}
            <div className="absolute inset-0 flex items-center justify-center gap-12 pointer-events-none">
              <motion.button
                whileHover={{ scale: 1.1, rotate: -15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => skip(-10)}
                className="w-16 h-16 rounded-[1.5rem] bg-white/10 backdrop-blur-xl flex items-center justify-center text-white border-2 border-white/10 pointer-events-auto hover:bg-white/20 transition-all"
              >
                <RotateCcw className="w-7 h-7" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className="w-28 h-28 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white pointer-events-auto shadow-[0_20px_50px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-all border-4 border-white/20 relative group"
              >
                <div className="absolute inset-0 bg-white/20 rounded-[2.5rem] animate-ping group-hover:hidden" />
                {isPlaying ? <Pause className="w-12 h-12 fill-current" /> : <Play className="w-12 h-12 fill-current ml-2" />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => skip(10)}
                className="w-16 h-16 rounded-[1.5rem] bg-white/10 backdrop-blur-xl flex items-center justify-center text-white border-2 border-white/10 pointer-events-auto hover:bg-white/20 transition-all"
              >
                <FastForward className="w-7 h-7" />
              </motion.button>
            </div>

            {/* Bottom Controls */}
            <div className="space-y-8">
              {/* Progress Bar */}
              <div className="relative group/progress h-4 flex items-center cursor-pointer">
                <div className="absolute inset-0 bg-white/20 rounded-full" />
                <div 
                  className="absolute h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.8)]" 
                  style={{ width: `${progress}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <motion.div 
                  className="absolute w-8 h-8 bg-white rounded-2xl shadow-2xl flex items-center justify-center border-4 border-blue-100"
                  style={{ left: `calc(${progress}% - 16px)` }}
                >
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                </motion.div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-3 text-white font-black text-lg bg-white/10 px-5 py-2 rounded-2xl border-2 border-white/10">
                    <span className="text-blue-400">{Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}</span>
                    <span className="opacity-20">|</span>
                    <span className="opacity-60">{Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}</span>
                  </div>

                  <div className="hidden lg:flex items-center gap-4 group/volume">
                    <button onClick={() => setVolume(volume === 0 ? 1 : 0)} className="text-white hover:scale-110 transition-transform">
                      {volume === 0 ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
                    </button>
                    <div className="w-32">
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.1" 
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full accent-blue-600 h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex bg-white/10 backdrop-blur-xl rounded-[1.5rem] p-1.5 border-2 border-white/10">
                    {[1, 1.25, 1.5].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setPlaybackSpeed(speed)}
                        className={cn(
                          "px-5 py-2 rounded-xl text-xs font-black transition-all",
                          playbackSpeed === speed ? "bg-white text-slate-900 shadow-xl" : "text-white/60 hover:text-white"
                        )}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                  <button onClick={toggleFullscreen} className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110">
                    <Maximize className="w-7 h-7" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
