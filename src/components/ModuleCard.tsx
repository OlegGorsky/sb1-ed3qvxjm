import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Module } from '../types';

interface ModuleCardProps {
  module: Module;
  onLessonClick: (lessonId: number) => void;
}

export function ModuleCard({ module, onLessonClick }: ModuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#12121a] rounded-xl border border-purple-900/20 hover:border-purple-500/30 shadow-lg hover:shadow-purple-900/5 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 md:p-6 flex items-center justify-between group transition-all duration-300 hover:bg-[#1a1a25]"
      >
        <div className="flex items-center gap-2 md:gap-4">
          <div className="text-purple-400 bg-purple-400/10 p-2 md:p-3 rounded-lg">
            {module.icon}
          </div>
          <div className="text-left">
            <h3 className="text-base md:text-xl font-semibold mb-1 md:mb-2 text-gray-100">
              Модуль {module.id}: {module.title}
            </h3>
            <p className="text-xs md:text-base text-gray-400">
              {module.lessons.length} уроков
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-purple-400 transition-transform" />
        ) : (
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-purple-400 transition-transform" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-purple-900/20 divide-y divide-purple-900/20">
          {module.lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => onLessonClick(lesson.id)}
              className="w-full p-3 md:p-4 text-left hover:bg-[#1a1a25] transition-colors"
            >
              <div className="flex items-center">
                <span className="text-purple-400 font-medium w-6 md:w-8 text-sm md:text-base">
                  {lesson.id + 1}.
                </span>
                <span className="text-gray-300 flex-1 text-sm md:text-base">{lesson.title}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}