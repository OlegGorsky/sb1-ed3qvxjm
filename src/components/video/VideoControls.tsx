import React from 'react';
import { Play, Pause, Maximize, Minimize } from 'lucide-react';

interface VideoControlsProps {
  isPlaying: boolean;
  progress: number;
  duration: number;
  playbackSpeed: number;
  showSpeedMenu: boolean;
  isFullscreen: boolean;
  speedMenuRef: React.RefObject<HTMLDivElement>;
  playbackSpeeds: number[];
  onPlayPause: () => void;
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  onSpeedChange: (speed: number) => void;
  onSpeedMenuToggle: () => void;
  onFullscreenToggle: () => void;
}

export function VideoControls({
  isPlaying,
  progress,
  duration,
  playbackSpeed,
  showSpeedMenu,
  isFullscreen,
  speedMenuRef,
  playbackSpeeds,
  onPlayPause,
  onSeek,
  onSpeedChange,
  onSpeedMenuToggle,
  onFullscreenToggle,
}: VideoControlsProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300
      ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}
      ${isPlaying ? 'bg-black/0 hover:bg-gradient-to-t from-black via-black/0 to-black/40' : 'bg-gradient-to-t from-black via-black/0 to-black/40'}`}
    >
      <div className="p-4 flex justify-end gap-2">
        <div className="relative" ref={speedMenuRef}>
          <button
            onClick={onSpeedMenuToggle}
            className="text-white/80 hover:text-white bg-black/20 px-3 py-2 rounded-lg backdrop-blur-sm transition-colors text-sm font-medium"
          >
            {playbackSpeed}x
          </button>
          {showSpeedMenu && (
            <div className="absolute right-0 top-full mt-2 bg-[#1a1a25] rounded-lg shadow-lg border border-purple-900/20 overflow-hidden z-50">
              {playbackSpeeds.map((speed) => (
                <button
                  key={speed}
                  onClick={() => onSpeedChange(speed)}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors
                    ${speed === playbackSpeed 
                      ? 'bg-purple-500/20 text-purple-300' 
                      : 'text-gray-300 hover:bg-purple-500/10 hover:text-purple-300'
                    }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={onFullscreenToggle}
          className="text-white/80 hover:text-white bg-black/20 p-2 rounded-lg backdrop-blur-sm transition-colors"
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>
      </div>
      <div className="p-4 space-y-2">
        <div 
          className="h-1 bg-white/20 rounded-full cursor-pointer relative overflow-hidden"
          onClick={onSeek}
        >
          <div 
            className="absolute inset-y-0 left-0 bg-purple-400 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={onPlayPause}
            className="text-white hover:text-purple-400 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>
          <div className="text-white/80 text-sm">
            {formatTime(duration * (progress / 100))} / {formatTime(duration)}
          </div>
        </div>
      </div>
    </div>
  );
}