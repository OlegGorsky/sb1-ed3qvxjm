import React, { useEffect } from 'react';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        MainButton: {
          color: string;
        };
        headerColor: string;
        backgroundColor: string;
        BackButton: {
          show: () => void;
          hide: () => void;
        };
        expand: () => void;
        setBackgroundColor: (color: string) => void;
      };
    };
  }
}

export function Header() {
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Установка цвета верхней панели
      tg.headerColor = '#1a1a25';
      
      // Установка цвета фона
      tg.backgroundColor = '#0a0a0f';
      
      // Расширяем на весь экран
      tg.expand();
    }
  }, []);

  return (
    <header className="bg-gradient-to-b from-[#12121a] to-[#0a0a0f] py-6 px-4 shadow-lg border-b border-purple-900/20">
      <div className="text-center">
        <p className="text-sm md:text-base text-blue-400 mb-2">Практический курс</p>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
          WebApp Master
        </h1>
      </div>
    </header>
  );
}