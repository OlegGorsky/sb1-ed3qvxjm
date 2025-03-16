import { ReactNode } from 'react';

export interface LessonContent {
  url?: string;
  mindmap?: string;
}

export interface Lesson {
  id: number;
  title: string;
  content?: LessonContent;
}

export interface Module {
  id: number;
  title: string;
  icon: ReactNode;
  lessons: Lesson[];
}

export interface NavigationState {
  moduleId: number | null;
  lessonId: number | null;
}