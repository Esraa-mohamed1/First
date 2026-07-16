/**
 * useBunnyPlayer — integrates Bunny Stream's player.js SDK with a React iframe ref.
 *
 * BINDING STRATEGY
 * ────────────────
 * player.js must be bound AFTER the iframe has finished loading the src that
 * includes `?enablejsapi=1`. The correct trigger is the iframe's `onLoad` event.
 *
 * Usage in the page:
 *   const { liveCurrentTime, bindToIframe, resetPlayer, seekTo } = useBunnyPlayer(iframeRef, opts);
 *   // … on the iframe element:
 *   <iframe ref={videoRef} src={activeVideoSrc} onLoad={bindToIframe} … />
 *
 * Call resetPlayer() whenever the lesson/src changes so state is cleared before
 * the next onLoad fires.
 */

import { useEffect, useRef, useState, useCallback, RefObject } from 'react';

// ---------------------------------------------------------------------------
// Script loader (singleton — loads player.js once per page lifetime)
// ---------------------------------------------------------------------------
let scriptLoaded = false;
let scriptLoading = false;
const scriptCallbacks: Array<() => void> = [];

function loadPlayerScript(onLoad: () => void) {
  if (scriptLoaded) { onLoad(); return; }
  scriptCallbacks.push(onLoad);
  if (scriptLoading) return;

  scriptLoading = true;
  const script = document.createElement('script');
  script.src = '//assets.mediadelivery.net/playerjs/playerjs-latest.min.js';
  script.async = true;
  script.onload = () => {
    scriptLoaded = true;
    scriptLoading = false;
    scriptCallbacks.splice(0).forEach((cb) => cb());
  };
  document.head.appendChild(script);
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface PlayerInstance {
  on(event: string, callback: (...args: any[]) => void): void;
  off(event: string, callback: (...args: any[]) => void): void;
  setCurrentTime(seconds: number): void;
  getCurrentTime(callback: (value: number) => void): void;
  getDuration(callback: (value: number) => void): void;
  play(): void;
  pause(): void;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    playerjs?: { Player: new (el: HTMLIFrameElement) => PlayerInstance };
  }
}

export interface UseBunnyPlayerOptions {
  /**
   * Fired when progress crosses a 5% threshold OR every 10 seconds.
   * Already throttled — do not debounce again.
   */
  onProgress?: (currentTime: number, duration: number, percentage: number) => void;
  /** Fired when `ended` event fires */
  onEnded?: (duration: number) => void;
  /** Fired on `play` */
  onPlay?: () => void;
  /** Fired on `pause` — progress is already flushed inside the hook */
  onPause?: () => void;
  /** Watch-completion threshold (0–100). Defaults to 90. */
  completionThreshold?: number;
  /** Called once when percentage >= completionThreshold */
  onCompleted?: () => void;
}

export interface UseBunnyPlayerReturn {
  /** true once the player has fired its `ready` event */
  playerReady: boolean;
  /** Live playback position in seconds — updates on every timeupdate (unthrottled) */
  liveCurrentTime: number;
  /** Total video duration in seconds */
  duration: number;
  /**
   * Bind player.js to the iframe.
   * Pass this directly as the `onLoad` prop on the <iframe> element.
   * It waits for player.js to be available first.
   */
  bindToIframe: () => void;
  /** Imperatively seek the player */
  seekTo: (seconds: number) => void;
  /** Call when the lesson/src changes to clear all state before the next onLoad */
  resetPlayer: () => void;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useBunnyPlayer(
  iframeRef: RefObject<HTMLIFrameElement | null>,
  options: UseBunnyPlayerOptions = {}
): UseBunnyPlayerReturn {
  const [playerReady, setPlayerReady] = useState(false);
  const [liveCurrentTime, setLiveCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playerRef = useRef<PlayerInstance | null>(null);
  const durationRef = useRef(0);
  const completedFiredRef = useRef(false);

  // Throttle: track last sent % and last sent timestamp
  const lastSentPercentRef = useRef(-1);
  const lastSentTimeRef = useRef(0);
  const PERCENT_STEP = 5;
  const TIME_STEP_MS = 10_000;

  // Keep options ref stable so event handlers always see the latest callbacks
  const optionsRef = useRef(options);
  useEffect(() => { optionsRef.current = options; });

  // ---------------------------------------------------------------------------
  // Core binding — called by bindToIframe once the iframe has loaded
  // ---------------------------------------------------------------------------
  const doBindPlayer = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    if (!window.playerjs) return;

    // Tear down any previous player instance cleanly
    if (playerRef.current) {
      try { playerRef.current.off('timeupdate', handleTimeUpdate); } catch (_) {}
      try { playerRef.current.off('play', handlePlay); } catch (_) {}
      try { playerRef.current.off('pause', handlePause); } catch (_) {}
      try { playerRef.current.off('ended', handleEnded); } catch (_) {}
    }

    const player = new window.playerjs.Player(iframe);
    playerRef.current = player;

    player.on('ready', () => {
      setPlayerReady(true);
      player.getDuration((d: number) => {
        durationRef.current = d;
        setDuration(d);
      });
    });

    player.on('timeupdate', handleTimeUpdate);
    player.on('play', handlePlay);
    player.on('pause', handlePause);
    player.on('ended', handleEnded);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iframeRef]);

  // ---------------------------------------------------------------------------
  // Event handlers (use ref to avoid stale closures)
  // ---------------------------------------------------------------------------
  function handleTimeUpdate({ seconds: rawSeconds }: { seconds: number }) {
    const seconds = Math.floor(rawSeconds); // backend requires integer seconds
    const dur = durationRef.current;
    const pct = dur > 0 ? Math.min(100, Math.round((seconds / dur) * 100)) : 0;

    // Always update live time (UI + note timestamps)
    setLiveCurrentTime(seconds);

    // Completion check
    const threshold = optionsRef.current.completionThreshold ?? 90;
    if (!completedFiredRef.current && pct >= threshold) {
      completedFiredRef.current = true;
      optionsRef.current.onCompleted?.();
    }

    // Throttle: fire onProgress only every PERCENT_STEP or TIME_STEP_MS
    const now = Date.now();
    if (
      pct - lastSentPercentRef.current >= PERCENT_STEP ||
      now - lastSentTimeRef.current >= TIME_STEP_MS
    ) {
      lastSentPercentRef.current = pct;
      lastSentTimeRef.current = now;
      optionsRef.current.onProgress?.(seconds, dur, pct);
    }
  }

  function handlePlay() { optionsRef.current.onPlay?.(); }

  function handlePause() {
    // Flush current position on pause regardless of throttle
    const dur = durationRef.current;
    if (playerRef.current && dur > 0) {
      playerRef.current.getCurrentTime((t: number) => {
        const pct = Math.min(100, Math.round((t / dur) * 100));
        lastSentPercentRef.current = pct;
        lastSentTimeRef.current = Date.now();
        optionsRef.current.onProgress?.(t, dur, pct);
        optionsRef.current.onPause?.();
      });
    } else {
      optionsRef.current.onPause?.();
    }
  }

  function handleEnded() {
    const dur = durationRef.current;
    optionsRef.current.onProgress?.(dur, dur, 100);
    optionsRef.current.onEnded?.(dur);
    if (!completedFiredRef.current) {
      completedFiredRef.current = true;
      optionsRef.current.onCompleted?.();
    }
  }

  // ---------------------------------------------------------------------------
  // bindToIframe — the public API, meant to be used as the iframe's onLoad prop
  // ---------------------------------------------------------------------------
  const bindToIframe = useCallback(() => {
    // Wait for the player.js script to be available, then bind
    loadPlayerScript(() => {
      // Small tick so the iframe's new document is ready
      setTimeout(doBindPlayer, 150);
    });
  }, [doBindPlayer]);

  // ---------------------------------------------------------------------------
  // resetPlayer — call this BEFORE the iframe src changes (on lesson change)
  // ---------------------------------------------------------------------------
  const resetPlayer = useCallback(() => {
    setPlayerReady(false);
    setLiveCurrentTime(0);
    setDuration(0);
    durationRef.current = 0;
    lastSentPercentRef.current = -1;
    lastSentTimeRef.current = 0;
    completedFiredRef.current = false;
    playerRef.current = null;
  }, []);

  // ---------------------------------------------------------------------------
  // seekTo — imperatively seek
  // ---------------------------------------------------------------------------
  const seekTo = useCallback((seconds: number) => {
    playerRef.current?.setCurrentTime(seconds);
  }, []);

  return { playerReady, liveCurrentTime, duration, bindToIframe, seekTo, resetPlayer };
}
