import React from 'react';
import type { Module } from '../types';

interface LessonListProps {
  module: Module;
  onBack: () => void;
  onSelectLesson: (lessonId: number) => void;
}

export function LessonList({ module, onBack, onSelectLesson }: LessonListProps) {
  return (
    <div>
      <button
        onClick={onBack}
        className="mb-6 text-purple-400 hover:text-purple-300 flex items-center gap-2 bg-purple-400/10 px-4 py-2 rounded-lg transition-colors"
      >
        ← Назад к программе
      </button>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="text-purple-400 bg-purple-400/10 p-3 rounded-lg">
          {module.icon}
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
          Модуль {module.id}: {module.title}
        </h2>
      </div>
      
      <div className="grid gap-4">
        {module.lessons.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => onSelectLesson(lesson.id)}
            className="w-full text-left bg-[#12121a] p-4 md:p-5 rounded-xl hover:bg-[#1a1a25] transition-all duration-300 border border-purple-900/20 hover:border-purple-500/30 shadow-md hover:shadow-purple-900/5"
          >
            <p className="text-base md:text-lg text-gray-100">
              <span className="text-purple-400 font-medium mr-2">
                {lesson.id + 1}.
              </span>
              {lesson.title}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}