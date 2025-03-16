import React, { useEffect } from 'react';
import { VideoControls } from './VideoControls';
import { useVideo } from './useVideo';
import { X } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  onClose?: () => void;
  isPopup?: boolean;
}

export function VideoPlayer({ url, onClose, isPopup = false }: VideoPlayerProps) {
  const {
    containerRef,
    videoRef,
    isPlaying,
    isFullscreen,
    progress,
    duration,
    playbackSpeed,
    showSpeedMenu,
    speedMenuRef,
    handlePlayPause,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleSeek,
    handleSpeedChange,
    handleFullscreenToggle,
    PLAYBACK_SPEEDS,
    setShowSpeedMenu,
    setIsPlaying,
  } = useVideo();

  // Auto-play when mounted in popup mode
  useEffect(() => {
    if (isPopup && videoRef.current) {
      const playVideo = async () => {
        try {
          await videoRef.current?.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Auto-play failed:', error);
        }
      };
      playVideo();
    }
  }, [isPopup, videoRef]);

  if (isPopup) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white bg-black/20 p-2 rounded-lg backdrop-blur-sm transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div 
          ref={containerRef}
          className="relative w-full max-w-5xl bg-[#0a0a0f] rounded-lg overflow-hidden"
        >
          <video
            ref={videoRef}
            className="w-full aspect-video"
            src={url}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            controlsList="nodownload"
            playsInline
            onClick={handlePlayPause}
          >
            Your browser does not support the video tag.
          </video>

          <VideoControls
            isPlaying={isPlaying}
            isFullscreen={isFullscreen}
            progress={progress}
            duration={duration}
            playbackSpeed={playbackSpeed}
            showSpeedMenu={showSpeedMenu}
            speedMenuRef={speedMenuRef}
            playbackSpeeds={PLAYBACK_SPEEDS}
            onPlayPause={handlePlayPause}
            onSeek={handleSeek}
            onSpeedChange={handleSpeedChange}
            onSpeedMenuToggle={() => setShowSpeedMenu(!showSpeedMenu)}
            onFullscreenToggle={handleFullscreenToggle}
          />
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative aspect-video w-full bg-[#0a0a0f] rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        src={url}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        controlsList="nodownload"
        playsInline
        onClick={handlePlayPause}
      >
        Your browser does not support the video tag.
      </video>

      {!isPlaying && (
        <button 
          onClick={handlePlayPause}
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors z-10"
          aria-label="Play video"
        >
          <div className="bg-purple-500/80 hover:bg-purple-500 rounded-full p-5 transition-colors transform hover:scale-110">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
          </div>
        </button>
      )}

      <VideoControls
        isPlaying={isPlaying}
        isFullscreen={isFullscreen}
        progress={progress}
        duration={duration}
        playbackSpeed={playbackSpeed}
        showSpeedMenu={showSpeedMenu}
        speedMenuRef={speedMenuRef}
        playbackSpeeds={PLAYBACK_SPEEDS}
        onPlayPause={handlePlayPause}
        onSeek={handleSeek}
        onSpeedChange={handleSpeedChange}
        onSpeedMenuToggle={() => setShowSpeedMenu(!showSpeedMenu)}
        onFullscreenToggle={handleFullscreenToggle}
      />
    </div>
  );
}