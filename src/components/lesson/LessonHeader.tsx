import React from 'react';
import type { Module } from '../../types';

interface LessonHeaderProps {
  module: Module;
  lessonTitle: string;
  onBack: () => void;
}

export function LessonHeader({ module, lessonTitle, onBack }: LessonHeaderProps) {
  return (
    <>
      <button
        onClick={onBack}
        className="text-purple-400 hover:text-purple-300 flex items-center gap-2 bg-purple-400/10 px-4 py-2 rounded-lg transition-colors"
      >
        ← Назад к программе
      </button>

      <div className="flex items-center gap-2 text-purple-400">
        {module.icon}
        <span className="text-sm">Модуль {module.id}: {module.title}</span>
      </div>
      
      <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
        {lessonTitle}
      </h1>
    </>
  );
}