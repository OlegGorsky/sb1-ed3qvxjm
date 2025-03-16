import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { Module, NavigationState } from '../types';

interface NavigationProps {
  modules: Module[];
  currentNav: NavigationState;
  onNavigate: (nav: NavigationState) => void;
}

export function Navigation({ modules, currentNav, onNavigate }: NavigationProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-purple-500 hover:bg-purple-600 transition-colors py-2 md:py-3 px-1 rounded-r-lg shadow-lg group"
      >
        <ChevronRight className={`w-4 h-4 md:w-6 md:h-6 text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <nav className={`fixed top-0 left-0 h-full w-[80vw] md:w-96 bg-gradient-to-b from-[#12121a] to-[#0a0a0f] transform transition-transform duration-300 ease-in-out shadow-xl z-40 overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 md:p-8">
          <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-6 md:mb-8">
            Навигация по курсу
          </h3>
          <div className="space-y-6 md:space-y-8">
            {modules.map((module) => (
              <div key={module.id} className="space-y-3 md:space-y-4 bg-[#1a1a25] rounded-xl p-4 md:p-6">
                <button
                  onClick={() => {
                    onNavigate({ moduleId: module.id, lessonId: null });
                    setIsOpen(false);
                  }}
                  className={`w-full text-left rounded-lg transition-colors ${
                    currentNav.moduleId === module.id && !currentNav.lessonId
                      ? 'text-purple-300'
                      : 'text-gray-100 hover:text-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="text-purple-400 bg-purple-400/10 p-2 md:p-3 rounded-lg">
                      {module.icon}
                    </div>
                    <div>
                      <span className="font-semibold text-base md:text-lg block mb-1">Модуль {module.id}</span>
                      <span className="font-medium text-sm md:text-base block">{module.title}</span>
                    </div>
                  </div>
                </button>
                <div className="space-y-2 md:space-y-3">
                  {module.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        onNavigate({ moduleId: module.id, lessonId: lesson.id });
                        setIsOpen(false);
                      }}
                      className={`w-full text-left py-2 md:py-3 px-4 md:px-6 rounded-lg transition-colors ${
                        currentNav.moduleId === module.id && currentNav.lessonId === lesson.id
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'text-gray-400 hover:bg-purple-500/10 hover:text-purple-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-purple-400 font-medium w-6 md:w-8 text-sm md:text-base">{lesson.id + 1}.</span>
                        <span className="flex-1 text-sm md:text-base">{lesson.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}