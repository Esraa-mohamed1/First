import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Lesson } from '@/types/course';

interface PlayerState {
  currentLesson: Lesson | null;
  isPlaying: boolean;
  playbackSpeed: number;
  autoNext: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  isSidebarOpen: boolean;
  
  setCurrentLesson: (lesson: Lesson) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  setAutoNext: (autoNext: boolean) => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  toggleSidebar: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      currentLesson: null,
      isPlaying: false,
      playbackSpeed: 1,
      autoNext: true,
      volume: 1,
      currentTime: 0,
      duration: 0,
      isSidebarOpen: true,

      setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
      setAutoNext: (autoNext) => set({ autoNext }),
      setVolume: (volume) => set({ volume }),
      setCurrentTime: (time) => set({ currentTime: time }),
      setDuration: (duration) => set({ duration }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    }),
    {
      name: 'player-storage',
      partialize: (state) => ({ 
        volume: state.volume, 
        playbackSpeed: state.playbackSpeed,
        autoNext: state.autoNext 
      }),
    }
  )
);

