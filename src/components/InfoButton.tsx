import React from 'react';
import { HelpCircle } from 'lucide-react';

interface InfoButtonProps {
  id?: string;
  onClick: (e: React.MouseEvent) => void;
  title?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const InfoButton: React.FC<InfoButtonProps> = ({
  onClick,
  title = 'Click to view plain-English explanation, scale & rules',
  className = '',
  size = 'sm'
}) => {
  const isSm = size === 'sm';

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      title={title}
      aria-label={title}
      className={`inline-flex items-center justify-center rounded-full transition-all cursor-pointer select-none active:scale-90 shrink-0 ${
        isSm ? 'w-3.5 h-3.5 text-[10px]' : 'w-4 h-4 text-[11px]'
      } bg-slate-200/80 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-500 dark:hover:text-slate-950 font-mono font-bold ${className}`}
    >
      i
    </button>
  );
};
