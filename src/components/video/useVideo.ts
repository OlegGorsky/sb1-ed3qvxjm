import { useState, useRef, useEffect } from 'react';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        isExpanded?: boolean;
        expand: () => void;
      };
    };
  }
}

export function useVideo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const speedMenuRef = useRef<HTMLDivElement>(null);

  const PLAYBACK_SPEEDS = [0.5, 1, 1.25, 1.5, 2];

  // Handle screen orientation changes
  useEffect(() => {
    const handleOrientationChange = async () => {
      if (!containerRef.current) return;

      try {
        const isLandscape = window.screen.orientation?.type.includes('landscape') ||
                          window.orientation === 90 ||
                          window.orientation === -90;

        if (isLandscape && !isFullscreen) {
          await enterFullscreen(containerRef.current);
        } else if (!isLandscape && isFullscreen) {
          await exitFullscreen();
        }
      } catch (error) {
        console.error('Orientation change error:', error);
      }
    };

    // Listen for orientation changes
    window.addEventListener('orientationchange', handleOrientationChange);
    if (window.screen.orientation) {
      window.screen.orientation.addEventListener('change', handleOrientationChange);
    }

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      if (window.screen.orientation) {
        window.screen.orientation.removeEventListener('change', handleOrientationChange);
      }
    };
  }, [isFullscreen]);

  // Handle click outside speed menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (speedMenuRef.current && !speedMenuRef.current.contains(event.target as Node)) {
        setShowSpeedMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      ));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const enterFullscreen = async (element: HTMLElement) => {
    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        await (element as any).mozRequestFullScreen();
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
    } catch (error) {
      console.error('Exit fullscreen error:', error);
    }
  };

  const handleFullscreenToggle = async () => {
    if (!containerRef.current) return;

    if (isFullscreen) {
      await exitFullscreen();
    } else {
      await enterFullscreen(containerRef.current);
    }
  };

  const handlePlayPause = async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            await playPromise;
          }
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error('Playback error:', error);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const width = bounds.width;
      const percentage = Math.max(0, Math.min(1, x / width));
      const newTime = percentage * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setProgress(percentage * 100);
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSpeedMenu(false);
    }
  };

  return {
    containerRef,
    videoRef,
    isPlaying,
    isFullscreen,
    progress,
    duration,
    playbackSpeed,
    showSpeedMenu,
    speedMenuRef,
    PLAYBACK_SPEEDS,
    handlePlayPause,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleSeek,
    handleSpeedChange,
    handleFullscreenToggle,
    setIsPlaying,
    setShowSpeedMenu,
  };
}