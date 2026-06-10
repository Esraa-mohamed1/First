'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

export const useHls = (src: string) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        capLevelToPlayerSize: true,
        autoStartLoad: true,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => setIsLoaded(true));
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) setError('Failed to load secure stream.');
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', () => setIsLoaded(true));
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [src]);

  return { videoRef, isLoaded, error };
};
