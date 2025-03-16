import React from 'react';
import { Download } from 'lucide-react';

interface MindMapDownloadProps {
  url: string;
}

export function MindMapDownload({ url }: MindMapDownloadProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full flex items-center justify-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 px-4 py-3 rounded-lg transition-colors"
    >
      <Download className="w-5 h-5" />
      Скачать майнд-карту урока
    </a>
  );
}