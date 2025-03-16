import React, { useState, useEffect } from 'react';
import type { Module, LessonContent } from '../types';
import { VideoPlayer } from './video/VideoPlayer';
import { LessonHeader } from './lesson/LessonHeader';
import { MindMapDownload } from './lesson/MindMapDownload';
import { Play, ExternalLink } from 'lucide-react';
import { encryptUrl, storeEncryptedData, SECRET_KEY } from '../utils/crypto';
import CryptoJS from 'crypto-js';

interface LessonPageProps {
  module: Module;
  lessonId: number;
  onBack: () => void;
}

interface LessonResponse {
  row_number: number;
  module: number;
  lesson: number;
  url: string;
  mindmap: string;
}

export function LessonPage({ module, lessonId, onBack }: LessonPageProps) {
  const lesson = module.lessons[lessonId];
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const fetchLessonContent = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('https://gorskybase.store/webhook/70cebc44-aea4-469d-b968-8515fb787ecb', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            module: module.id,
            lesson: lessonId + 1
          })
        });
        
        if (!response.ok) {
          throw new Error('Не удалось загрузить содержимое урока');
        }

        const data: LessonResponse[] = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Неверный формат данных');
        }

        const content = data.find(item => 
          item.module === module.id && 
          item.lesson === (lessonId + 1)
        );
        
        if (content) {
          setLessonContent({
            url: typeof content.url === 'string' ? content.url : undefined,
            mindmap: typeof content.mindmap === 'string' && content.mindmap.trim() !== '' ? content.mindmap : undefined
          });
        } else {
          setLessonContent(null);
        }
      } catch (error) {
        console.error('Error fetching lesson content:', error);
        setError('Произошла ошибка при загрузке урока');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessonContent();
  }, [module.id, lessonId]);

  const handleOpenInBrowser = () => {
    if (!lessonContent?.url) return;

    const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || 'anonymous';
    const token = encryptUrl(lessonContent.url, userId);
    
    // Store encrypted data before opening the link
    const [shortId] = token.split('.');
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify({
      url: lessonContent.url,
      userId,
      source: 'telegram-webapp',
      timestamp: Date.now(),
      shortId
    }), SECRET_KEY).toString();
    storeEncryptedData(shortId, encrypted);
    
    const videoPageUrl = `/video?token=${token}`;
    window.open(videoPageUrl, '_blank');
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-[#12121a] p-4 md:p-6 rounded-xl border border-purple-900/20">
        <div className="space-y-4 md:space-y-6">
          <LessonHeader
            module={module}
            lessonTitle={lesson.title}
            onBack={onBack}
          />

          <div className="space-y-3 md:space-y-4">
            {isLoading ? (
              <div className="relative aspect-video w-full bg-[#0a0a0f] rounded-lg overflow-hidden flex items-center justify-center">
                <div className="w-6 h-6 md:w-8 md:h-8 border-3 md:border-4 border-purple-400/20 border-t-purple-400 rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="relative aspect-video w-full bg-[#0a0a0f] rounded-lg overflow-hidden flex items-center justify-center">
                <p className="text-base md:text-lg text-red-400">{error}</p>
              </div>
            ) : lessonContent?.url ? (
              <>
                <div className="relative aspect-video w-full bg-[#0a0a0f] rounded-lg overflow-hidden group">
                  <button
                    onClick={() => setShowVideo(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                  >
                    <div className="bg-purple-500/80 group-hover:bg-purple-500 rounded-full p-3 md:p-4 transition-colors transform group-hover:scale-110">
                      <Play className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                  </button>
                </div>
                {showVideo && (
                  <VideoPlayer 
                    url={lessonContent.url} 
                    isPopup={true}
                    onClose={() => setShowVideo(false)}
                  />
                )}
                <div className="flex flex-col items-center gap-2">
                  {lessonContent?.mindmap && (
                    <button
                      onClick={() => window.open(lessonContent.mindmap, '_blank')}
                      className="inline-flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                      </svg>
                      Скачать майнд-карту урока
                    </button>
                  )}
                  <button
                    onClick={handleOpenInBrowser}
                    className="inline-flex items-center gap-1.5 text-purple-400 hover:text-purple-300 px-2 py-1.5 rounded-lg hover:bg-purple-400/10 transition-colors text-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Смотреть урок в браузере
                  </button>
                </div>
              </>
            ) : (
              <div className="relative aspect-video w-full bg-[#0a0a0f] rounded-lg overflow-hidden flex items-center justify-center">
                <div className="text-center p-4 md:p-6">
                  <p className="text-base md:text-lg text-purple-200 mb-2">Видео скоро появится...</p>
                  <p className="text-xs md:text-sm text-purple-400">Мы работаем над добавлением контента для этого урока</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}