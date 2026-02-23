import { useRef, useState, useCallback, useEffect } from 'react';

interface UseVideoPlayerOptions {
  loop?: boolean;
  autoplay?: boolean;
}

export function useVideoPlayer(options: UseVideoPlayerOptions = {}) {
  const { loop = true, autoplay = false } = options;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const play = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        setError('Cannot play video');
      });
      setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const onLoadedData = useCallback(() => {
    setIsLoaded(true);
    if (autoplay) play();
  }, [autoplay, play]);

  const onError = useCallback(() => {
    setError('Video failed to load');
    setIsLoaded(false);
  }, []);

  const videoProps = {
    ref: videoRef,
    loop,
    muted: true,
    playsInline: true,
    onLoadedData,
    onError,
    onPlay: () => setIsPlaying(true),
    onPause: () => setIsPlaying(false),
  };

  return {
    videoRef,
    videoProps,
    isPlaying,
    isLoaded,
    isOffline,
    error,
    play,
    pause,
    toggle,
  };
}
