import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { VideoPlayer } from '../components/video/VideoPlayer';
import { decryptUrl } from '../utils/crypto';

export function VideoPage() {
  const [searchParams] = useSearchParams();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setError('Ссылка недействительна. Зайдите еще раз по ссылке из приложения');
      return;
    }

    const decrypted = decryptUrl(token);

    if (!decrypted || !decrypted.isValid) {
      setError('Ссылка недействительна. Зайдите еще раз по ссылке из приложения');
      return;
    }

    setVideoUrl(decrypted.url);
  }, [searchParams]);

  // Prevent page reload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasStartedPlaying) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasStartedPlaying]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6 bg-[#12121a] rounded-xl border border-purple-900/20">
          <p className="text-lg text-red-400 mb-4">{error}</p>
          <p className="text-sm text-purple-400">Вернитесь в приложение и откройте видео заново</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {videoUrl && (
          <VideoPlayer 
            url={videoUrl} 
            onPlay={() => setHasStartedPlaying(true)}
          />
        )}
      </div>
    </div>
  );
}