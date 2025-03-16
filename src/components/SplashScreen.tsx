import React, { useEffect, useState } from 'react';
import { Code, Terminal, Braces, Database, Settings } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
  modules: any[];
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: {
          user?: {
            id: number;
          };
        };
        headerColor: string;
        backgroundColor: string;
        setBackgroundColor: (color: string) => void;
        expand: () => void;
      };
    };
  }
}

export function SplashScreen({ onFinish, modules }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  const icons = [
    { Icon: Code, delay: 0 },
    { Icon: Terminal, delay: 200 },
    { Icon: Braces, delay: 400 },
    { Icon: Database, delay: 600 },
    { Icon: Settings, delay: 800 },
  ];

  // Set Telegram WebApp colors
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Установка цвета верхней панели
      tg.headerColor = '#1a1a25';
      
      // Установка цвета фона
      tg.setBackgroundColor('#0a0a0f');
      tg.backgroundColor = '#0a0a0f';
      
      // Расширяем на весь экран
      tg.expand();
    }
  }, []);

  // Separate effect for access check to ensure it runs immediately
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
        
        console.log('Checking access for userId:', userId);
        
        if (!userId) {
          console.log('No userId found, denying access');
          setHasAccess(false);
          return;
        }

        const response = await fetch(`https://gorskybase.store/webhook/0c7daaea-610f-4559-afb1-f4793caa8fb2?userId=${userId}`, {
          method: 'GET'
        });

        if (!response.ok) {
          throw new Error(`Failed to check access: ${response.status}`);
        }

        const data = await response.json();
        console.log('Access check response:', data);
        setHasAccess(data.set === "yes");
      } catch (error) {
        console.error('Error checking access:', error);
        setHasAccess(false);
      }
    };

    checkAccess();
  }, []);

  // Separate effect for progress animation
  useEffect(() => {
    if (hasAccess === null) return;

    let animationFrame: number;
    const startTime = Date.now();
    const duration = 2000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        if (hasAccess) {
          setTimeout(() => onFinish(), 500);
        } else {
          setShowAccessDenied(true);
        }
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [hasAccess, onFinish]);

  if (showAccessDenied) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0f] flex flex-col items-center justify-center z-50 p-6">
        <div className="text-center mb-8 animate-fade-in">
          <p className="text-sm md:text-base text-blue-400 mb-2">Практический курс</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-8">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              WebApp Master
            </span>
          </h1>
          <div className="max-w-md mx-auto bg-[#12121a] p-6 rounded-xl border border-purple-500/20">
            <p className="text-gray-300 text-lg mb-4">
              Для доступа к курсу необходимо приобрести подписку
            </p>
            <p className="text-gray-400 mb-6">
              Свяжитесь с администратором для получения доступа
            </p>
            <a
              href="https://t.me/oleggorskyj"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Написать администратору
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0a0a0f] flex flex-col items-center justify-center z-50">
      <div className="text-center mb-16 animate-fade-in">
        <p className="text-sm md:text-base text-blue-400 mb-2">Практический курс</p>
        <h1 className="text-4xl md:text-5xl font-bold">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            WebApp Master
          </span>
        </h1>
      </div>

      <div className="flex justify-center gap-2 mb-16">
        {icons.map(({ Icon, delay }, index) => (
          <div
            key={index}
            className="animate-bounce"
            style={{
              animation: 'bounce 1s infinite',
              animationDelay: `${delay}ms`,
              animationTimingFunction: 'cubic-bezier(0.28, 0.84, 0.42, 1)'
            }}
          >
            <div className="bg-[#12121a] p-3 rounded-xl shadow-lg border border-purple-500/20">
              <Icon 
                className="w-6 h-6 text-purple-400" 
                style={{
                  animation: 'pulse 2s infinite',
                  animationDelay: `${delay}ms`
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="w-64 mx-auto">
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}