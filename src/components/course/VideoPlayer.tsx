'use client';

import React, { useEffect, useRef, useState } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, 
  Settings, Maximize, Shield, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '@/hooks/usePlayerStore';
import { useHls } from '@/hooks/useHls';

interface VideoPlayerProps {
  src: string;
  userEmail: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, userEmail }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());

  const { videoRef, isLoaded, error } = useHls(src);

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

  const toggleFullscreen = () => {
    if (containerRef.current?.requestFullscreen) {
      if (document.fullscreenElement) document.exitFullscreen();
      else containerRef.current.requestFullscreen();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative group aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/10"
      onMouseMove={() => {
        setShowControls(true);
        setTimeout(() => setShowControls(false), 3000);
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 z-20">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
          <p className="text-white/60 text-sm font-medium animate-pulse">Initializing Secure Stream...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 z-20 p-6 text-center">
          <Info className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Streaming Error</h3>
          <p className="text-white/60 max-w-xs">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all"
          >
            Retry Connection
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
            x: [0, 100, 0, -100, 0],
            y: [0, 50, 100, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute text-white/5 text-[10px] sm:text-xs font-mono select-none"
        >
          {userEmail} • {timestamp} • SECURE_SESSION_{Math.random().toString(36).substring(7).toUpperCase()}
        </motion.div>
        
        <div className="absolute top-1/4 right-1/4 text-white/3 text-[8px] font-mono rotate-12 select-none">
          PROTECTED STREAM - {userEmail}
        </div>
      </div>

      {/* Custom Controls */}
      <AnimatePresence>
        {(showControls || !isPlaying) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-4 md:p-6 z-30"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-blue-500 text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  HD Secure
                </span>
                <span className="text-white/80 text-xs font-medium">Session Active</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-white/70 hover:text-white transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Center Play Button */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 pointer-events-auto shadow-2xl"
              >
                {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
              </motion.button>
            </div>

            {/* Bottom Controls */}
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="relative group/progress h-1.5 md:h-2 flex items-center cursor-pointer">
                <div className="absolute inset-0 bg-white/20 rounded-full" />
                <div 
                  className="absolute h-full bg-blue-500 rounded-full" 
                  style={{ width: `${progress}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 md:gap-6">
                  <button onClick={togglePlay} className="text-white hover:text-blue-400 transition-colors">
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  
                  <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                    <span>{Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}</span>
                    <span className="text-white/40">/</span>
                    <span>{Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}</span>
                  </div>

                  <div className="hidden md:flex items-center gap-2 group/volume">
                    <button onClick={() => setVolume(volume === 0 ? 1 : 0)} className="text-white">
                      {volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </button>
                    <div className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300">
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.1" 
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full accent-blue-500 h-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setPlaybackSpeed(playbackSpeed === 2 ? 1 : playbackSpeed + 0.25)}
                    className="text-white/80 hover:text-white text-xs font-bold w-12 text-center"
                  >
                    {playbackSpeed}x
                  </button>
                  <button onClick={toggleFullscreen} className="text-white hover:text-blue-400 transition-colors">
                    <Maximize className="w-5 h-5" />
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
