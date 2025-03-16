import React from 'react';
import { ModuleCard } from './ModuleCard';
import type { Module } from '../types';

interface ProgramOverviewProps {
  modules: Module[];
  onSelectLesson: (moduleId: number, lessonId: number) => void;
}

export function ProgramOverview({ modules, onSelectLesson }: ProgramOverviewProps) {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
          Программа курса
        </h2>
      </div>

      <div className="grid gap-6">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            onLessonClick={(lessonId) => onSelectLesson(module.id, lessonId)}
          />
        ))}
      </div>
    </>
  );
}