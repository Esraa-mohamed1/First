'use client';

import { useState, useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Internal state to trigger loader manually
let globalSetLoading: (loading: boolean) => void = () => {};

/**
 * Manually trigger the rendering loader
 * @param loading boolean
 */
export const triggerPageLoader = (loading: boolean) => {
  globalSetLoading(loading);
};

function PageLoaderContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  // Hook into the setter
  useEffect(() => {
    globalSetLoading = setLoading;
  }, []);

  useEffect(() => {
    // Show loader on path change (SPA navigation)
    setLoading(true);
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-none">
      <div className="bg-black/80 backdrop-blur-md text-white px-5 py-3 rounded-2xl flex items-center gap-3 shadow-2xl border border-white/10">
        <div className="relative">
          <Loader2 size={18} className="animate-spin text-blue-400" />
          <div className="absolute inset-0 bg-blue-400 blur-sm opacity-20 animate-pulse"></div>
        </div>
        <span className="text-xs font-black tracking-widest uppercase flex items-center gap-1">
          Rendering
          <span className="flex gap-0.5">
            <span className="animate-bounce delay-0">.</span>
            <span className="animate-bounce delay-75">.</span>
            <span className="animate-bounce delay-150">.</span>
          </span>
        </span>
      </div>
    </div>
  );
}

export default function PageLoader() {
  return (
    <Suspense fallback={null}>
      <PageLoaderContent />
    </Suspense>
  );
}
