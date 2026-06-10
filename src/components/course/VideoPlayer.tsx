'use client';

import React, { useEffect, useRef, useState } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, 
  Settings, Maximize, Shield, Info,
  RotateCcw, FastForward, SkipBack, SkipForward,
  PlayCircle, MousePointer2, Sparkles, Star, StickyNote, X
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

  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState('');

  // Intercept track-session to store current time as requested
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [resource, config] = args;
      if (typeof resource === 'string' && resource.includes('.metrics/track-session')) {
        try {
          if (config && config.body) {
            const bodyStr = config.body.toString();
            const payload = JSON.parse(bodyStr);
            if (payload && payload.currentTime !== undefined) {
              localStorage.setItem('bunny_current_time', payload.currentTime.toString());
              console.log('Intercepted track-session currentTime:', payload.currentTime);
            }
          }
        } catch (e) {
          // ignore parsing errors
        }
      }
      return originalFetch.apply(window, args);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    const noteTime = localStorage.getItem('bunny_current_time') 
      ? parseFloat(localStorage.getItem('bunny_current_time')!) 
      : currentTime;
      
    console.log(`Saved note at time ${formatTime(noteTime)}:`, noteText);
    setNoteText('');
    setShowNotes(false);
    if (!isPlaying) togglePlay();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleSeekMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleSeekUpdate(e);
  };

  const handleSeekMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleSeekUpdate(e);
    }
  };

  const handleSeekMouseUp = () => {
    setIsDragging(false);
  };

  const handleSeekUpdate = (e: React.MouseEvent) => {
    if (containerRef.current && videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clickedPos = Math.max(0, Math.min(1, x / rect.width));
      const time = clickedPos * duration;
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleFullScreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

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

  const skip = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
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

      {/* Notes Panel Overlay */}
      <AnimatePresence>
        {showNotes && (
          <motion.div 
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 h-full w-[300px] bg-slate-900/60 backdrop-blur-md z-40 flex flex-col border-l border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <StickyNote className="text-blue-400 w-5 h-5" />
                <h3 className="text-white font-bold text-sm">أضف ملاحظة</h3>
              </div>
              <button 
                onClick={() => setShowNotes(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 flex-1 flex flex-col gap-4">
              <div className="text-xs text-white/60 font-medium">
                الوقت الحالي: <span className="text-blue-400 font-bold">{formatTime(currentTime)}</span>
              </div>
              <textarea 
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="اكتب ملاحظتك هنا... (لن تخفي هذه النافذة الفيديو بالكامل)"
                className="w-full flex-1 bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-blue-400 transition-colors"
                dir="rtl"
              />
              <button 
                onClick={handleSaveNote}
                disabled={!noteText.trim()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-xl font-bold transition-colors"
              >
                حفظ الملاحظة
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
        

              {/* Play/Pause Button */}
              <motion.button
                onClick={togglePlay}
                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white border-2 border-white/10 pointer-events-auto hover:bg-white/30 transition-all"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                {isPlaying ? <Pause className="w-10 h-10" fill="currentColor" /> : <Play className="w-10 h-10" fill="currentColor" />}
              </motion.button>
            </div>

            {/* Bottom Controls */}
            <div className="space-y-4 p-4">
              {/* Progress Bar */}
              <div
                className="relative group/progress h-2 flex items-center cursor-pointer"
                onMouseDown={handleSeekMouseDown}
                onMouseMove={handleSeekMouseMove}
                onMouseUp={handleSeekMouseUp}
                onMouseLeave={handleSeekMouseUp}
              >
                <div className="absolute inset-0 bg-white/30 rounded-full" />
                <div
                  className="absolute h-full bg-blue-500 rounded-full"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
                <div
                  className="absolute w-4 h-4 bg-blue-500 rounded-full shadow-lg"
                  style={{ left: `${(currentTime / duration) * 100}%`, transform: 'translateX(-50%)' }}
                />
              </div>

              {/* Time and Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={togglePlay} className="text-white hover:text-blue-400 transition-colors">
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                  </button>
                  <span className="text-white font-medium text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Volume Control */}
                  <div className="flex items-center gap-2">
                    <button onClick={toggleMute} className="text-white hover:text-blue-400 transition-colors">
                      {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-24 h-1 bg-white/30 rounded-full appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  {/* Notes Toggle */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowNotes(!showNotes);
                      if (isPlaying) togglePlay();
                    }} 
                    className={cn(
                      "transition-colors",
                      showNotes ? "text-blue-400" : "text-white hover:text-blue-400"
                    )}
                  >
                    <StickyNote size={24} />
                  </button>

                  {/* Settings */}
                  <button className="text-white hover:text-blue-400 transition-colors">
                    <Settings size={24} />
                  </button>

                  {/* Fullscreen */}
                  <button onClick={toggleFullScreen} className="text-white hover:text-blue-400 transition-colors">
                    <Maximize size={24} />
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
