import React, { useState } from 'react';
import { BookOpen, Code, DollarSign, GraduationCap, Layers } from 'lucide-react';
import { Header } from './components/Header';
import { ProgramOverview } from './components/ProgramOverview';
import { LessonPage } from './components/LessonPage';
import { Navigation } from './components/Navigation';
import { SplashScreen } from './components/SplashScreen';
import type { Module, NavigationState } from './types';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [navigation, setNavigation] = useState<NavigationState>({
    moduleId: null,
    lessonId: null
  });

  const modules: Module[] = [
    {
      id: 0,
      title: "База",
      icon: <BookOpen className="w-6 h-6" />,
      lessons: [
        { id: 0, title: "Что такое вебапп-приложение и в чем его преимущества" },
        { id: 1, title: "Возможности вебапп-приложений" },
        { id: 2, title: "10 видов вебаппов, за которые платят" }
      ]
    },
    {
      id: 1,
      title: "Подготовка к работе",
      icon: <Layers className="w-6 h-6" />,
      lessons: [
        { id: 0, title: "Настройка Телеграм для вебаппа" },
        { id: 1, title: "Обзор нейросетей для создания вебаппов" },
        { id: 2, title: "Обзор сервисов для хранения данных" },
        { id: 3, title: "Обзор и установка сервиса для интеграций" },
        { id: 4, title: "Обзор сервисов для размещения готового вебаппа" },
        { id: 5, title: "Обзор сервиса для чат-ботов" },
        { id: 6, title: "Проектирование вебаппов при помощи нейросетей" },
        { id: 7, title: "Простая оплата зарубежных сервисов" }
      ]
    },
    {
      id: 2,
      title: "Пишем код для вебаппов",
      icon: <Code className="w-6 h-6" />,
      lessons: [
        { id: 0, title: "Каскадный метод работы с нейросетью" },
        { id: 1, title: "Особенности вебаппов и дополнительные промты для них" },
        { id: 2, title: "Связка вебаппа с базой данных и сервисом интеграций" },
        { id: 3, title: "Связка вебаппа и сервиса для чат-ботов" },
        { id: 4, title: "Способы хранения изображений и видео для вебаппов" },
        { id: 5, title: "Отладка ошибок и доработка вебаппа" }
      ]
    },
    {
      id: 3,
      title: "Продажи вебаппов",
      icon: <DollarSign className="w-6 h-6" />,
      lessons: [
        { id: 0, title: "Упаковка себя и своих услуг" },
        { id: 1, title: "Все методы поиска клиентов на вебаппы" },
        { id: 2, title: "Как продавать вебапп потенциальному клиенту" },
        { id: 3, title: "Как вести соцсети специалисту по созданию вебаппов" }
      ]
    },
    {
      id: 4,
      title: "Дополнительный модуль",
      icon: <GraduationCap className="w-6 h-6" />,
      lessons: [
        { id: 0, title: "Сервис для нейрокодинга, в том числе со смартфона" },
        { id: 1, title: "Нейросети для генерации изображений" },
        { id: 2, title: "Готовый код вебаппов для доработки под себя" },
        { id: 3, title: "Дополнительные промты к нейросети для разработки" },
        { id: 4, title: "Бесплатный быстрый VPN для доступа к заблокированным ресурсам и нейросетям" }
      ]
    }
  ];

  const currentModule = navigation.moduleId !== null ? modules[navigation.moduleId] : null;

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} modules={modules} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      <Header />
      <Navigation
        modules={modules}
        currentNav={navigation}
        onNavigate={setNavigation}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {!currentModule || navigation.lessonId === null ? (
          <ProgramOverview
            modules={modules}
            onSelectLesson={(moduleId, lessonId) => setNavigation({ moduleId, lessonId })}
          />
        ) : (
          <LessonPage
            module={currentModule}
            lessonId={navigation.lessonId}
            onBack={() => setNavigation({ moduleId: null, lessonId: null })}
          />
        )}
      </main>
    </div>
  );
}

export default App;